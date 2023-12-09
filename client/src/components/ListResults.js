import { useState, useEffect } from 'react';
import axios from 'axios';
import './ListResults.css';
import Result from "./Result"


const ListResults = (props) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	
	// Checks if user is authenticated
    useEffect(() => {
        axios.get('/profile')
            .then(response => {
                setIsAuthenticated(true);
            })
            .catch(error => {
                setIsAuthenticated(false);
            });
        
    }, []);

	return (
		<>
		<ul className="list-group">
			{!props.results ? null : props.results.map((item, index) => (
				<>
				<Result item={item} isAuthenticated={isAuthenticated}></Result>
				</>
			))}
		</ul>
		</>
		);
}

export default ListResults;
