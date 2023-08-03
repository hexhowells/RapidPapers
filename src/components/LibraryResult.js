import {Link} from "react-router-dom";
import axios from 'axios';
import './Result.css'


const LibraryResult = (props) => {
	const {item} = props;

    const bookmark = async (status) => {
        try {
            await axios.post('/addpaper', { paper_id: item.id, status: status});
        } catch (error) {
            console.error(error);
        }
    };

    const removeBookmark = async () => {
        try {
            await axios.post('/removepaper', { paper_id: item.id });
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
							<div className="col-md-12 result-container p-3 border-bottom">
							<Link className="nav-link paper-title" to={`/paper/${item.id}`} key={item.id}>
								<h6 className="mb-1">{item.title}</h6>
							</Link>
								{/*<i className="small-text">
								  {item.authors
								    ? item.authors.map((author) => author.replace(/\\/g, '')).join(", ")
								    : "Anonymous"}
								</i>*/}

								<p className="small-text date">{item.date}</p>

								{/*<p>{item.abstract?.slice(0, 400)}...</p>*/}
								{item.status !== 'to read' && (
									<a className="pe-2" onClick={() => bookmark('to read')}>Mark as to Read</a>
								)}
								{item.status !== 'read' && (
									<a className="pe-2" onClick={() => bookmark('read')}>Mark as Read</a>
								)}
								{item.status !== 'currently reading' && (
									<a className="pe-2" onClick={() => bookmark('currently reading')}>Mark as Reading</a>
								)}
								<a className="pe-2" onClick={removeBookmark}>Remove</a>
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
