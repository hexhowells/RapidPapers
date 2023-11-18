import './HeaderResults.css';

const HeaderResults = ({setSortType, setPageNum, showDropdown=true, headerTitle="Results"}) => {
	return (
		<>
			<div className="container d-flex flex-wrap justify-content-center py-3">
		        <h4 className="my-1 col-12 col-lg-auto mb-lg-0 me-lg-auto">{headerTitle}</h4>
		        
		        {showDropdown && (
		          	<div className="dropdown px-3">
					    <select className="form-select" onChange={(event) => {
					    		setSortType(event.target.value);
					    		setPageNum(1);
					    	}}>
					    	<option value="relevant">Most relevant</option>
					    	<option value="desc">Newest</option>
				            <option value="asc">Oldest</option>
				        </select>
					</div>
				)}
		    </div>
		</>
	);
}

export default HeaderResults;