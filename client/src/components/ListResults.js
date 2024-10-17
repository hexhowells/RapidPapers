import { useState, useEffect } from 'react';
import axios from 'axios';
import './ListResults.css';
import Result from "./Result"


const ListResults = ({results, highlightOriginal=false}) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	
	// Checks if user is authenticated
    useEffect(() => {
        axios.get('/api/v1/profile')
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
			{!results ? null : results.map((item, index) => (
				<>
				<Result 
				item={item} 
				index={index} 
				highlightOriginal={highlightOriginal}
				isAuthenticated={isAuthenticated}
				></Result>
				</>
			))}
		</ul>
		</>
		);
}

export default ListResults;
