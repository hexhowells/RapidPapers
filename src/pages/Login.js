import React from 'react';
import axios from 'axios';

class LoginScreen extends React.Component {
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

    render() {
        return (
            <div className="container">
                <button className="btn btn-primary m-2" onClick={() => this.handleButtonClick('google')}>
                    Sign in with Google
                </button>
                <button className="btn btn-dark m-2" onClick={() => this.handleButtonClick('github')}>
                    Sign in with GitHub
                </button>
            </div>
        );
    }
}

export default LoginScreen;
