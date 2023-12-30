import psycopg2 as psql
from psycopg2 import pool
from datetime import datetime, timedelta

# Schema of the table 'papers' in the PSQL database
#
#  id | title | abstract | publish_date | categories | authors  | arxiv_id | upvotes | embedding
# ----+-------+----------+--------------+------------+----------+----------+---------+----------


def convert_user_to_dict(user_data, include_password=False):
	"""
	Convert user data into a dictionary to return back to the API

	Args
		user_data: list[strings]
		include_password: Boolean, default=False
	"""
	if user_data:
		user_dict = {
			'id': user_data[0], 
			'username': user_data[1], 
			'email': user_data[2], 
		}
		if include_password:
			user_dict['password_hash'] = user_data[4]

		return user_dict
	else:
		return None
		

connection_pool = pool.SimpleConnectionPool(
	minconn=1,
	maxconn=100,
	user="postgres",
	password="toor",
	host="localhost",
	port="5432",
	database="rapidpapers_pgvector"
)



def fetch_paper(paper_id):
	"""
	Fetch a paper

	Args
		paper_id: string

	Return
		List[string]
	"""
	conn = connection_pool.getconn()
	
	try:
		with conn.cursor() as cursor:
			cursor.execute("SELECT * FROM papers WHERE id=%s", [paper_id,])
			records = cursor.fetchall()
			return records
	except Exception as e:
		print("An error occurred:", e)
	finally:
		connection_pool.putconn(conn)


def fetch_all(num_results, page):
	"""
	Fetch all recent papers in database

	Args
		num_results: int
		page: int - page offset

	Return
		List[string]
	"""
	conn = connection_pool.getconn()

	try:
		with conn.cursor() as cursor:
			cursor.execute(
				"SELECT * \
				FROM papers \
				ORDER BY publish_date DESC \
				LIMIT %s \
				OFFSET %s", 
				[num_results, ((page - 1) * num_results)]
				)
			records = cursor.fetchall()
			return records
	except Exception as e:
		print("An error occurred:", e)
	finally:
		connection_pool.putconn(conn)


def get_user_from_email(email):
	"""
	Get user details given their email

	Args
		email: string

	Return
		Dict{string: string}
	"""
	conn = connection_pool.getconn()

	try:
		with conn.cursor() as cursor:
			cursor.execute(
				"SELECT * \
				FROM users \
				WHERE email = %s",
				[email]
				)
			user_data = cursor.fetchone()
			return convert_user_to_dict(user_data, include_password=True)
	except Exception as e:
		print("An error occurred:", e)
	finally:
		connection_pool.putconn(conn)


def get_user_from_username(username):
	"""
	Get user details given their username

	Args
		username: string

	Return
		Dict{string, string}
	"""
	conn = connection_pool.getconn()

	try:
		with conn.cursor() as cursor:
			cursor.execute(
				"SELECT * \
				FROM users \
				WHERE username = %s",
				[username]
				)
			user_data = cursor.fetchone()
			return convert_user_to_dict(user_data, include_password=True)
	except Exception as e:
		print("An error occurred:", e)
	finally:
		connection_pool.putconn(conn)


def get_user(user_id):
	"""
	Get user details given a user ID

	Args
		user_id: string

	Return
		Dict{string, string}
	"""
	conn = connection_pool.getconn()

	try:
		with conn.cursor() as cursor:
			cursor.execute(
				"SELECT * \
				FROM users \
				WHERE id = %s",
				[user_id]
				)
			user_data = cursor.fetchone()
			return convert_user_to_dict(user_data, include_password=True)
	except Exception as e:
		print("An error occurred", e)
	finally:
		connection_pool.putconn(conn)


