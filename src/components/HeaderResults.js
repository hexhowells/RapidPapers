import './HeaderResults.css';

const HeaderResults = ({setSortType}) => {
	return (
		<>
			<div className="container d-flex flex-wrap justify-content-center py-3">
		        <h4 className="my-1 col-12 col-lg-auto mb-lg-0 me-lg-auto">Results</h4>
		        
	          	<div className="dropdown px-3">
				    <select className="form-select" onChange={(event) => setSortType(event.target.value)}>
				    	<option value="relevant">Most relevant</option>
				    	<option value="desc">Descending</option>
			            <option value="asc">Ascending</option>
			        </select>
				</div>
		    </div>
		</>
	);
}

export default HeaderResults;