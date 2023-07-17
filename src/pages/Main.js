import SearchBar from "../components/SearchBar";
import ListResults from "../components/ListResults";
import HeaderResults from "../components/HeaderResults";

import React, { useState, useEffect } from 'react';


const Main = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(0);

    useEffect(() => {
      fetch('/api/v1/search')
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results);
        })
        .catch((error) => {
          console.error('Error fetching data from backend:', error);
        });
    }, []);

    useEffect(() => {
      fetch(`/api/v1/search?query=${searchQuery}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results);
        })
        .catch((error) => {
          console.error('Error fetching data from backend:', error);
        });
    }, [searchQuery]);

  return (
    <>
    <div>
      <div className="container">
        <SearchBar setSearchQuery={setSearchQuery}></SearchBar>

        <HeaderResults></HeaderResults>
        <ListResults results={results}></ListResults>
      </div>
    </div>
    </>
    );
};

export default Main;