def create_user(username, email, password_hash=None):
	"""
	Create a new user account

	Args
		username: string
		email: string
		password_hash: string

	Return
		Dict{string, string}
	"""
	conn = connection_pool.getconn()
	
	try:
		# Prepare the basic insert statement and values
		insert_query = "INSERT INTO users (username, email"
		values = [username, email]

		# Add password_hash to the query and values if it's provided
		if password_hash:
			insert_query += ", password_hash"
			values.append(password_hash)

		# Finalize the query
		insert_query += ") VALUES (%s, %s"
		if password_hash:
			insert_query += ", %s"
		insert_query += ") RETURNING id, username, email"

		with conn.cursor() as cursor:
			# Execute the query
			cursor.execute(insert_query, values)
			user_data = cursor.fetchone()
			conn.commit()
			return convert_user_to_dict(user_data)
	except Exception as e:
		print("An error occurred:", e)
	finally:
		connection_pool.putconn(conn)


def update_password(user_id, new_password_hash):
	"""
	Update the user's password hash

	Args:
		user_id: string
		new_password_hash: string

	"""
	conn = connection_pool.getconn()

	try:
		with conn.cursor() as cursor:
			cursor.execute(
				"UPDATE users \
				SET password_hash = %s \
				WHERE id = %s",
				[new_password_hash, user_id]
				)
			conn.commit()
	except Exception as e:
		print("An error occurred:", e)
	finally:
		connection_pool.putconn(conn)


def check_user_paper(user_id, paper_id):
	"""
	Get the status of a paper in the user's library (e.g. Reading, ToRead, Read)

	Args
		user_id: string
		paper_id: string

	Return
		string
	"""
	conn = connection_pool.getconn()

	try:
		with conn.cursor() as cursor:
			cursor.execute(
				"SELECT status \
				FROM user_papers \
				WHERE user_id = %s \
				AND paper_id = %s",
				[user_id, paper_id]
				)
			status = cursor.fetchone()
			conn.commit()
			return status
	except Exception as e:
		print("An error occurred:", e)
	finally:
		connection_pool.putconn(conn)


def set_user_paper(user_id, paper_id, status):
	"""
	Add a paper or change the status of a paper in the user's library

	Args
		user_id: string
		paper_id: string
		status: string

	Return
		string
	"""
	conn = connection_pool.getconn()

	try:
		with conn.cursor() as cursor:
			cursor.execute(
				"INSERT INTO user_papers \
				(user_id, paper_id, status) VALUES (%s, %s, %s) \
				ON CONFLICT (user_id, paper_id) \
				DO UPDATE SET status = %s",
				[user_id, paper_id, status, status]
				)
			conn.commit()
			return status
	except Exception as e:
		print("An error occurred:", e)
	finally:
		connection_pool.putconn(conn)


def remove_user_paper(user_id, paper_id):
	"""
	Remove a paper from the user's library

	Args
		user_id: string
		paper_id: string
	"""
	conn = connection_pool.getconn()

	try:
		with conn.cursor() as cursor:
			cursor.execute(
				"DELETE FROM user_papers \
				WHERE user_id = %s \
				AND paper_id = %s",
				[user_id, paper_id]
				)
			conn.commit()
	except Exception as e:
		print("An error occurred:", e)
	finally:
		connection_pool.putconn(conn)


def get_user_papers(user_id):
	"""
	Get all the papers in the user's library

	Args
		user_id: string

	Return
		List[List[string]]
	"""
	conn = connection_pool.getconn()

	try:
		with conn.cursor() as cursor:
			cursor.execute(
				"SELECT p.id, p.title, p.abstract, p.publish_date, \
				p.categories, p.authors, p.arxiv_id, p.upvotes, p.embeddings, up.status \
				FROM papers p \
				JOIN user_papers up ON p.id = up.paper_id \
				WHERE up.user_id = %s",
				(user_id,)
				)
			papers = cursor.fetchall()

			return papers
	except Exception as e:
		print("An error occurred:", e)
	finally:
		connection_pool.putconn(conn)


