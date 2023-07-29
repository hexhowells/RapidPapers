import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Account = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
        	<h1 className="pb-3">Account Info</h1>
            {user && (
                <div>
                    <p>Username: {user.username}</p>
                    <p>Email Address: {user.email}</p>
                </div>
            )}
        </div>
    );
};

export default Account;
