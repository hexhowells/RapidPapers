import { useParams, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './Paper.css';

const Paper = () => {
	const { id } = useParams();
	const [paper, setPaper] = useState(null);
	const [error, setError] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [htmlUrl, setHtmlUrl] = useState("");

	// Store the library status (e.g., "to read", "currently reading", "read", or empty if not in library)
	const [libraryStatus, setLibraryStatus] = useState("");

	// Checks if the user is authenticated
	useEffect(() => {
	axios.get('/api/v1/profile')
		.then(() => {
		setIsAuthenticated(true);
		})
		.catch(() => {
		setIsAuthenticated(false);
		});
	}, []);

	// Fetch paper data
	useEffect(() => {
	fetch(`/api/v1/paper?id=${id.replace(/\./g, "")}`)
		.then((res) => res.json())
		.then((data) => {
		setPaper(data);
		// data.library_status could be true/false or the actual status string,
		// adjust as needed. For example, if data.library_status is a string like "read", use that:
		setLibraryStatus(data.library_status || "");
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
			// Fallback to ar5iv if Arxiv HTML doesn't exist
			setHtmlUrl(ar5ivHtmlUrl);
		});
	}
	}, [paper?.arxiv_id]);

	const authorList = paper?.authors?.map((author) => author.replace(/\\/g, '')) || ["Anonymous"];
	const displayedAuthors = authorList.length > 15 
	? authorList.slice(0, 15).join(", ") 
	: authorList.join(", ");
	const additionalAuthors = authorList.length > 15 
	? `+${authorList.length - 15} Authors` 
	: '';

	/**
	* Sets the paper's bookmark status by calling /api/v1/addpaper
	*/
	const setBookmarkStatus = async (status) => {
	try {
		await axios.post('/api/v1/addpaper', { 
		paper_id: paper.id, 
		status: status 
		});
		// Update local state so we display the correct status
		setLibraryStatus(status);
	} catch (err) {
		console.error(err);
	}
	};

	/**
	* Removes the paper from the user's library by calling /api/v1/removepaper
	*/
	const removeBookmark = async () => {
	try {
		await axios.post('/api/v1/removepaper', { paper_id: paper.id });
		setLibraryStatus("");
	} catch (err) {
		console.error(err);
	}
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
					<span key={index} className="badge bg-secondary me-1 px-2">
						{category}
					</span>
					))}
				</div>
				</div>
			</div>
			</div>
			<br />
			{/* Paper action buttons */}
			<div className="action-buttons">
			<a
				className="btn btn-primary mt-3 me-2 btn-paper"
				href={`https://arxiv.org/abs/${paper.arxiv_id}`}
				target="_blank"
				rel="noopener noreferrer"
				role="button"
			>
				Read Paper
			</a>

			<Link to={`/similar/${paper.id}`} key={paper.id}>
				<button className="btn btn-info mt-3 me-2">
				Find Similar
				</button>
			</Link>

			{isAuthenticated && (
				<div className="btn-group me-2 mt-3">
				<button
					className={`btn ${libraryStatus ? 'btn-success' : 'btn-primary'} dropdown-toggle`}
					type="button"
					id="dropdownMenuButton"
					data-bs-toggle="dropdown"
					aria-expanded="false"
					style={{ textTransform: "capitalize" }}
				>
					{libraryStatus 
						 ? `Library: ${libraryStatus} ` 
						 : 'Add to Library '}
				</button>
				<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
					<li>
						<button
							className="dropdown-item"
							onClick={() => setBookmarkStatus('to read')}
						>
							Mark as To Read
						</button>
					</li>
					<li>
						<button
							className="dropdown-item"
							onClick={() => setBookmarkStatus('currently reading')}
						>
							Mark as Reading
						</button>
					</li>
					<li>
						<button
							className="dropdown-item"
							onClick={() => setBookmarkStatus('read')}
						>
							Mark as Read
						</button>
					</li>
					<li><hr className="dropdown-divider" /></li>
					<li>
						<button
							className="dropdown-item text-danger"
							onClick={removeBookmark}
						>
							Remove
						</button>
					</li>
				</ul>
			</div>
			)}

			<a
				className="btn btn-primary btn-html mt-3 me-2"
				href={htmlUrl}
				target="_blank"
				rel="noopener noreferrer"
				role="button"
			>
				Read HTML
			</a>
			</div>
		</>
		)}
	</div>
	);
};

export default Paper;
