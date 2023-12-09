import {Link} from "react-router-dom";
import axios from 'axios';
import './Result.css'


const LibraryResult = (props) => {
	const {item} = props;

    const bookmark = async (status) => {
        try {
            await axios.post('/addpaper', { paper_id: item.id, status: status});
            props.onStatusChange();
        } catch (error) {
            console.error(error);
        }
    };

    const removeBookmark = async () => {
        try {
            await axios.post('/removepaper', { paper_id: item.id });
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
							<div className="col-md-12 result-container py-3 px-1 border-bottom">
							<Link className="nav-link paper-title" to={`/paper/${item.id}`} key={item.id}>
								<h6 className="mb-1">{item.title}</h6>
							</Link>
								<p className="small-text date mb-1">{item.date}</p>
								{item.status !== 'to read' && (
									<button className="small-text pe-2 btn btn-primary btn-sm mx-1" onClick={() => bookmark('to read')}>Mark as to Read</button>
								)}
								{item.status !== 'read' && (
									<button className="small-text pe-2 btn btn-primary btn-sm mx-1" onClick={() => bookmark('read')}>Mark as Read</button>
								)}
								{item.status !== 'currently reading' && (
									<button className="small-text pe-2 btn btn-primary btn-sm mx-1" onClick={() => bookmark('currently reading')}>Mark as Reading</button>
								)}
								<button className="small-text pe-2 btn btn-danger btn-sm mx-1" onClick={removeBookmark}>Remove</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</li>
		</>
		);
}

export default LibraryResult;
