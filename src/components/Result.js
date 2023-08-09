import {Link} from "react-router-dom";
import { useState, useEffect } from 'react';
import { BsFillCaretUpFill, BsFillCaretDownFill, BsFillBookmarkFill } from "react-icons/bs";
import axios from 'axios';
import './Result.css'


const Result = (props) => {
	const {item} = props;

	const [upvotes, setUpvotes] = useState(item.upvotes);
	const [userVote, setUserVote] = useState(null);

	useEffect(() => {
		setUpvotes(item.upvotes);
		fetchUserVote(item.id);
	}, [item]);


	const fetchUserVote = async (id) => {
        try {
            const res = await axios.get(`/uservote?paper_id=${item.id}`);
            setUserVote(res.data.user_vote);  // Update based on server response
        } catch (error) {
            console.error(error);
        }
    };

	const upvote = async () => {
        try {
            const res = await axios.post('/upvote', { paper_id: item.id });
            setUpvotes(res.data.upvotes);
            fetchUserVote(item.id);
        } catch (error) {
            console.error(error);
        }
    };

    const downvote = async () => {
        try {
            const res = await axios.post('/downvote', { paper_id: item.id });
            setUpvotes(res.data.upvotes);
            fetchUserVote(item.id);
        } catch (error) {
            console.error(error);
        }
    };

    const bookmark = async () => {
        try {
            await axios.post('/addpaper', { paper_id: item.id, status: 'to read'});
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
						<button onClick={upvote} className={`btn  m-auto btn-square ${userVote === 'up' ? 'btn-success' : 'btn-primary'}`}>
		                    <BsFillCaretUpFill size={15}/>
		                </button>
		                <p className="text-center my-1">{upvotes}</p>
		                <button onClick={downvote} className={`btn m-auto btn-square ${userVote === 'down' ? 'btn-danger' : 'btn-primary'}`}>
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