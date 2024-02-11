import search
import config
import numpy as np
import psql
import utils

from sentence_transformers import SentenceTransformer

from datetime import datetime

import secrets
from urllib.parse import urlencode
import requests
from werkzeug.security import generate_password_hash, check_password_hash

from flask import (
	Flask, 
	request, 
	current_app, 
	session, 
	url_for, 
	abort, 
	redirect,
	jsonify,
	make_response
)

from flask_jwt_extended import (
	create_access_token, 
	get_jwt, 
	get_jwt_identity, 
	unset_jwt_cookies, 
	jwt_required,
	JWTManager
)

from flask_login import (
	LoginManager, 
	UserMixin, 
	login_user, 
	logout_user, 
	login_required, 
	UserMixin, 
	current_user
)

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


def sort_papers(papers, sort_type):
	match sort_type:
		case "relevant":
			return papers
		case "asc":
			return sorted(papers, key=lambda x: datetime.strptime(x['date'], "%a, %d %b %Y"))
		case "desc":
			return sorted(papers, key=lambda x: datetime.strptime(x['date'], "%a, %d %b %Y"), reverse=True)


class User(UserMixin):
		def __init__(self, id, username, email):
			self.id = id
			self.username = username
			self.email = email


def create_app():
	app = Flask(__name__)

	limiter = Limiter(
		get_remote_address,
		app=app,
		default_limits=["200 per day", "50 per hour"]
	)

	app.config["JWT_TOKEN_LOCATION"] = ["cookies"]  # Enable JWT extraction from cookies
	app.config["JWT_SECRET_KEY"] = config.jwt_secret_key
	app.config["JWT_COOKIE_SECURE"] = True  # Use secure cookies for production (over HTTPS only)
	app.config["JWT_COOKIE_CSRF_PROTECT"] = False

	app.config['OAUTH2_PROVIDERS'] = {
		# Google OAuth 2.0 documentation:
		# https://developers.google.com/identity/protocols/oauth2/web-server#httprest
		'google': {
			'client_id': config.google_client_id,
			'client_secret': config.google_client_secret,
			'authorize_url': 'https://accounts.google.com/o/oauth2/auth',
			'token_url': 'https://accounts.google.com/o/oauth2/token',
			'userinfo': {
				'url': 'https://www.googleapis.com/oauth2/v3/userinfo',
				'email': lambda json: json['email'],
			},
			'scopes': ['https://www.googleapis.com/auth/userinfo.email'],
		},
	}

	model = SentenceTransformer('all-MiniLM-L6-v2')

	jwt = JWTManager(app)
	login_manager = LoginManager(app)

	@app.route('/api/v1/create_account', methods=['POST'])
	@limiter.limit("5/second")
	def create_account():
		"""
		Create a new user account
		
		Requires
			- username: string
			- email: string
			- password: string, (len >= 12)
		"""
		username = request.json['username']
		email = request.json['email']
		password = request.json['password']

		# Error checking
		if not username:
			return jsonify({'error:' 'missing username field'}), 400

		if not email:
			return jsonify({'error:' 'missing email field'}), 400

		if not password:
			return jsonify({'error:' 'missing password field'}), 400

		if len(password) < 12:
			return jsonify({'error:' 'password does not meet the security requirements (minimum of 12 characters)'}), 400

		# Existing data checking
		if psql.get_user_from_username(username):
			return jsonify({'error': 'username already exists'}), 409

		if psql.get_user_from_email(email):
			return jsonify({'error:' 'email already registered to an account'}), 409

		# Create new account
		password_hash = generate_password_hash(password)

		user_data = psql.create_user(username=username, email=email, password_hash=password_hash)
		if not user_data: 
			print("Error: Create new account not successful")
			abort(401)
		
		user = User(id=user_data['id'], username=user_data['username'], email=user_data['email'])

		access_token = create_access_token(identity=user.id, expires_delta=False)
		res = make_response(redirect('https://rapidpapers.dev'))
		res.set_cookie('access_token_cookie', access_token, samesite='Lax', domain='rapidpapers.dev')

		return res


	@app.route('/api/v1/login', methods=['POST'])
	@limiter.limit("5/second")
	def login():
		"""
		Login to the site
		
		Requires:
			- username/email: string
			- password: string
		"""
		user = request.json['user']
		password = request.json['password']

		# Error checking
		if not user:
			return jsonify({'error:' 'missing username/email field'}), 400

		if not password:
			return jsonify({'error:' 'missing password field'}), 400

		# Check user credentials
		password_hash = generate_password_hash(password)

		authorise = False
		
		if user_data := psql.get_user_from_username(user):
			if check_password_hash(user_data['password_hash'], password):
				authorise = True
		elif user_data := psql.get_user_from_email(user):
			if check_password_hash(user_data['password_hash'], password):
				authorise = True
		else:
			return jsonify({'error': 'username or email does not exist'}), 404

		if not authorise:
			return jsonify({'error': 'incorrect credentials'}), 401

		# Create user credentials
		user = User(id=user_data['id'], username=user_data['username'], email=user_data['email'])

		access_token = create_access_token(identity=user.id, expires_delta=False)
		res = make_response(redirect('https://rapidpapers.dev'))
		res.set_cookie('access_token_cookie', access_token, samesite='Lax', domain='rapidpapers.dev')

		return res



	@app.route('/api/v1/authorise/<provider>')
	@limiter.limit("5/second")
	def oauth2_authorize(provider):
		"""
		Authorise user with OAuth2
		
		Args:
			- provider: string
		"""
		abort(501)

		provider_data = current_app.config['OAUTH2_PROVIDERS'].get(provider)

		if provider_data is None:
			abort(404)

		# create a query string with all the OAuth2 parameters
		qs = urlencode({
			'client_id': provider_data['client_id'],
			'redirect_uri': url_for('oauth2_callback', provider=provider, _external=True),
			'response_type': 'code',
			'scope': ' '.join(provider_data['scopes']),
			'state': secrets.token_urlsafe(16),
		})

		redirect_url = provider_data['authorize_url'] + '?' + qs

		# redirect the user to the OAuth2 provider authorization URL
		return {'redirect_url': redirect_url}


	@app.route('/api/v1/callback/<provider>')	
	@limiter.limit("5/second")
	def oauth2_callback(provider):
		"""
		Callback function after authorising with OAuth2
		
		Args:
			- provider: string
		"""
		abort(501)

		provider_data = current_app.config['OAUTH2_PROVIDERS'].get(provider)
		if provider_data is None:
			abort(404)

		# if there was an authentication error, flash the error messages and exit
		if 'error' in request.args:
			for k, v in request.args.items():
				if k.startswith('error'):
					flash(f'{k}: {v}')
			return redirect(url_for('index'))

		# make sure that the authorization code is present
		if 'code' not in request.args:
			print("Error: Authorization code not present")
			abort(401)

		# exchange the authorization code for an access token
		response = requests.post(provider_data['token_url'], data={
			'client_id': provider_data['client_id'],
			'client_secret': provider_data['client_secret'],
			'code': request.args['code'],
			'grant_type': 'authorization_code',
			'redirect_uri': url_for('oauth2_callback', provider=provider,
									_external=True),
		}, headers={'Accept': 'application/json'})

		if response.status_code != 200:
			print("Error: Request access token not successful")
			abort(401)

		oauth2_token = response.json().get('access_token')

		if not oauth2_token:
			print("Error: No OAuth2 token found")
			abort(401)

		# use the access token to get the user's email address
		response = requests.get(provider_data['userinfo']['url'], headers={
			'Authorization': 'Bearer ' + oauth2_token,
			'Accept': 'application/json',
		})
		if response.status_code != 200:
			print("Error: Request user's email address not successful")
			abort(401)

		email = provider_data['userinfo']['email'](response.json())

		user_data = psql.get_user_from_email(email)

		if user_data is None:
			user_data = psql.create_user(username=email.split('@')[0], email=email)
			if not user_data: 
				print("Error: Create new account not successful")
				abort(401)
		
		user = User(id=user_data['id'], username=user_data['username'], email=user_data['email'])

		access_token = create_access_token(identity=user.id, expires_delta=False)
		res = make_response(redirect('http://127.0.0.1:9000/'))
		res.set_cookie('access_token_cookie', access_token, secure=False, httponly=True, samesite='Lax', domain='127.0.0.1')

		return res


	@app.route('/api/v1/profile')
	@limiter.limit("20/second")
	@jwt_required()
	def get_user_profile():
		"""
		Gets the user's information

		"""
		user_id = get_jwt_identity()
		user_data = psql.get_user(user_id)
		
		if not user_data:
			return jsonify({"msg": "User not found"}), 404

		return jsonify(user_data), 200

	
	@app.route('/api/v1/updatepassword', methods=['POST'])
	@limiter.limit('10/second')
	@jwt_required()
	def change_user_password():
		"""
		Changes the user's password

		Requires
			- old_password: string
			- new_password: string
			- confirm_new_password: string
		"""
		user_id = get_jwt_identity()
		if not user_id:
			abort(401)

		user = request.json['user']
		old_password = request.json['old_password']
		new_password = request.json['new_password']
		confirm_new_password = request.json['confirm_new_password']
		
		# Check inputs
		if not user:
			return jsonify({'error:' 'missing user field'}), 400	

		if not old_password:
			return jsonify({'error:' 'missing old password field'}), 400	

		if not new_password:
			return jsonify({'error:' 'missing new password field'}), 400

		if not confirm_new_password:
			return jsonify({'error:' 'missing confirm new password field'}), 400

		# Check user credentials
		if user_data := psql.get_user(user_id):
			if not check_password_hash(user_data['password_hash'], old_password):
				return jsonify({'error': 'passwords do not match'}), 401
		else:
			return jsonify({'error': 'username does not match'}), 401
		
		if new_password != confirm_new_password:
			return jsonify({'error': 'new password and confirm password fields do not match'}), 412

		# Update password hash
		new_password_hash = generate_password_hash(new_password)
		psql.update_password(user_id, new_password_hash)

		return make_response(jsonify({'msg': 'success'}), 200)
		

	@app.route('/api/v1/addpaper', methods=['POST'])
	@limiter.limit("10/second")
	@jwt_required()
	def add_user_paper():
		"""
		Add paper to the user's library

		Requires
			- paper_id: string
		"""
		user_id = get_jwt_identity()
		if not user_id:
			abort(401)

		paper_id = request.json['paper_id']
		if not paper_id: return make_response('Paper ID not found', 401)

		if 'status' not in request.json: return make_response('Status not found', 401)
		status = request.json['status']

		psql.set_user_paper(user_id, paper_id, status)

		return make_response(jsonify({"user_paper_status": status}), 200)


	@app.route('/api/v1/removepaper', methods=['POST'])
	@limiter.limit("10/second")
	@jwt_required()
	def remove_user_paper():
		"""
		Remove paper from the user's library

		Requires
			- paper_id: string
		"""
		user_id = get_jwt_identity()
		if not user_id:
			abort(401)

		paper_id = request.json['paper_id']
		if not paper_id: return make_response('Paper ID not found', 401)

		psql.remove_user_paper(user_id, paper_id)

		return make_response('', 200)


	@app.route('/api/v1/getuserpapers', methods=['GET'])
	@limiter.limit("10/second")
	@jwt_required()
	def get_user_papers():
		"""
		Get all papers from the user's library

		"""
		user_id = get_jwt_identity()
		if not user_id:
			abort(401)

		_papers = psql.get_user_papers(user_id)
		papers = []
		for p in _papers:
			paper = utils.paper_to_dict(p)
			paper['status'] = p[9]
			papers.append(paper)
		
		return {'results': papers, 'num_results': len(papers)}


	@app.route('/api/v1/isbookmarked', methods=['GET'])
	@limiter.limit("30/second")
	@jwt_required()
	def check_user_paper():
		"""
		Check if a paper exists in the user's library

		Requires
			- paper_id: string
		"""
		user_id = get_jwt_identity()
		if not user_id:
			abort(401)

		paper_id = request.args.get('paper_id')
		if not paper_id: return make_response('Paper ID not found', 401)

		bookmark_exists = psql.check_user_paper_exists(user_id, paper_id)

		return {'is_bookmarked': bookmark_exists}


	@app.route('/api/v1/logout', methods=['POST'])
	@limiter.limit("5/second")
	def logout():
		"""
		Logout the user from the site

		"""
		response = make_response(redirect('/'), 200)
		response.set_cookie('access_token_cookie', '', expires=0)

		return response


	@app.route('/api/v1/search')
	@limiter.limit("5/second")
	@jwt_required(optional=True)
	def search_papers():
		"""
		Search for papers given a search query.
		Encodes the user query into a feature space and uses vector search to find similar papers
		
		If the query is an empty string then get the most recent papers

		Requires
			- query: string
		"""
		user_id = get_jwt_identity()
		query = request.args.get('query')

		results_per_page = request.args.get('num_results')
		results_per_page = results_per_page if (
			results_per_page != None) else 25

		sort_type = request.args.get('sort')
		sort_type = sort_type if (sort_type != None) else 'relevant'

		page_num = request.args.get('page')
		page_num = int(page_num) if (page_num != None) else 1

		if query != None:
			# get embedding of the users query
			query_embedding = model.encode(query)
			embedding_str = str(list(query_embedding))

			# perform vector search to get the results
			results = psql.vector_search(embedding_str, sort_type, results_per_page, page_num, threshold=1.2)
			results = [utils.paper_to_dict(paper) for paper in results]
			num_found = len(results)
		else:
			# User supplied no query, get the top N papers instead
			num_found = results_per_page * 100
			results = search.get_most_recent(user_id, results_per_page, page_num)

		return {'results': results, 'num_results': 50*50}


	@app.route('/api/v1/similar')
	@limiter.limit("5/second")
	@jwt_required(optional=True)
	def search_similar():
		"""
		Get similar papers given a paper using vector search

		Requires
			- paper_id: string
		"""
		user_id = get_jwt_identity()
		paper_id = request.args.get('id')

		results_per_page = request.args.get('num_results')
		results_per_page = results_per_page if (
			results_per_page != None) else 50

		sort_type = request.args.get('sort')
		sort_type = sort_type if (sort_type != None) else 'relevant'

		page_num = request.args.get('page')
		page_num = int(page_num) if (page_num != None) else 1
		
		# fetch the pre-computed embedding of the query paper
		paper = search.fetch_paper(user_id, paper_id)
		embedding_str = paper['embedding']

		# find similar papers using vector search
		results = psql.vector_search(embedding_str, sort_type, results_per_page, page_num, threshold=1.2)
		results = [utils.paper_to_dict(paper) for paper in results]

		num_found = len(results)

		return {'results': results, 'num_results': 50*50}


	@app.route('/api/v1/recommended')
	@limiter.limit("5/second")
	@jwt_required(optional=True)
	def get_recommended():
		"""
		Get recommended papers

		Combines all the paper embeddings in the user's library to generate a search query,
		uses vector search to get similar papers

		"""
		user_id = get_jwt_identity()

		results_per_page = request.args.get('num_results')
		results_per_page = results_per_page if (
			results_per_page != None) else 50

		sort_type = request.args.get('sort')
		sort_type = sort_type if (sort_type != None) else 'relevant'
		
		page_num = request.args.get('page')
		page_num = int(page_num) if (page_num != None) else 1

		# Get all the feature embeddings for all the papers in the user's library
		papers = psql.get_user_papers(user_id)
		paper_embedding_strings = [utils.paper_to_dict(paper)['embedding'] for paper in papers]
		
		# Convert the embedding strings into floats
		paper_embeddings = []
		for embedding_str in paper_embedding_strings:
			embedding = [float(num) for num in embedding_str.strip('[]').split(',')]
			paper_embeddings.append(embedding)
		
		# Combine the embeddings by computing the average
		combined_embeddings = np.mean([np.array(emb) for emb in paper_embeddings], axis=0)
		embedding_str = str(combined_embeddings.tolist())
		
		if np.isnan(combined_embeddings).any(): return {'results': [], 'num_results': 0}

		# Use vector search to get recommended papers
		results = psql.vector_search(embedding_str, sort_type, 50, page_num, threshold=0.8, days_back=7)
		results = [utils.paper_to_dict(paper) for paper in results]

		num_found = len(results)

		return {'results': results, 'num_results': 50*50}


	@app.route('/api/v1/paper')
	@limiter.limit("10/second")
	@jwt_required(optional=True)
	def get_paper():
		"""
		Get the details of a paper

		Requires
			- paper_id: string
		"""
		user_id = get_jwt_identity()
		paper_id = request.args.get('id')

		return search.fetch_paper(user_id, paper_id)


	return app


app = create_app()
