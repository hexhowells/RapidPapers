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

		results_per_page = request.args.get('num_results')
		results_per_page = results_per_page if (results_per_page != None) else 50

		sort_type = request.args.get('sort')
		sort_type = sort_type if (sort_type != None) else 'relevant'

		page_num = request.args.get('page')
		page_num = int(page_num) if (page_num != None) else 1

		if query != None:
			page_index = results_per_page * page_num
			faiss_ids = search.faiss_search(faiss_index, query, threshold=1.2)

			results = search.search_paper(faiss_ids)
			results = sort_papers(results, sort_type)
			num_found = len(results)
			results = results[page_index-results_per_page: page_index]
		else:
			num_found = results_per_page * 100
			results = search.get_most_recent(results_per_page, page_num)

		return {'results': results, 'num_results': num_found}


	@app.route('/api/v1/similar')
	def search_similar():
		paper_id = request.args.get('id')

		results_per_page = request.args.get('num_results')
		results_per_page = results_per_page if (results_per_page != None) else 50

		sort_type = request.args.get('sort')
		sort_type = sort_type if (sort_type != None) else 'relevant'

		page_num = request.args.get('page')
		page_num = int(page_num) if (page_num != None) else 1

		paper = search.fetch_paper(paper_id)

		page_index = results_per_page * page_num
		faiss_ids = search.faiss_search(faiss_index, paper['abstract'])

		results = search.search_paper(faiss_ids)
		results = sort_papers(results, sort_type)
		num_found = len(results)
		results = results[page_index-results_per_page: page_index]

		return {'results': results, 'num_results': num_found}


	@app.route('/api/v1/paper')
	def get_paper():
		paper_id = request.args.get('id')
		
		return search.fetch_paper(paper_id)

	return app


app = create_app()

