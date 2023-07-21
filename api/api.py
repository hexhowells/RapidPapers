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

		page_num = request.args.get('page')
		page_num = int(page_num) if (page_num != None) else 1

		if query != None:
			_num_results = num_results * page_num
			faiss_ids = search.faiss_search(faiss_index, query, threshold=1.2)

			results = search.search_paper(faiss_ids)
			results = sort_papers(results, sort_type)
			results = results[_num_results-num_results: _num_results]
		else:
			results = search.get_most_recent(num_results, page_num)

		return {'results': results}


	@app.route('/api/v1/similar')
	def search_similar():
		paper_id = request.args.get('id')

		num_results = request.args.get('num_results')
		num_results = num_results if (num_results != None) else 50

		sort_type = request.args.get('sort')
		sort_type = sort_type if (sort_type != None) else 'relevant'

		paper = search.fetch_paper(paper_id)

		faiss_ids = search.faiss_search(faiss_index, paper['abstract'], num_results)

		results = search.search_paper(faiss_ids)
		results = sort_papers(results, sort_type)

		return {'results': results}


	@app.route('/api/v1/paper')
	def get_paper():
		paper_id = request.args.get('id')
		
		return search.fetch_paper(paper_id)

	return app


app = create_app()

