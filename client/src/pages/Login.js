import React from 'react';
import axios from 'axios';
import './Login.css';

class LoginScreen extends React.Component {
    state = {
        username: '',
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
		// Extract username and password from the state
		const { username, password } = this.state;

		// Setup the request options and body
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				user: username,
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
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ 'margin-top': 'auto' }}>
                <div className="card p-4" style={{ width: '400px' }}>
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">Login</h2>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="username">Username</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="username" 
                                    name="username" 
                                    value={this.state.username} 
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

						{this.state.loginError &&
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
