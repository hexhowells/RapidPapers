import numpy as np
from sentence_transformers import SentenceTransformer
from psql import PSQL
import utils


def search_paper(user_id, results):
	database = PSQL()

	if user_id:
		papers = [database.fetch_paper_details(user_id, str(result)) for result in results]
	else:
		papers = [database.fetch_paper(str(result))[0] for result in results]
	
	papers_dict = []
	for paper in papers:
		papers_dict.append(utils.paper_to_dict(paper))

	return papers_dict


def fetch_paper(user_id, paper_id):
	database = PSQL()
	if user_id:
		return utils.paper_to_dict( database.fetch_paper_details(user_id, paper_id) )
	else:
		return utils.paper_to_dict( database.fetch_paper(paper_id)[0] )


def get_most_recent(user_id, num_results, page_num):
	database = PSQL()

	if user_id:
		papers = database.fetch_all_details(user_id, num_results, page_num)
	else:
		papers = database.fetch_all(num_results, page_num)
	
	papers_dict = []
	for paper in papers:
		papers_dict.append(utils.paper_to_dict(paper))

	return papers_dict