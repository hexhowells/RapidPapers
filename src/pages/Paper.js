import { useParams, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';

import { upvote, downvote, fetchUserVote } from '../utilities/votingUtils';
import { bookmark } from '../utilities/bookmarkUtils';
import { BsFillCaretUpFill, BsFillCaretDownFill, BsFillBookmarkFill, BsFillBookmarkCheckFill } from "react-icons/bs";

import './Paper.css';

const Paper = () => {
	const { id } = useParams();
	const [paper, setPaper] = useState(0);

	const [upvotes, setUpvotes] = useState(0); 
	const [userVote, setUserVote] = useState(null); 
	const [isBookmarked, setIsBookmarked] = useState(false); 

	useEffect(() => {
      fetch(`/api/v1/paper?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          setPaper(data);
          setUpvotes(data.upvotes);
          setIsBookmarked(data.library_status);
        })
        .catch((error) => {
          console.error('Error fetching data from backend:', error);
        });
    }, [id]);

	useEffect(() => {
	    const fetchInitialData = async () => {
	        const userVoteData = await fetchUserVote(id);
	        setUserVote(userVoteData);
	        // You might need to fetch initial upvote count and bookmark status too.
	    };

	    fetchInitialData();
	}, [id]);

	const handleUpvote = async () => {
	    const data = await upvote(id);
	    setUpvotes(data.upvotes);
	    const userVoteData = await fetchUserVote(id);
	    setUserVote(userVoteData);
	};

	const handleDownvote = async () => {
	    const data = await downvote(id);
	    setUpvotes(data.upvotes);
	    const userVoteData = await fetchUserVote(id);
	    setUserVote(userVoteData);
	};

	const handleBookmark = async () => {
	    await bookmark(id, isBookmarked);
	    setIsBookmarked(!isBookmarked);
	};

	return (
		<>
		<div className="container pt-2">
			<h3>{paper.title}</h3>
			<p className="mb-1"><i>{paper.authors?.map((author) => author.replace(/\\/g, '')).join(", ")}</i></p>
			<p>{paper.date}</p>
			<br></br>
			<p className="abstract">{paper.abstract}</p>
			<div className="container p-0 pt-1">
		      <div className="row">
		      	<div className="col d-flex">
				    <div className="d-flex align-items-center">
				        <p className="mb-0 me-2">Categories:</p>
				    </div>
				    <div className="d-flex align-items-center">
				        {paper.categories?.map((category, index) => (
				            <span className="badge bg-secondary me-1 px-2">{category}</span>
				        ))}
				    </div>
				</div>
		      </div>
		    </div>
			<br></br>
			<a className="btn btn-primary mt-3 me-2" 
				href={`https://arxiv.org/abs/${paper.arxiv_id}`} 
				target="_blank" rel="noopener noreferrer" 
				role="button">
				Read Paper
			</a>
			<Link to={`/similar/${paper.id}`} key={paper.id}>
				<button className="btn btn-info mt-3 me-2">Find Similar</button>
			</Link>

			<button onClick={handleBookmark} className={`btn mt-3 ${isBookmarked ? 'btn-success' : 'btn-primary'}`}>
			    {isBookmarked ? "remove from library" : "add to library"}
			</button>

		</div>
		</>
		);
};

export default Paper;