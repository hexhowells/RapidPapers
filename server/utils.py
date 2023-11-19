def paper_to_dict(paper):
	obj = {
		'id': paper[0],
		'title': paper[1],
		'abstract': paper[2],
		'date': paper[3].strftime("%a, %d %b %Y"),
		'categories': paper[4],
		'authors': paper[5],
		'arxiv_id': paper[6],
		'upvotes': paper[7],
		'embedding': paper[8]
	}
	if len(paper) == 11:
		obj['upvote_status'] = paper[9]
		obj['library_status'] = paper[8]

	return obj
