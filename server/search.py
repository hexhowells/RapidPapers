import numpy as np
from sentence_transformers import SentenceTransformer
from psql import PSQL
import utils


def faiss_search(index, query, threshold=0.7):
	model = SentenceTransformer('all-MiniLM-L6-v2')

	query_embedding = model.encode([query])

	_, dists, result_indexes = index.range_search(query_embedding, thresh=threshold)

	indicies = [x for _,x in sorted(zip(dists, result_indexes))]

	return indicies


def multi_faiss_search(index, queries, threshold=0.7):
	model = SentenceTransformer('all-MiniLM-L6-v2')

	embeddings = [model.encode([query]) for query in queries]
	average_embedding = np.mean(embeddings, axis=0)

	_, dists, result_indexes = index.range_search(average_embedding, thresh=threshold)

	indicies = [x for _,x in sorted(zip(dists, result_indexes))]

	return indicies


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
