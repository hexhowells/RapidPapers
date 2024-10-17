import {Link} from "react-router-dom";
import './Result.css'


const Result = ({item, index, highlightOriginal, isAuthenticated}) => {
	const authorList = item.authors?.map((author) => author.replace(/\\/g, '')) || ["Anonymous"];
    const displayedAuthors = authorList.length > 15 ? authorList.slice(0, 15).join(", ") : authorList.join(", ");
    const additionalAuthors = authorList.length > 15 ? `+${authorList.length - 15} Authors` : '';

	const isOriginal = highlightOriginal && (index === 0);

	return (
		<>
		{isOriginal &&
			<p className="small-text mb-1 ps-2 text-primary">
				Original paper
			</p>
		}
		<li 
		className={`list-group-item pt-4 pb-4 mb-3 rounded ${isOriginal ? 'border border-primary' : ''}`} 
		key={item.title}
		>
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-11">
						<div className="row">
							<div className="col-md-12 result-container">
								<Link className="nav-link paper-title" to={`/paper/${item.id}`} key={item.id}>
									<h5>{item.title}</h5>
								</Link>
								<i className="small-text">
                                    {displayedAuthors}
                                    {additionalAuthors && (
                                        <span className="additional-authors">
                                            {additionalAuthors}
                                        </span>
                                    )}
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
