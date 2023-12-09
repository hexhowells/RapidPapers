import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import LibraryResult from "./../components/LibraryResult"
import './Library.css';

const Library = () => {
    const [data, setData] = useState({toRead: [], reading: [], read: []});
    const [statusChange, setStatusChange] = useState(false);

	// Fetch all the papers in the user's library
    useEffect(() => {
        fetch('/getuserpapers')
            .then(response => response.json())
            .then(data => {
                const toRead = data['results'].filter(paper => paper.status === 'to read');
                const reading = data['results'].filter(paper => paper.status === 'currently reading');
                const read = data['results'].filter(paper => paper.status === 'read');
                setData({toRead, reading, read});
            });
    }, [statusChange]);

    return (
        <div>
            <div className="container">
            <Tabs defaultActiveKey="toRead" id="reading-list-tabs">
				{/* Papers to read tab */}
                <Tab eventKey="toRead" title="To Read">
                    <div className="library-header ps-2">
                        <h4 className="pt-4">Papers to read</h4>
                        <p>{data.toRead.length} papers</p>
                    </div>
                    <ul className="library-result">
                        {data.toRead.map((paper, index) => (
                            <LibraryResult 
                                key={index} 
                                item={paper} 
                                onStatusChange={() => setStatusChange(prevState => !prevState)}>
                            </LibraryResult>
                        ))}
                    </ul>
                </Tab>
				{/* Papers being read tab */}
                <Tab eventKey="reading" title="Reading">
                    <div className="ps-4">
                        <h4 className="pt-4">Papers being read</h4>
                        <p>{data.reading.length} papers</p>
                    </div>
                    <ul className="library-result">
                        {data.reading.map((paper, index) => (
                            <LibraryResult 
                                key={index} 
                                item={paper} 
                                onStatusChange={() => setStatusChange(prevState => !prevState)}>
                            </LibraryResult>
                        ))}
                    </ul>
                </Tab>
				{/* Papers that have been read tab */}
                <Tab eventKey="read" title="Read">
                    <div className="ps-4">
                        <h4 className="pt-4">Papers previously read</h4>
                        <p>{data.read.length} papers</p>
                    </div>
                    <ul className="library-result">
                        {data.read.map((paper, index) => (
                            <LibraryResult 
                                key={index} 
                                item={paper} 
                                onStatusChange={() => setStatusChange(prevState => !prevState)}>
                            </LibraryResult>
                        ))}
                    </ul>
                </Tab>
            </Tabs>
            </div>
        </div>
    );
};

export default Library;
