import './HeaderResults.css';

const HeaderResults = ({setSortType, setPageNum, showDropdown=true, headerTitle="Results"}) => {
	return (
		<>
			<div className="container d-flex flex-wrap flex-row justify-content-between py-3">
		        <h4 className="my-1 me-lg-auto">{headerTitle}</h4>
		        
		        {showDropdown && (
		          	<div className="dropdown">
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

