import { useParams, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';

import { bookmark } from '../utilities/bookmarkUtils';

import './Paper.css';

const Paper = () => {
	const { id } = useParams();
	const [paper, setPaper] = useState(0);
	const [isBookmarked, setIsBookmarked] = useState(false); 

	// Fetch user data for paper
	useEffect(() => {
      fetch(`/api/v1/paper?id=${id.replace(/\./g, "")}`)
        .then((res) => res.json())
        .then((data) => {
          setPaper(data);
          setIsBookmarked(data.library_status);
        })
        .catch((error) => {
          console.error('Error fetching data from backend:', error);
        });
    }, [id]);


	// Add / remove paper from library
	const handleBookmark = async () => {
	    await bookmark(id.replace(/\./g, ""), isBookmarked);
	    setIsBookmarked(!isBookmarked);
	};

	return (
		<>
		<div className="container pt-2">
			{/* Paper details */}
			<h3>{paper.title}</h3>
			<p className="mb-1"><i>{paper.authors?.map((author) => author.replace(/\\/g, '')).join(", ")}</i></p>
			<p>{paper.date}</p>
			<br></br>
			<p className="abstract">{paper.abstract}</p>
			<div className="container p-0 pt-1">
		      <div className="row">
		      	<div className="col d-flex">
				    <div className="d-flex align-items-center align-self-start">
				        <p className="mb-0 me-2">Categories:</p>
				    </div>
				    <div className="paper-categories d-flex flex-wrap gap-1 mt-1 align-items-center">
				        {paper.categories?.map((category, index) => (
				            <span className="badge bg-secondary me-1 px-2">{category}</span>
				        ))}
				    </div>
				</div>
		      </div>
		    </div>
			<br></br>
			{/* Paper action buttons */}
			<div className="action-buttons">
				<a className="btn btn-primary mt-3 me-2" 
					href={`https://arxiv.org/abs/${paper.arxiv_id}`} 
					target="_blank" rel="noopener noreferrer" 
					role="button">
					Read Paper
				</a>
				<Link to={`/similar/${paper.id}`} key={paper.id}>
					<button className="btn btn-info mt-3 me-2">Find Similar</button>
				</Link>

				<button onClick={handleBookmark} className={`btn mt-3 ${isBookmarked ? 'btn-danger' : 'btn-primary'}`}>
				    {isBookmarked ? "Remove from Library" : "Add to Library"}
				</button>
			</div>

		</div>
		</>
		);
};

export default Paper;
