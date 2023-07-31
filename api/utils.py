def paper_to_dict(paper):
  return {
      'id': paper[0],
      'title': paper[1],
      'abstract': paper[2],
      'date': paper[3].strftime("%a, %d %b %Y"),
      'categories': paper[4],
      'authors': paper[5],
      'arxiv_id': paper[6],
      'upvotes': paper[7]
      }
