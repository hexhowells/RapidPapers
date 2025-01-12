import numpy as np
from sentence_transformers import SentenceTransformer
import psql
import utils
import re


def _arxiv_id(string):
    """
    Check if a string is in the form of an arXiv ID with optional 'arXiv:' prefix.
    
    Args:
        string (str): The input string to check.
    
    Returns:
        bool: True if the string matches the simplified arXiv ID format, False otherwise.
    """
    arxiv_pattern = re.compile(
        r'^(arXiv:)?\d{4}\.\d{5}(v\d+)?$',
        re.IGNORECASE
    )
    return bool(arxiv_pattern.match(string))


def _exact_search_query(query):
	pattern = r'^\s*([\'"]).*\1\s*$'  # check for double or single quotes surrounding the query
	return bool(re.match(pattern, query))


def search_papers(query, model, sort_type, results_per_page, page_num):
	if _arxiv_id(query):
		results = psql.arxiv_search(query, sort_type, results_per_page, page_num)
		results = [utils.paper_to_dict(paper) for paper in results]
		num_found = len(results)
	elif _exact_search_query(query):
		query = query[1:-1]  # remove quotes from search query
		results = psql.string_search(query, sort_type, results_per_page, page_num)
		results = [utils.paper_to_dict(paper) for paper in results]
		num_found = len(results)
	else:
		# get embedding of the users query
		query_embedding = model.encode(query)
		embedding_str = str(list(query_embedding))

		# perform vector search to get the results
		results = psql.vector_search(embedding_str, sort_type, results_per_page, page_num, threshold=1.2)
		results = [utils.paper_to_dict(paper) for paper in results]
		num_found = len(results)

	

	return results, num_found





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
