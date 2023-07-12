import SearchBar from "../components/SearchBar";
import ListResults from "../components/ListResults";
import HeaderResults from "../components/HeaderResults";

import React, { useState, useEffect } from 'react';


const Main = () => {
  const [results, setResults] = useState(0);

    useEffect(() => {
      fetch('/search')
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results);
        })
        .catch((error) => {
          console.error('Error fetching data from backend:', error);
        });
    }, []);

  return (
    <>
    <div>
      <div className="container">
        <SearchBar setResults={setResults}></SearchBar>

        <HeaderResults></HeaderResults>
        <ListResults results={results}></ListResults>
      </div>
    </div>
    </>
    );
};

export default Main;
