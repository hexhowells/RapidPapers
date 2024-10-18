import { useState, useEffect } from 'react';
import axios from 'axios';
import './ListResults.css';
import Result from "./Result";
import { BarLoader } from 'react-spinners';


const ListResults = ({results, loading=false, highlightOriginal=false}) => {
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
		{loading ? (
			<div className="d-flex justify-content-center align-items-center py-5">
				<BarLoader 
					color={'#014e8c'} 
					size={12} 
					width={window.innerWidth < 768 ? 250 : 600} 
					loading={loading}
				/>
			</div>
		) : (
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
		)}
		</>
		);
}

export default ListResults;
