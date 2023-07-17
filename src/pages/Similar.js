import SearchBar from "../components/SearchBar";
import ListResults from "../components/ListResults";
import HeaderResults from "../components/HeaderResults";

import {useParams} from "react-router-dom";
import React, { useState, useEffect } from 'react';


const Main = () => {
  const { id } = useParams();
  const [results, setResults] = useState(0);

    useEffect(() => {
      fetch(`/api/v1/similar?id=${id}`)
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