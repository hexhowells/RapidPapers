import { Link } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect } from 'react';

import logo from '../assets/logo.png';
import './Header.css';


const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

	// Checks if the user is authenticated
    useEffect(() => {
        axios.get('/api/v1/profile')
            .then(response => {
                setIsAuthenticated(true);
            })
            .catch(error => {
                setIsAuthenticated(false);
            });
        
    }, []);

	// Routes the user to the homepage
    const handleClickLogo = () => {
        if (window.location.pathname !== '/') {
            window.location.href = '/';
        } else {
            window.location.reload();
        }
    };

	// Collapses the navigation bar
    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

	// Collapse the navigation bar when a navigation link is clicked 
    const handleNavLinkClick = () => {
        setIsNavCollapsed(true);
    };

    return (
        <>
            <nav className="navbar navbar-expand-md navbar-dark mb-4 py-3 header">
                <div className="container">
					{/* Header logo */}
                    <Link className="navbar-brand d-flex align-items-center" to="/" onClick={handleClickLogo}>
                        <img src={logo} alt="Logo" height="26" className="d-inline-block align-text-top me-1"></img>
                        <span className="ms-2 title">RapidPapers</span>
                    </Link>
					{/* Navbar toggle button */}
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded={!isNavCollapsed ? true : false} aria-label="Toggle navigation" onClick={handleNavCollapse}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
					{/* Navbar */}
                    <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item pe-2">
                                <Link className="nav-link link-light" to="/about" onClick={handleNavLinkClick}>About</Link>
                            </li>
							{/* Show additional links if user is authenticated */}
                            {isAuthenticated && 
                                <>
                                    <li className="nav-item pe-2">
                                        <Link className="nav-link link-light" to="/recommended" onClick={handleNavLinkClick}>Recommended</Link>
                                    </li>
                                    <li className="nav-item pe-2">
                                        <Link className="nav-link link-light" to="/library" onClick={handleNavLinkClick}>Library</Link>
                                    </li>
                                    <li className="nav-item pe-2">
                                        <Link className="nav-link link-light" to="/account" onClick={handleNavLinkClick}>Account</Link>
                                    </li>
                                </>
                            }
							{/* Show default links if user is not authenticated */}
                            {!isAuthenticated &&
                                <li className="nav-item">
                                    <Link className="nav-link link-light" to="/login" onClick={handleNavLinkClick}>Login</Link>
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
