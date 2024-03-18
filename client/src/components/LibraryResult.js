import {Link} from "react-router-dom";
import axios from 'axios';
import './LibraryResult.css';


const LibraryResult = (props) => {
	const {item} = props;

    const bookmark = async (status) => {
        try {
            await axios.post('/api/v1/addpaper', { paper_id: item.id, status: status});
            props.onStatusChange();
        } catch (error) {
            console.error(error);
        }
    };

    const removeBookmark = async () => {
        try {
            await axios.post('/api/v1/removepaper', { paper_id: item.id });
            props.onStatusChange();
        } catch (error) {
            console.error(error);
        }
    };

	return (
    <>
	    <li className="list-group-item pt-1 rounded" key={item.title}>
	        <div className="container-fluid">
		        <div className="row">
		            <div className="col-md-12">
			            <div className="row">
			                <div className="col-md-12 result-container py-3 px-1 border-bottom d-flex justify-content-between align-items-center">
				                <div>
				                    <Link className="nav-link paper-title" to={`/paper/${item.id}`} key={item.id}>
				                      <h6 className="mb-1">{item.title}</h6>
				                    </Link>
				                    <p className="small-text date mb-1">{item.date}</p>
				                </div>
			                  	<div className="dropdown">
									<button className="btn library-btn" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
									    &#x22EE;
									</button>
									<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
									    <li><button className="dropdown-item" onClick={() => bookmark('to read')}>Mark as To Read</button></li>
									    <li><button className="dropdown-item" onClick={() => bookmark('currently reading')}>Mark as Reading</button></li>
									    <li><button className="dropdown-item" onClick={() => bookmark('read')}>Mark as Read</button></li>
									    <li><hr className="dropdown-divider" /></li>
									    <li><button className="dropdown-item text-danger" onClick={removeBookmark}>Remove</button></li>
									</ul>
								</div>
			                </div>
			            </div>
		            </div>
		        </div>
	        </div>
	    </li>
	    </>
	);
};

export default LibraryResult;
