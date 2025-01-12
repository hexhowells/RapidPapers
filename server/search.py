import numpy as np
from sentence_transformers import SentenceTransformer
import psql
import utils


def fetch_paper(user_id, paper_id):
	""" Fetch the details of a paper given its ID

	Args:
		user_id (string): ID for the user if they are logged in
		paper_id (string): ID for the paper to fetch

	Returns:
		(dict): dictionary containing the details of the paper
	"""
	paper = psql.fetch_paper(paper_id)

	if len(paper) > 0:
		paper = paper[0]
	else:
		paper = None

	if paper is not None:
		return utils.paper_to_dict( paper )
	else:
		return None


def get_most_recent(user_id, num_results, page_num):
	""" Gets the most recent papers from the database

	Args:
		user_id (string): ID for the user if they are logged in
		num_results (int): number of results to show
		page_num (int): current page number

	Returns:
		List[dict]: list of dictionaries containing the details of the papers
	"""
	papers = psql.fetch_all(num_results, page_num)
	
	papers_dict = []
	for paper in papers:
		papers_dict.append(utils.paper_to_dict(paper))

	return papers_dict
