import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Account = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
	
	// Get user details
    useEffect(() => {
        axios.get('/profile')
        .then(response => {
            setUser(response.data);
            setLoading(false);
        })
        .catch(err => {
            setError(err.toString());
            setLoading(false);
        });
    }, []);

	// Logout user
    const handleLogout = () => {
        axios.post('/logout')
        .then(() => {
            setUser(null);
            window.location.href = '/';
        })
        .catch(err => {
            setError(err.toString());
        });
    }

	// Handle loading or errors
    if (loading) return <p>Loading...</p>;
    if (error) window.location.href = '/';

    return (
        <div className="container">
            {user && (
                <div>
                    <h2 className="pb-2">{user.username}</h2>
                    <p>Email Address: {user.email}</p>
                    <button className="btn btn-primary mt-4" onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default Account;
