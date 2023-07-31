import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import LibraryResult from "./../components/LibraryResult"

const Library = () => {
    const [data, setData] = useState({toRead: [], reading: [], read: []});

    useEffect(() => {
        fetch('/getuserpapers')
            .then(response => response.json())
            .then(data => {
                const toRead = data['results'].filter(paper => paper.status === 'to read');
                const reading = data['results'].filter(paper => paper.status === 'currently reading');
                const read = data['results'].filter(paper => paper.status === 'read');
                setData({toRead, reading, read});
            });
    }, []);

    return (
        <div>
            <div className="container">
            <Tabs defaultActiveKey="toRead" id="reading-list-tabs">
                <Tab eventKey="toRead" title="To Read">
                    <h4 className="py-3">Papers to read</h4>
                    <ul>
                        {data.toRead.map((paper, index) => (
                            <LibraryResult key={index} item={paper}></LibraryResult>
                        ))}
                    </ul>
                </Tab>
                <Tab eventKey="reading" title="Reading">
                    <h4 className="py-3">Papers being read</h4>
                    <ul>
                        {data.reading.map((paper, index) => (
                            <LibraryResult key={index} item={paper}></LibraryResult>
                        ))}
                    </ul>
                </Tab>
                <Tab eventKey="read" title="Read">
                    <h4 className="py-3">Papers previously read</h4>
                    <ul>
                        {data.read.map((paper, index) => (
                            <LibraryResult key={index} item={paper}></LibraryResult>
                        ))}
                    </ul>
                </Tab>
            </Tabs>
            </div>
        </div>
    );
};

export default Library;
