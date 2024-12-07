import React, { useState } from 'react';
import './Login.css';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') setUsername(value);
        else if (name === 'password') setPassword(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare the request body
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: username,
                password: password,
            }),
        };

        // Send the login request
        fetch('/api/v1/login', requestOptions)
            .then((response) => {
                if (response.status === 200) {
                    window.location.href = response.url;
                } else {
                    setLoginError(true);
                    console.log('Login failed');
                }
            })
            .catch((error) => {
                console.error('Login error:', error);
            });
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ 'margin-top': 'auto' }}>
            <div className="card p-4" style={{ width: '400px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="username">Username</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="username" 
                                name="username" 
                                value={username} 
                                onChange={handleInputChange} 
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="password" 
                                name="password" 
                                value={password} 
                                onChange={handleInputChange} 
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>

					{loginError &&
						<p className="pt-2 text-danger">Username or password is incorrect</p>
					}

                    <p className="mt-3 text-center">
                        New user? <a href="/signup">Create an account</a>
                    </p>
                </div>
            </div>
        </div>
    );

};

export default LoginScreen;
