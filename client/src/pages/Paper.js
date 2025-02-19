import { useParams, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { bookmark } from '../utilities/bookmarkUtils';

import './Paper.css';

const Paper = () => {
	const { id } = useParams();
	const [paper, setPaper] = useState(0);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [error, setError] = useState(false);
	const [htmlUrl, setHtmlUrl] = useState("");

	// Checks if the user is authenticated
	useEffect(() => {
		axios.get('/api/v1/profile')
			.then(response => {
				setIsAuthenticated(true);
			})
			.catch(error => {
				setIsAuthenticated(false);
			});
	}, []);

	// Fetch user data for paper
	useEffect(() => {
		fetch(`/api/v1/paper?id=${id.replace(/\./g, "")}`)
			.then((res) => res.json())
			.then((data) => {
				setPaper(data);
				setIsBookmarked(data.library_status);
			})
			.catch((error) => {
				setError(true);
				console.error('Error fetching data from backend:', error);
			});
	}, [id]);

	// Check if Arxiv HTML page exists
	useEffect(() => {
		if (paper?.arxiv_id) {
			const arxivHtmlUrl = `https://arxiv.org/html/${paper.arxiv_id}`;
			const ar5ivHtmlUrl = `https://ar5iv.org/abs/${paper.arxiv_id}`;

			axios.head(arxivHtmlUrl)
				.then((response) => {
					if (response.status === 200) {
						setHtmlUrl(arxivHtmlUrl);
					} else {
						setHtmlUrl(ar5ivHtmlUrl);
					}
				})
				.catch(() => {
					setHtmlUrl(ar5ivHtmlUrl); // Fallback to ar5iv if Arxiv HTML doesn't exist
				});
		}
	}, [paper?.arxiv_id]);

	const authorList = paper.authors?.map((author) => author.replace(/\\/g, '')) || ["Anonymous"];
	const displayedAuthors = authorList.length > 15 ? authorList.slice(0, 15).join(", ") : authorList.join(", ");
	const additionalAuthors = authorList.length > 15 ? `+${authorList.length - 15} Authors` : '';

	// Add / remove paper from library
	const handleBookmark = async () => {
		await bookmark(id.replace(/\./g, ""), isBookmarked);
		setIsBookmarked(!isBookmarked);
	};

	return (
		<div className="container pt-2">
			{error ? (
				<>
					<h3>Paper {id} not found</h3>
					<p>Please check the Arxiv ID or try again later.</p>
				</>
			) : !paper ? (
				<p>Loading...</p>
			) : (
				<>
					{/* Paper details */}
					<h3>{paper.title}</h3>
					<i className="small-text">
						{displayedAuthors}
						{additionalAuthors && (
							<span className="additional-authors">
								{additionalAuthors}
							</span>
						)}
					</i>
					<p>{paper.date}</p>
					<br />
					<p className="abstract">{paper.abstract}</p>
					<div className="container p-0 pt-1">
						<div className="row">
							<div className="col d-flex">
								<div className="d-flex align-items-center align-self-start">
									<p className="mb-0 me-2">Categories:</p>
								</div>
								<div className="paper-categories d-flex flex-wrap gap-1 mt-1 align-items-center">
									{paper.categories?.map((category, index) => (
										<span key={index} className="badge bg-secondary me-1 px-2">{category}</span>
									))}
								</div>
							</div>
						</div>
					</div>
					<br />
					{/* Paper action buttons */}
					<div className="action-buttons">
						<a className="btn btn-primary mt-3 me-2 btn-paper"
							href={`https://arxiv.org/abs/${paper.arxiv_id}`}
							target="_blank" rel="noopener noreferrer"
							role="button">
							Read Paper
						</a>
						<Link to={`/similar/${paper.id}`} key={paper.id}>
							<button className="btn btn-info mt-3 me-2">Find Similar</button>
						</Link>

						{isAuthenticated &&
							<button onClick={handleBookmark} className={`btn mt-3 me-2 ${isBookmarked ? 'btn-danger' : 'btn-primary'}`}>
								{isBookmarked ? "Remove from Library" : "Add to Library"}
							</button>
						}

						<a className="btn btn-primary btn-html mt-3 me-2"
							href={htmlUrl}
							target="_blank" rel="noopener noreferrer"
							role="button">
							Read HTML
						</a>
					</div>
				</>
			)}
		</div>
	);
};

export default Paper;
