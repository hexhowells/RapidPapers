import React from 'react';
import axios from 'axios';
import './Login.css';

class LoginScreen extends React.Component {
    state = {
        email: '',
        password: ''
    };

    handleButtonClick = (provider) => {
        axios.get(`/authorise/${provider}`)
            .then(response => {
                // handle successful response
                // redirect user to new URL
                window.location.href = response.data.redirect_url;
            })
            .catch(error => {
                // handle error
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
        // Handle login logic here
        console.log('Email:', this.state.email, 'Password:', this.state.password);
    };

    render() {
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
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
                        <p className="mt-3 text-center">
                            New user? <a href="/signup">Create an account</a>
                        </p>
                    </div>
                    <p className="text-center">Or</p>
                    <button className="btn m-2 google-signin" onClick={() => this.handleButtonClick('google')}>
                        Sign in with Google
                    </button>
                </div>
            </div>
        );
    }
}

export default LoginScreen;
