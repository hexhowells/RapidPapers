import numpy as np
from sentence_transformers import SentenceTransformer
import psql
import utils


def search_paper(user_id, results):
	if user_id:
		papers = [psql.fetch_paper_details(user_id, str(result)) for result in results]
	else:
		papers = [psql.fetch_paper(str(result))[0] for result in results]
	
	papers_dict = []
	for paper in papers:
		papers_dict.append(utils.paper_to_dict(paper))

	return papers_dict


def fetch_paper(user_id, paper_id):
	if user_id:
		paper = psql.fetch_paper_details(user_id, paper_id)
	else:
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
	if user_id:
		papers = psql.fetch_all_details(user_id, num_results, page_num)
	else:
		papers = psql.fetch_all(num_results, page_num)
	
	papers_dict = []
	for paper in papers:
		papers_dict.append(utils.paper_to_dict(paper))

	return papers_dict