def check_user_paper_exists(user_id, paper_id):
	"""
	Check if paper exists in the user's library

	Args
		user_id: string
		paper_id: string

	Return
		Boolean
	"""
	conn = connection_pool.getconn()

	try:
		with conn.cursor() as cursor:
			cursor.execute(
				"SELECT EXISTS(SELECT 1 FROM user_papers \
				WHERE user_id = %s AND paper_id = %s)",
				(user_id, paper_id)
				)
			result = cursor.fetchone()

			return result[0] if result else False
	except Exception as e:
		print("An error occurred:", e)
	finally:
		connection_pool.putconn(conn)


def fetch_paper_details(user_id, paper_id):
	"""
	Fetch the paper details, library status, and upvotes (OUTDATED!) of a specific paper

	Args
		user_id: string
		paper_id: string

	Return
		List[List[string]]
	"""
	conn = connection_pool.getconn()

	try:
		with conn.cursor() as cursor:
			cursor.execute("""
				SELECT 
					papers.*, 
					user_votes.vote AS user_vote,
					user_papers.status AS user_paper_status
				FROM papers
				LEFT JOIN user_votes ON papers.id = user_votes.paper_id AND user_votes.user_id = %s
				LEFT JOIN user_papers ON papers.id = user_papers.paper_id AND user_papers.user_id = %s
				WHERE papers.id = %s
			""", [user_id, user_id, paper_id])

			result = cursor.fetchone()
			conn.commit()

			return result
	except Exception as e:
		print("An error occured:", e)
	finally:
		connection_pool.putconn(conn)


def fetch_all_details(user_id, num_results, page):
	"""
	Fetch the paper details, library status, and upvotes (OUTDATED!) of most recent papers

	Args
		user_id: string
		num_results: int
		page: int

	Return
		List[List[string]]
	"""
	conn = connection_pool.getconn()

	try:
		with conn.cursor() as cursor:
			cursor.execute("""
				SELECT 
					papers.*,
					user_votes.vote AS user_vote,
					user_papers.status AS user_paper_status
				FROM papers
				LEFT JOIN user_votes ON papers.id = user_votes.paper_id AND user_votes.user_id = %s
				LEFT JOIN user_papers ON papers.id = user_papers.paper_id AND user_papers.user_id = %s
				ORDER BY papers.publish_date DESC
				LIMIT %s
				OFFSET %s
			""", [user_id, user_id, num_results, ((page - 1) * num_results)])

			results = cursor.fetchall()
			conn.commit()

			return results
	except Exception as e:
		print("An error occurred:", e)
	finally:
		connection_pool.putconn(conn)


def vector_search(embedding_str, order='relevant', num_results=50, page=1, threshold=0.7, days_back=None):
	"""
	Perform vector search given a query embedding

	Args
		embedding_str: string
		order: string (Default='relevant')
		num_results: int (Default=50)
		page: int (Default=1)
		threshold: float (Default=0.7)
		days_back: int (Default=None)

	Return
		List[string]
	"""
	conn = connection_pool.getconn()
	
	try:
		if days_back:
			date_threshold = datetime.now() - timedelta(days=days_back)
		else:
			date_threshold = datetime(1999, 1, 1)

		query = """
			SELECT * FROM (
				SELECT *
				FROM papers
				WHERE embeddings <-> %s < %s
				AND publish_date >= %s
				ORDER BY embeddings <-> %s
				LIMIT %s
				OFFSET %s
			) AS top_papers
		"""

		params = [embedding_str, threshold, date_threshold, embedding_str, num_results, ((page - 1) * num_results)]

		if order.lower() == 'asc':
			query += " ORDER BY top_papers.publish_date ASC"
		elif order.lower() == 'desc':
			query += " ORDER BY top_papers.publish_date DESC"
		
		with conn.cursor() as cursor:
			cursor.execute(query, params)
			results = cursor.fetchall()
			conn.commit()

			return results
	except Exception as e:
		print("An error occurred:", e)
	finally:
		connection_pool.putconn(conn)
		
