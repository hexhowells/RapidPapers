import SearchBar from "../components/SearchBar";
import ListResults from "../components/ListResults";
import HeaderResults from "../components/HeaderResults";
import Pagination from "../components/Pagination";

import React, { useState, useEffect } from 'react';


const Main = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(0);
  const [sortType, setSortType] = useState('relevant')
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(100);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    var api_request;
    if (searchQuery) {
      api_request = `/api/v1/search?query=${searchQuery}&sort=${sortType}&page=${pageNum}`;
      setShowDropdown(true);
    }
    else {
      api_request = `/api/v1/search?page=${pageNum}`;
      setShowDropdown(false);
    }

    fetch(api_request)
      .then((res) => res.json())
      .then((data) => {
        setNumPages(Math.ceil(data.num_results / 50));
        setResults(data.results);
      })
      .catch((error) => {
        console.error('Error fetching data from backend:', error);
      });
  }, [searchQuery, sortType, pageNum]);

  return (
    <>
    <div>
      <div className="container">
        <SearchBar setSearchQuery={setSearchQuery} setPageNum={setPageNum}></SearchBar>

        <HeaderResults setSortType={setSortType} setPageNum={setPageNum} showDropdown={showDropdown}></HeaderResults>
        <ListResults results={results}></ListResults>
        <Pagination pageNum={pageNum} setPageNum={setPageNum} numPages={numPages}></Pagination>
      </div>
    </div>
    </>
    );
};

export default Main;
