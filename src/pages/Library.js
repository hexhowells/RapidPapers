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
                    <div className="ps-4">
                        <h4 className="pt-4">Papers to read</h4>
                        <p>{data.toRead.length} papers</p>
                    </div>
                    <ul>
                        {data.toRead.map((paper, index) => (
                            <LibraryResult key={index} item={paper}></LibraryResult>
                        ))}
                    </ul>
                </Tab>
                <Tab eventKey="reading" title="Reading">
                    <div className="ps-4">
                        <h4 className="pt-4">Papers being read</h4>
                        <p>{data.reading.length} papers</p>
                    </div>
                    <ul>
                        {data.reading.map((paper, index) => (
                            <LibraryResult key={index} item={paper}></LibraryResult>
                        ))}
                    </ul>
                </Tab>
                <Tab eventKey="read" title="Read">
                    <div className="ps-4">
                        <h4 className="pt-4">Papers previously read</h4>
                        <p>{data.read.length} papers</p>
                    </div>
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
