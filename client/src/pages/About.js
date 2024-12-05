import React from 'react';
import './About.css'; // Assuming you have a CSS file for styling

const About = () => {
    return (
        <div className="container">
            <h2 className="about-header">Welcome to RapidPapers</h2>
            <p className="about-intro">
                RapidPapers is a website that aims to make the process of finding and organising machine learning
                research papers fast and simple.
            </p>
            <div className="about-content">
				<br></br>
				<h3>Three Pillars of RapidPapers</h3>
				<p>There are three main problems to solve to make RapidPapers a good resource for ingesting research papers.</p>

				<h4>Search</h4>
				<p>Powerful search enables papers to be found fast and easy. This should include the ability to filter search results based on: author, category, organisation, date, etc. This also includes the recommendation engine which should produce tailored recommendations for you with a high signal-to-noise ratio.</p>

				<h4>Organisation</h4>
				<p>There are a lot of papers you may want to read or have already read. Organising these papers so they are easy to find and track is important. This involves categorising the user's library (either manually or automatically). The ability to search the library and filter/sort results is equally valuable. An organised library is an organised mind.</p>

				<h4>Reading</h4>
				<p>Once papers are found and organised the last frontier is improving the process of reading these papers. This is probably the hardest problem and will likely require a built-in paper viewer in RapidPapers. Paper summarisation and highlighting key sections in the research will be valuable in filtering out noise and only ingesting the information that matters. Doing this at scale with good accuracy is hard but needs to be done. Ultimately enabling users to quickly process the most important information will be the most valuable feature of this site (search is a part of this too).</p>

				<br></br>
				
				<h4>Indexed Papers</h4>
                <p>
                    RapidPapers only currently supports machine learning papers from arxiv.org, new papers are updated once daily as per the arxiv API. The following arxiv paper categories are stored and indexed on the site:
                </p>
				<ul className="about-list">
					<li>cs.AI (Artificial Intelligence)</li>
					<li>cs.CL (Computation and Language)</li>
					<li>cs.CV (Computer Vision and Pattern Recognition)</li>
					<li>cs.LG (Machine Learning)</li>
					<li>cs.MA (Multiagent Systems)</li>
					<li>cs.NE (Neural and Evolutionary Computing)</li>
					<li>cs.RO (Robotics)</li>
					<li>stat.ML (Machine Learning Statistics)</li>
				</ul>

				<br></br>
				
				<h4>Contributions</h4>
				<p>RapidPapers is entirely open source. The Github repository of the front and backend can be found here: <a href="https://github.com/hexhowells/RapidPapers">https://github.com/hexhowells/RapidPapers</a>. Currently, the entire site is solely developed by <a href="https://hexhowells.com">HexHowells</a>. There is a lot of work left to improve the testing, stability, performance, and feature set of the site. If you care about solving this problem feel free to: provide feedback, report bugs, or contribute to the codebase!</p>

				<br></br>

				<h4>Donate</h4>
				<p>If you want to help support the development and hosting of this site, consider donating via <a href="https://www.paypal.com/donate/?hosted_button_id=ZJ3DKEBXM7H3G">PayPal</a>.</p>

				<br></br>

				<h4>Similar Sites</h4>
				<p>Since the inception and creation of this website various similar projects of varying scale have been created (as well as some existing prior). Here is a list of similar websites that you might find interesting/useful:</p>
				<ul className="about-list">
					<li><a href="https://arxiv-sanity-lite.com">Arxiv Sanity</a> - Developed by Andrej Karpathy. Able to search papers through text and paper similarity.</li>
					<li><a href="https://paperswithcode.com">Papers With Code</a> - Developed by MetaAI. Shows globally trending AI research with associated code repositories.</li>
					<li><a href="https://huggingface.co/papers">Hugging Face Daily Papers</a> - Developed by Hugging Face. A daily curated list by AK of the top AI research papers.</li>
					<li><a href="https://bulletpapers.ai">Bulletpapers</a> - Developed by a team for the Anthropic Hackathon. Shows Claude generated summaries and key points of all papers on arxiv with a beautiful UI.</li>
				</ul>
            </div>
        </div>
    );
};

export default About;
