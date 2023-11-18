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
									<a className="small-text pe-2" onClick={() => bookmark('to read')}>Mark as to Read</a>
								)}
								{item.status !== 'read' && (
									<a className="small-text pe-2" onClick={() => bookmark('read')}>Mark as Read</a>
								)}
								{item.status !== 'currently reading' && (
									<a className="small-text pe-2" onClick={() => bookmark('currently reading')}>Mark as Reading</a>
								)}
								<a className="small-text pe-2" onClick={removeBookmark}>Remove</a>
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
