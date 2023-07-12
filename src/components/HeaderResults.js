import Dropdown from 'react-bootstrap/Dropdown';

const HeaderResults = () => {
	return (
		<>
			<div className="container d-flex flex-wrap justify-content-center py-3">
		        <h4 className="my-1 col-12 col-lg-auto mb-lg-0 me-lg-auto">Results</h4>
		        
	          	<div className="dropdown px-3">
				  	<Dropdown>
				     	<Dropdown.Toggle variant="secondary" id="dropdown-basic">
				        	Sort
				        </Dropdown.Toggle>

				      	<Dropdown.Menu>
				        	<Dropdown.Item href="#/action-1">Most Relevant</Dropdown.Item>
				        	<Dropdown.Item href="#/action-2">Newest</Dropdown.Item>
				        	<Dropdown.Item href="#/action-3">Oldest</Dropdown.Item>
				      	</Dropdown.Menu>
				    </Dropdown>
				</div>
		        
	          	<div className="dropdown">
				  	<Dropdown>
				     	<Dropdown.Toggle variant="secondary" id="dropdown-basic">
				        	Filter
				      	</Dropdown.Toggle>

				      	<Dropdown.Menu>
				        	<Dropdown.Item href="#/action-1">ChatGPT</Dropdown.Item>
				        	<Dropdown.Item href="#/action-2">GPT4</Dropdown.Item>
				        	<Dropdown.Item href="#/action-3">Claude</Dropdown.Item>
				        	<Dropdown.Item href="#/action-3">YouChat</Dropdown.Item>
				        	<Dropdown.Item href="#/action-3">Perplexity</Dropdown.Item>
				        	<Dropdown.Item href="#/action-3">Bing AI</Dropdown.Item>
				        	<Dropdown.Item href="#/action-3">BARD</Dropdown.Item>
				        	<Dropdown.Item href="#/action-3">Poe</Dropdown.Item>
				      	</Dropdown.Menu>
				    </Dropdown>
				</div>
		        
		    </div>
		</>
	);
}

export default HeaderResults;