from flask import Flask, request
import search
import faiss
import pickle


def load_index():
	with open("faiss_index.pickle", "rb") as f:
		faiss_index = faiss.deserialize_index(pickle.load(f))

	return faiss_index

def create_app():
	app = Flask(__name__)

	faiss_index = load_index()


	@app.route('/api/v1/search')
	def search_papers():
		query = request.args.get('query')
		num_results = request.args.get('num_results')
		num_results = num_results if (num_results != None) else 50

		if query != None:
			faiss_ids, _ = search.faiss_search(faiss_index, query, num_results)
			faiss_ids = list(set(faiss_ids))
			results = search.search_paper(faiss_ids)
		else:
			results = search.get_most_recent(num_results)

		return {'results': results}


	@app.route('/api/v1/similar')
	def search_similar():
		paper_id = request.args.get('id')
		num_results = request.args.get('num_results')
		num_results = num_results if (num_results != None) else 50

		paper = search.fetch_paper(paper_id)

		faiss_ids, _ = search.faiss_search(faiss_index, paper['abstract'], num_results)
		faiss_ids = list(set(faiss_ids))
		results = search.search_paper(faiss_ids)

		return {'results': results}


	@app.route('/api/v1/paper')
	def get_paper():
		paper_id = request.args.get('id')
		
		return search.fetch_paper(paper_id)

	return app


app = create_app()

