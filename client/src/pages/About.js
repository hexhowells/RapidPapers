import React from 'react';
import './About.css'; // Assuming you have a CSS file for styling

const About = () => {
    return (
        <div className="about-container">
            <h2 className="about-header">Welcome to RapidPapers</h2>
            <p className="about-intro">
                RapidPapers is a website that aims to make the process of finding and organising machine learning
                research papers fast and simple.
            </p>
            <div className="about-content">
                <p>
                    Currently supports arxiv papers, new papers are updated once daily.
                </p>
                <p>
                    <strong>Organized Categories:</strong>
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
                </p>
            </div>
        </div>
    );
};

export default About;
