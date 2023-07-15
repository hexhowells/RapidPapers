import {useParams} from "react-router-dom";
import React, { useState, useEffect } from 'react';

import './Paper.css';

const Paper = () => {
	const { id } = useParams();
	const [paper, setPaper] = useState(0);

	useEffect(() => {
      fetch(`/api/v1/paper?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          setPaper(data);
        })
        .catch((error) => {
          console.error('Error fetching data from backend:', error);
        });
    }, [id]);

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
			<a className="btn btn-primary mt-3" 
				href={`https://arxiv.org/abs/${paper.arxiv_id}`} 
				target="_blank" rel="noopener noreferrer" 
				role="button">
				Read Paper
			</a>
		</div>
		</>
		);
};

export default Paper;