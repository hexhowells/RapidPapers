import { Route, Routes } from "react-router-dom";

import Main from "./pages/Main";
import About from "./pages/About";
import Account from "./pages/Account";
import Paper from "./pages/Paper";
import Similar from "./pages/Similar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Library from "./pages/Library";
import Recommended from "./pages/Recommended";

import Header from "./components/Header";
import Footer from "./components/Footer"

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import './App.css';


function App() {
  return (
    <>
    <Header></Header>
    <Routes>
      <Route path="/" element={<Main/>}></Route>
      <Route path="/about" element={<About/>}></Route>
      <Route path="/account" element={<Account/>}></Route>
      <Route path="/paper/:id" element={<Paper/>}></Route>
      <Route path="/similar/:id" element={<Similar/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/signup" element={<Signup/>}></Route>
      <Route path="/library" element={<Library/>}></Route>
      <Route path="/recommended" element={<Recommended/>}></Route>
    </Routes>
    <Footer></Footer>
    </>
    );
};

export default App;
