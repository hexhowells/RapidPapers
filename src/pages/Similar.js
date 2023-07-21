import ListResults from "../components/ListResults";
import HeaderResults from "../components/HeaderResults";
import Pagination from "../components/Pagination";

import {useParams} from "react-router-dom";
import React, { useState, useEffect } from 'react';


const Main = () => {
  const { id } = useParams();
  const [results, setResults] = useState(0);
  const [sortType, setSortType] = useState('relevant');
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(100);

    useEffect(() => {
      fetch(`/api/v1/similar?id=${id}&sort=${sortType}&page=${pageNum}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results);
        })
        .catch((error) => {
          console.error('Error fetching data from backend:', error);
        });
    }, [id, sortType, pageNum]);

  return (
    <>
    <div>
      <div className="container">
        {/*<SearchBar setResults={setResults}></SearchBar>*/}

        <HeaderResults setSortType={setSortType} setPageNum={setPageNum}></HeaderResults>
        <ListResults results={results}></ListResults>
        <Pagination pageNum={pageNum} setPageNum={setPageNum} numPages={numPages}></Pagination>
      </div>
    </div>
    </>
    );
};

export default Main;
