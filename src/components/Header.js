import { Link } from "react-router-dom";
import axios from 'axios';
import logo from '../assets/logo.png';
import './Header.css';
import { useState, useEffect } from 'react';

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        axios.get('/profile')
            .then(response => {
                setIsAuthenticated(true);
            })
            .catch(error => {
                setIsAuthenticated(false);
            });
        
    }, []);

    const handleClickLogo = () => {
        if (window.location.pathname !== '/') {
            // Navigate to the main page
            window.location.href = '/';
        } else {
            // Refresh the current page
            window.location.reload();
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-md navbar-dark mb-4 py-2 header">
                <div className="container">
                    <Link className="navbar-brand d-flex align-items-center" to="/" onClick={handleClickLogo}>
                        <img src={logo} alt="Logo" height="26" className="d-inline-block align-text-top me-1"></img>
                        <span className="ms-2 title">RapidPapers</span>
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item pe-2">
                                <Link className="nav-link link-light" to="/about">About</Link>
                            </li>
                            {isAuthenticated && 
                                <li className="nav-item pe-2">
                                    <Link className="nav-link link-light" to="/account">Account</Link>
                                </li>
                            }
                            {!isAuthenticated &&
                                <li className="nav-item">
                                    <Link className="nav-link link-light" to="/login">Login</Link>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;
