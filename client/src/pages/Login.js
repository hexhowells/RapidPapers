import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

class LoginScreen extends React.Component {
    state = {
        email: '',
        password: '',
		loginError: false
    };

    handleButtonClick = (provider) => {
        axios.get(`/api/v1/authorise/${provider}`)
            .then(response => {
                window.location.href = response.data.redirect_url;
            })
            .catch(error => {
                console.log(error);
            });
    };

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = (e) => {
		e.preventDefault();
		// Extract email and password from the state
		const { email, password } = this.state;

		// Setup the request options and body
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				user: email,
				password: password
			})
		};

		// Send the login request to the server
		fetch('/api/v1/login', requestOptions)
			.then(response => {
				if (response.status === 200) {
					window.location.href = response.url;
				} else {
					this.setState(prevState => ({...prevState, loginError: true}));
					console.log(this.state);
				}
			})
			.catch(error => {
				console.error('Login error:', error);
			});
	};

    render() {
		const { usr, pwd, loginError } = this.state;
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ 'margin-top': 'auto' }}>
                <div className="card p-4" style={{ width: '400px' }}>
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">Login</h2>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="email">Email/Username</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="email" 
                                    name="email" 
                                    value={this.state.email} 
                                    onChange={this.handleInputChange} 
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
                                    value={this.state.password} 
                                    onChange={this.handleInputChange} 
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
    }
}

export default LoginScreen;
