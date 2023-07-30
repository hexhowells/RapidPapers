import {Link} from "react-router-dom";
import { BsFillCaretUpFill, BsFillCaretDownFill, BsFillBookmarkFill } from "react-icons/bs";
import axios from 'axios';
import './Result.css'


const Result = (props) => {
	const {item} = props;

	const upvote = async () => {
        try {
            await axios.post('/upvote', { paper_id: item.id });
        } catch (error) {
            console.error(error);
        }
    };

    const downvote = async () => {
        try {
            await axios.post('/downvote', { paper_id: item.id });
        } catch (error) {
            console.error(error);
        }
    };

    const bookmark = async () => {
        try {
            await axios.post('/bookmark', { paper_id: item.id });
        } catch (error) {
            console.error(error);
        }
    };

	return (
		<>
		<li className="list-group-item pt-4 pb-4 mb-3 rounded" key={item.title}>
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-1">
						<button onClick={upvote} className="btn btn-primary m-auto btn-square">
		                    <BsFillCaretUpFill size={15}/>
		                </button>
		                <p className="text-center my-1">{item.upvotes}</p>
		                <button onClick={downvote} className="btn btn-primary m-auto btn-square">
		                    <BsFillCaretDownFill size={15}/>
		                </button>
		                <button onClick={bookmark} className="btn btn-primary m-auto mt-4 btn-square">
		                    <BsFillBookmarkFill size={15}/>
		                </button>
					</div>
					<div className="col-md-11">
						<div className="row">
							<div className="col-md-12 result-container">
							<Link className="nav-link paper-title" to={`/paper/${item.id}`} key={item.id}>
								<h5>{item.title}</h5>
							</Link>
								{/*<a className={item.authors ? "nav-link" : "nav-link disabled"} href="/"></a>*/}
								<i className="small-text">
								  {item.authors
								    ? item.authors.map((author) => author.replace(/\\/g, '')).join(", ")
								    : "Anonymous"}
								</i>

								<p className="small-text date">{item.date}</p>

								<p>{item.abstract?.slice(0, 400)}...</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</li>
		</>
		);
}

export default Result;