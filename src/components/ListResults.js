import './ListResults.css';
import Result from "./Result"


const ListResults = (props) => {
	return (
		<>
		<ul className="list-group">
			{!props.results ? null : props.results.map((item, index) => (
				<>
				<Result item={item}></Result>
				</>
			))}
		</ul>
		</>
		);
}

export default ListResults;