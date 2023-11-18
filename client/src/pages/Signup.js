import React from 'react';

class SignupScreen extends React.Component {
    state = {
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        passwordMismatch: false,
        passwordShort: false
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;

        this.setState({ [name]: value }, () => {
            if ((name === 'password' || name === 'confirmPassword')) {
                const passwordMismatch = this.state.password !== this.state.confirmPassword;
                this.setState({ passwordMismatch });
            }
        });
    };

    handlePasswordBlur = () => {
        const passwordShort = this.state.password.length < 8;
        this.setState({ passwordShort });
    };


    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.passwordMismatch || this.state.passwordShort) {
            return; // Stop the submission if there's a mismatch or the password is too short
        }

        // Setup the request options and body
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: this.state.email,
                username: this.state.username,
                password: this.state.password
            })
        };

        // Send the request to the create_account route
        fetch('/create_account', requestOptions)
            .then(response => {
                window.location.href = response.url;
            })
            .catch(error => {
                console.error('Signup failed:', error);
            });
    };

    render() {
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="card p-4" style={{ width: '400px' }}>
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">Sign Up</h2>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    id="email" 
                                    name="email" 
                                    value={this.state.email} 
                                    onChange={this.handleInputChange} 
                                    required
                                />
                            </div>
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
                                    className={`form-control ${this.state.passwordShort ? 'is-invalid' : ''}`} 
                                    id="password" 
                                    name="password" 
                                    value={this.state.password} 
                                    onChange={this.handleInputChange} 
                                    onBlur={this.handlePasswordBlur}
                                    required
                                />
                                {this.state.passwordShort && <div className="invalid-feedback">Password must be at least 12 characters long.</div>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input 
                                    type="password" 
                                    className={`form-control ${this.state.passwordMismatch ? 'is-invalid' : ''}`} 
                                    id="confirmPassword" 
                                    name="confirmPassword" 
                                    value={this.state.confirmPassword} 
                                    onChange={this.handleInputChange} 
                                    required
                                />
                                {this.state.passwordMismatch && <div className="invalid-feedback">Passwords do not match.</div>}
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                        </form>
                        <p className="mt-3 text-center">
                            Already have an account? <a href="/login">Login here</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignupScreen;
