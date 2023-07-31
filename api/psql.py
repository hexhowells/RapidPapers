import psycopg2 as psql

# Schema of the table 'papers' in the PSQL database
#
#  id | title | abstract | publish_date | categories | authorsn | arxiv_id | upvotes
# ----+-------+----------+--------------+------------+----------+----------+--------


def convert_user_to_dict(user_data):
	if user_data:
		return {'id': user_data[0], 'username': user_data[1], 'email': user_data[2]}
	else:
		return None
		

class PSQL:
	def __init__(self):
		self.conn = psql.connect(
		    host="localhost",
		    port="5432",
		    database="rapidpapers_dev",
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

		return convert_user_to_dict(user_data)


	def get_user(self, user_id):
		self.cursor.execute(
			"SELECT * \
			FROM users \
			WHERE id = %s",
			[user_id]
			)
		user_data = self.cursor.fetchone()

		return convert_user_to_dict(user_data)


	def create_user(self, username, email):
		self.cursor.execute(
			"INSERT INTO users (username, email) \
			VALUES (%s, %s) \
			RETURNING id, username, email",
			[username, email]
			)
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


	def get_user_papers(self, user_id):
		self.cursor.execute(
			"SELECT p.id, p.title, p.abstract, p.publish_date, \
			p.categories, p.authors, p.arxiv_id, p.upvotes, up.status \
			FROM papers p \
			JOIN user_papers up ON p.id = up.paper_id \
			WHERE up.user_id = %s",
			(user_id,)
			)
		papers = self.cursor.fetchall()

		return papers
