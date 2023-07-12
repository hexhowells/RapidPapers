import numpy as np
from sentence_transformers import SentenceTransformer
from psql import PSQL


def paper_to_dict(paper):
	return {
			'id': paper[0],
			'title': paper[1],
			'abstract': paper[2],
			'date': paper[3].strftime("%a, %d %b %Y"),
			'categories': paper[4],
			'authors': paper[5],
			'doi': paper[6],
			'arxiv_id': paper[7],
			}


def faiss_search(index, query, num_results):
	model = SentenceTransformer('all-MiniLM-L6-v2')

	query_embedding = model.encode([query])

	dist, result_indexes = index.search(query_embedding, k=num_results)

	return result_indexes[0], dist[0]


def search_paper(results):
	database = PSQL()

	#papers = [(database.fetch(str(result))[0], d) for result, d in zip(results, dists)]
	papers = [database.fetch_paper(str(result))[0] for result in results]
	papers = sorted(papers, key=lambda x: x[3], reverse=True)
	
	papers_dict = []
	for paper in papers:
		papers_dict.append(paper_to_dict(paper))

	return papers_dict


def fetch_paper(paper_id):
	database = PSQL()
	return paper_to_dict( database.fetch_paper(paper_id)[0] )


def get_most_recent(num_results):
	database = PSQL()

	papers = database.fetch_all(num_results)
	
	papers_dict = []
	for paper in papers:
		papers_dict.append(paper_to_dict(paper))

	return papers_dict
