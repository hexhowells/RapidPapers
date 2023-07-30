import psycopg2 as psql

# Schema of the table 'papers' in the PSQL database
#
#  id | title | abstract | publish_date | categories | authors | doi | arxiv_id
# ----+-------+----------+--------------+------------+---------+-----+----------


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
