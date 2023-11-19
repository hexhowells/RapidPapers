import psycopg2 as psql
from datetime import datetime, timedelta

# Schema of the table 'papers' in the PSQL database
#
#  id | title | abstract | publish_date | categories | authors  | arxiv_id | upvotes
# ----+-------+----------+--------------+------------+----------+----------+--------


def convert_user_to_dict(user_data, include_password=False):
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
		

class PSQL:
	def __init__(self):
		self.conn = psql.connect(
		    host="localhost",
		    port="5432",
		    database="rapidpapers_pgvector",
		    user="postgres",
		    password="toor"
		)

		self.cursor = self.conn.cursor()


	def fetch_paper(self, paper_id):
		self.cursor.execute("SELECT * FROM papers WHERE id=%s", [paper_id,])
		records = self.cursor.fetchall()

		return records


	def fetch_all(self, num_results, page):
		self.cursor.execute(
			"SELECT * \
			FROM papers \
			ORDER BY publish_date DESC \
			LIMIT %s \
			OFFSET %s", 
			[num_results, ((page - 1) * num_results)]
			)
		records = self.cursor.fetchall()

		return records


	def get_user_from_email(self, email):
		self.cursor.execute(
			"SELECT * \
			FROM users \
			WHERE email = %s",
			[email]
			)
		user_data = self.cursor.fetchone()

		return convert_user_to_dict(user_data, include_password=True)


	def get_user_from_username(self, username):
		self.cursor.execute(
			"SELECT * \
			FROM users \
			WHERE username = %s",
			[username]
			)
		user_data = self.cursor.fetchone()

		return convert_user_to_dict(user_data, include_password=True)


	def get_user(self, user_id):
		self.cursor.execute(
			"SELECT * \
			FROM users \
			WHERE id = %s",
			[user_id]
			)
		user_data = self.cursor.fetchone()

		return convert_user_to_dict(user_data, include_password=True)


	def create_user(self, username, email, password_hash=None):
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

		# Execute the query
		self.cursor.execute(insert_query, values)
		user_data = self.cursor.fetchone()
		self.conn.commit()

		return convert_user_to_dict(user_data)


	def check_vote(self, user_id, paper_id):
		self.cursor.execute(
			"SELECT vote \
			FROM user_votes \
			WHERE user_id = %s \
			AND paper_id = %s",
			[user_id, paper_id]
			)
		user_data = self.cursor.fetchone()
		self.conn.commit()

		return user_data


	def _update_paper_vote(self, paper_id, value):
		self.cursor.execute(
			"UPDATE papers \
			SET upvotes = upvotes + %s \
        	WHERE id = %s",
        	[value, paper_id]
			)
		self.conn.commit()


	def upvote_paper(self, user_id, paper_id, vote_change=1):
		self.cursor.execute(
			"INSERT INTO user_votes \
			(user_id, paper_id, vote) VALUES (%s, %s, %s) \
        	ON CONFLICT (user_id, paper_id) \
        	DO UPDATE SET vote = %s",
        	[user_id, paper_id, "up", "up"]
			)
		self.conn.commit()
		self._update_paper_vote(paper_id, vote_change)


	def downvote_paper(self, user_id, paper_id, vote_change=-1):
		self.cursor.execute(
			"INSERT INTO user_votes \
			(user_id, paper_id, vote) VALUES (%s, %s, %s) \
        	ON CONFLICT (user_id, paper_id) \
        	DO UPDATE SET vote = %s",
        	[user_id, paper_id, "down", "down"]
			)
		self.conn.commit()
		self._update_paper_vote(paper_id, vote_change)


	def undo_paper_vote(self, user_id, paper_id, vote_change):
		self.cursor.execute(
			"DELETE FROM user_votes \
			WHERE user_id = %s \
			AND paper_id = %s",
        	[user_id, paper_id]
			)
		self.conn.commit()
		self._update_paper_vote(paper_id, vote_change)


	def get_paper_upvotes(self, paper_id):
		self.cursor.execute(
			"SELECT upvotes \
			FROM papers \
			WHERE id = %s",
        	[paper_id]
			)
		upvotes = self.cursor.fetchone()
		self.conn.commit()
		
		if upvotes:
			return upvotes[0]
		else:
			return None


	def check_user_paper(self, user_id, paper_id):
		self.cursor.execute(
			"SELECT status \
			FROM user_papers \
			WHERE user_id = %s \
			AND paper_id = %s",
			[user_id, paper_id]
			)
		status = self.cursor.fetchone()
		self.conn.commit()

		return status


	def set_user_paper(self, user_id, paper_id, status):
		self.cursor.execute(
			"INSERT INTO user_papers \
			(user_id, paper_id, status) VALUES (%s, %s, %s) \
        	ON CONFLICT (user_id, paper_id) \
        	DO UPDATE SET status = %s",
        	[user_id, paper_id, status, status]
			)
		self.conn.commit()

		return status


	def remove_user_paper(self, user_id, paper_id):
		self.cursor.execute(
			"DELETE FROM user_papers \
			WHERE user_id = %s \
        	AND paper_id = %s",
        	[user_id, paper_id]
			)
		self.conn.commit()


	def get_user_papers(self, user_id):
		self.cursor.execute(
			"SELECT p.id, p.title, p.abstract, p.publish_date, \
			p.categories, p.authors, p.arxiv_id, p.upvotes, p.embeddings, up.status \
			FROM papers p \
			JOIN user_papers up ON p.id = up.paper_id \
			WHERE up.user_id = %s",
			(user_id,)
			)
		papers = self.cursor.fetchall()

		return papers


	def check_user_paper_exists(self, user_id, paper_id):
		self.cursor.execute(
			"SELECT EXISTS(SELECT 1 FROM user_papers \
			WHERE user_id = %s AND paper_id = %s)",
			(user_id, paper_id)
			)
		result = self.cursor.fetchone()

		return result[0] if result else False


	def fetch_paper_details(self, user_id, paper_id):
		self.cursor.execute("""
			SELECT 
				papers.*, 
				user_votes.vote AS user_vote,
				user_papers.status AS user_paper_status
			FROM papers
			LEFT JOIN user_votes ON papers.id = user_votes.paper_id AND user_votes.user_id = %s
			LEFT JOIN user_papers ON papers.id = user_papers.paper_id AND user_papers.user_id = %s
			WHERE papers.id = %s
		""", [user_id, user_id, paper_id])

		result = self.cursor.fetchone()
		self.conn.commit()

		return result


	def fetch_all_details(self, user_id, num_results, page):
		self.cursor.execute("""
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

		results = self.cursor.fetchall()
		self.conn.commit()

		return results


	def vector_search(self, embedding_str, order='relevant', num_results=50, page=1, threshold=0.7, days_back=None):
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

		self.cursor.execute(query, params)
		results = self.cursor.fetchall()
		self.conn.commit()

		return results
		
