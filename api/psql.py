import psycopg2 as psql

# Schema of the table 'papers' in the PSQL database
#
#  id | title | abstract | publish_date | categories | authors | doi | arxiv_id
# ----+-------+----------+--------------+------------+---------+-----+----------


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

