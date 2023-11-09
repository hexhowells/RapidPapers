import {Link} from "react-router-dom";
import { useState, useEffect } from 'react';
import { BsFillCaretUpFill, BsFillCaretDownFill, BsFillBookmarkFill, BsFillBookmarkCheckFill } from "react-icons/bs";
import { upvote, downvote, fetchUserVote } from '../utilities/votingUtils';
import { bookmark } from '../utilities/bookmarkUtils';
import './Result.css'


const Result = ({item, isAuthenticated}) => {
	const [upvotes, setUpvotes] = useState(item.upvotes);
	const [userVote, setUserVote] = useState(null);
	const [isBookmarked, setIsBookmarked] = useState(false);

	useEffect(() => {
		setUpvotes(item.upvotes);
		setUserVote(item.upvote_status);
		setIsBookmarked(item.library_status);
	}, [item]);


    const handleUpvote = async () => {
        const data = await upvote(item.id);
        setUpvotes(data.upvotes);
        const userVoteData = await fetchUserVote(item.id);
        setUserVote(userVoteData);
    };

    const handleDownvote = async () => {
        const data = await downvote(item.id);
        setUpvotes(data.upvotes);
        const userVoteData = await fetchUserVote(item.id);
        setUserVote(userVoteData);
    };

    const handleBookmark = async () => {
        await bookmark(item.id, isBookmarked);
        setIsBookmarked(!isBookmarked);
    };

	return (
		<>
		<li className="list-group-item pt-4 pb-4 mb-3 rounded" key={item.title}>
			<div className="container-fluid">
				<div className="row">
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
