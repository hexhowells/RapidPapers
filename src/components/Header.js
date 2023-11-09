import { Link } from "react-router-dom";
import axios from 'axios';
import logo from '../assets/logo.png';
import './Header.css';
import { useState, useEffect } from 'react';

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

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
            window.location.href = '/';
        } else {
            window.location.reload();
        }
    };

    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

    const handleNavLinkClick = () => {
        // This will collapse the navbar when a link is clicked
        setIsNavCollapsed(true);
    };

    return (
        <>
            <nav className="navbar navbar-expand-md navbar-dark mb-4 py-3 header">
                <div className="container">
                    <Link className="navbar-brand d-flex align-items-center" to="/" onClick={handleClickLogo}>
                        <img src={logo} alt="Logo" height="26" className="d-inline-block align-text-top me-1"></img>
                        <span className="ms-2 title">RapidPapers</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded={!isNavCollapsed ? true : false} aria-label="Toggle navigation" onClick={handleNavCollapse}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item pe-2">
                                <Link className="nav-link link-light" to="/about" onClick={handleNavLinkClick}>About</Link>
                            </li>
                            {isAuthenticated && 
                                <>
                                    <li className="nav-item pe-2">
                                        <Link className="nav-link link-light" to="/library" onClick={handleNavLinkClick}>Library</Link>
                                    </li>
                                    <li className="nav-item pe-2">
                                        <Link className="nav-link link-light" to="/account" onClick={handleNavLinkClick}>Account</Link>
                                    </li>
                                </>
                            }
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
