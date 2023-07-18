from flask import Flask, request
import search
import faiss
import pickle
from datetime import datetime


def load_index():
	with open("faiss_index.pickle", "rb") as f:
		faiss_index = faiss.deserialize_index(pickle.load(f))

	return faiss_index


def sort_papers(papers, sort_type):
	match sort_type:
		case "relevant":
			return papers
		case "asc":
			return sorted(papers, key=lambda x: datetime.strptime(x['date'], "%a, %d %b %Y"))
		case "desc":
			return sorted(papers, key=lambda x: datetime.strptime(x['date'], "%a, %d %b %Y"), reverse=True)


def create_app():
	app = Flask(__name__)

	faiss_index = load_index()


	@app.route('/api/v1/search')
	def search_papers():
		query = request.args.get('query')

		num_results = request.args.get('num_results')
		num_results = num_results if (num_results != None) else 50

		sort_type = request.args.get('sort')
		sort_type = sort_type if (sort_type != None) else 'relevant'

		if query != None:
			faiss_ids, _ = search.faiss_search(faiss_index, query, num_results)
			faiss_ids = list(set(faiss_ids))
			results = search.search_paper(faiss_ids)
			results = sort_papers(results, sort_type)
		else:
			results = search.get_most_recent(num_results)

		return {'results': results}


	@app.route('/api/v1/similar')
	def search_similar():
		paper_id = request.args.get('id')

		num_results = request.args.get('num_results')
		num_results = num_results if (num_results != None) else 50

		sort_type = request.args.get('sort')
		sort_type = sort_type if (sort_type != None) else 'relevant'

		paper = search.fetch_paper(paper_id)

		faiss_ids, _ = search.faiss_search(faiss_index, paper['abstract'], num_results)
		faiss_ids = list(set(faiss_ids))
		results = search.search_paper(faiss_ids)
		results = sort_papers(results, sort_type)

		return {'results': results}


	@app.route('/api/v1/paper')
	def get_paper():
		paper_id = request.args.get('id')
		
		return search.fetch_paper(paper_id)

	return app


app = create_app()

