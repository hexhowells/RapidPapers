import React, { useState } from 'react';
import axios from 'axios';

function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/token', {
                username: username,
                password: password,
            });

            if (response.status === 200) {
                // Handle successful login here.
                console.log('Login successful');
            } else {
                // Handle error here.
                console.log('Login failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container pt-4">
            <div className="row justify-content-left">
                <div className="col-12 col-md-6">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-4">
                            <label htmlFor="username">Username</label>
                            <input 
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group mb-4">
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">Log In</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginScreen;
