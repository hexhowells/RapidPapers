import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ setResults }) => {
	const [query, setQuery] = useState('');

	const handleInputChange = (e) => {
		setQuery(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!query) {
			return;
		}

		try {
			const response = await fetch(`/search?query=${query}`);
			const data = await response.json();
			console.log(data);
			setResults(data.results);
		} catch (error) {
			console.error('Error:', error);
		}
	};
	return (
		<>
			<div className="form-outline pb-4">
				<form onSubmit={handleSubmit}>
	  				<input 
	  				type="search"
	  				value={query}
	  				onChange={handleInputChange}
	  				id="searchform" 
	  				className="form-control rounded-2" 
	  				placeholder="Search a paper" 
	  				aria-label="Search"/>
	  			</form>
			</div>
		</>
		);
}

export default SearchBar;