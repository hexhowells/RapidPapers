import './ListResults.css';
import {Link} from "react-router-dom";

interface ResultItem {
	question: string;
	answer: string;
	ai: string;
	author: string;
}

interface ListResultsProps {
	results: ResultItem[];
}

const ListResults = (props: ListResultsProps) => {
	return (
		<>
		<ul className="list-group">
		{!props.results ? null : props.results.map((item, index) => (
			<li className="list-group-item pt-4 pb-4 mb-3 rounded" key={item.question}>
				
				<div className="container-fluid">
					<div className="row">
						{/*<div className="col-md-2">
							<ul className="nav nav-pills">
								<li className="nav-item col-md-10 p-0 py-1">
									 <p className="pt-4">3 votes</p>
								</li>
							</ul>
						</div>*/}
						<div className="col-md-12">
							<div className="row">
								<div className="col-md-12 result-container">
								<Link className="nav-link paper-title" to={`paper/${item.id}`} key={item.id}>
									<h5>{item.title}</h5>
								</Link>
									{/*<a className={item.authors ? "nav-link" : "nav-link disabled"} href="/"></a>*/}
									<i className="small-text">
									  {item.authors
									    ? item.authors.map((author) => author.replace(/\\/g, '')).join(", ")
									    : "Anonymous"}
									</i>

									<p className="small-text date">{item.date}</p>

									<p>{item.abstract.slice(0, 400)}...</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</li>
		))}
		</ul>
		</>
		);
}

export default ListResults;