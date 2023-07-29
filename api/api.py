import search
import faiss
import config
from psql import PSQL

import pickle
from datetime import datetime

import secrets
from urllib.parse import urlencode
import requests

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


def load_index():
	with open("faiss_index.pickle", "rb") as f:
		faiss_index = faiss.deserialize_index(pickle.load(f))

	return faiss_index


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

	app.config["JWT_TOKEN_LOCATION"] = ["cookies"]  # Enable JWT extraction from cookies
	app.config["JWT_SECRET_KEY"] = config.jwt_secret_key
	app.config["JWT_COOKIE_SECURE"] = True  # Use secure cookies for production (over HTTPS only)
	app.config["JWT_COOKIE_CSRF_PROTECT"] = True  # Enable CSRF protection

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

	faiss_index = load_index()
	psql = PSQL()

	jwt = JWTManager(app)
	login_manager = LoginManager(app)


	@app.route('/authorise/<provider>')
	def oauth2_authorize(provider):
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


	@app.route('/callback/<provider>')
	def oauth2_callback(provider):
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

		access_token = create_access_token(identity=user.id)
		res = make_response(redirect('http://127.0.0.1:9000/'))
		res.set_cookie('access_token_cookie', access_token, secure=False, httponly=True, samesite='Lax', domain='127.0.0.1')

		return res


	@app.route('/profile')
	@jwt_required()
	def get_user_profile():
	    user_id = get_jwt_identity()
	    user_data = psql.get_user(user_id)

	    if not user_data:
	        return jsonify({"msg": "User not found"}), 404

	    return jsonify(user_data), 200


	@app.route('/api/v1/search')
	def search_papers():
		query = request.args.get('query')

		results_per_page = request.args.get('num_results')
		results_per_page = results_per_page if (
			results_per_page != None) else 50

		sort_type = request.args.get('sort')
		sort_type = sort_type if (sort_type != None) else 'relevant'

		page_num = request.args.get('page')
		page_num = int(page_num) if (page_num != None) else 1

		if query != None:
			page_index = results_per_page * page_num
			faiss_ids = search.faiss_search(faiss_index, query, threshold=1.2)

			results = search.search_paper(faiss_ids)
			results = sort_papers(results, sort_type)
			num_found = len(results)
			results = results[page_index-results_per_page: page_index]
		else:
			num_found = results_per_page * 100
			results = search.get_most_recent(results_per_page, page_num)

		return {'results': results, 'num_results': num_found}


	@app.route('/api/v1/similar')
	def search_similar():
		paper_id = request.args.get('id')

		results_per_page = request.args.get('num_results')
		results_per_page = results_per_page if (
			results_per_page != None) else 50

		sort_type = request.args.get('sort')
		sort_type = sort_type if (sort_type != None) else 'relevant'

		page_num = request.args.get('page')
		page_num = int(page_num) if (page_num != None) else 1

		paper = search.fetch_paper(paper_id)

		page_index = results_per_page * page_num
		faiss_ids = search.faiss_search(faiss_index, paper['abstract'])

		results = search.search_paper(faiss_ids)
		results = sort_papers(results, sort_type)
		num_found = len(results)
		results = results[page_index-results_per_page: page_index]

		return {'results': results, 'num_results': num_found}


	@app.route('/api/v1/paper')
	def get_paper():
		paper_id = request.args.get('id')

		return search.fetch_paper(paper_id)

	return app


app = create_app()
