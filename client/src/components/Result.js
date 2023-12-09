import {Link} from "react-router-dom";
import './Result.css'


const Result = ({item, isAuthenticated}) => {

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
