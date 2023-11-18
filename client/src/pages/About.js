
const About = () => {
	return (
		<>
		<div className="container">
			<h2 className="pt-3">About RapidPapers</h2>
			<br></br>
			<p>
				RapidPapers is a website that aims to make the process of finding and organising machine learning
				research papers fast and simple.
			</p>
			<p>
				Currently only supports arxiv papers, arxiv is pinged for new papers every hour however results 
				are typically returned as batches once a day.
			</p>
			<p>
				Currently indexed arxiv categories:
				<ul>
					<li>cs.AI</li>
 					<li>cs.CL</li>
 					<li>cs.CV</li>
 					<li>cs.LG</li>
 					<li>cs.MA</li>
 					<li>cs.NE</li>
 					<li>cs.RO</li>
 					<li>stat.ML</li>
 				</ul>
			</p>
		</div>
		</>
		);
};

export default About;