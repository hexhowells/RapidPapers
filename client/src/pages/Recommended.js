import ListResults from "../components/ListResults";
import HeaderResults from "../components/HeaderResults";
import Pagination from "../components/Pagination";

import React, { useState, useEffect } from 'react';


const Main = () => {
  const [results, setResults] = useState(0);
  const [sortType, setSortType] = useState('desc');
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(100);

    useEffect(() => {
      fetch(`/api/v1/recommended?sort=${sortType}&page=${pageNum}`)
        .then((res) => res.json())
        .then((data) => {
          setNumPages(Math.ceil(data.num_results / 50));
          setResults(data.results);
        })
        .catch((error) => {
          console.error('Error fetching data from backend:', error);
        });
    }, [sortType, pageNum]);

  return (
    <>
    <div>
      <div className="container">
        {/*<SearchBar setResults={setResults}></SearchBar>*/}

        <HeaderResults setSortType={setSortType} setPageNum={setPageNum} headerTitle="Recommended for you"></HeaderResults>
        <ListResults results={results}></ListResults>
        <Pagination pageNum={pageNum} setPageNum={setPageNum} numPages={numPages}></Pagination>
      </div>
    </div>
    </>
    );
};

export default Main;