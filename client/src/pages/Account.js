import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Account.css'; // Import the CSS file for styling

const Account = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');

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

	const handleLogout = () => {
		axios.post('/logout')
		.then(() => {
			setUser(null);
			window.location.href = '/';
		})
		.catch(err => {
			setError(err.toString());
		});
	};

	const handleChangePassword = (e) => {
		e.preventDefault();
		// Add logic to change password here
	};

	const handleDeleteAccount = () => {
		if(window.confirm('Are you sure you want to delete your account?')) {
			axios.delete('/delete-account')
			.then(() => {
				setUser(null);
				window.location.href = '/';
			})
			.catch(err => {
				setError(err.toString());
			});
		}
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	return (
			<div className="account-container">
			{user && (
					<div>
					<div className="account-details">
					<h2 className="account-heading">{user.username}</h2>
					<p>Email Address: {user.email}</p>
					<button className="btn btn-primary mt-4" onClick={handleLogout}>Logout</button>
					</div>

					<div className="change-password">
					<h5 className="pb-2">Change Password</h5>
					<form onSubmit={handleChangePassword}>
					<div className="form-group">
					<label htmlFor="oldPassword">Old Password</label>
					<input type="password" className="form-control" id="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
					</div>
					<div className="form-group">
					<label htmlFor="newPassword">New Password</label>
					<input type="password" className="form-control" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
					</div>
					<button type="submit" className="btn btn-secondary mt-2">Change Password</button>
					</form>
					</div>

					<div className="delete-account">
						<button className="btn btn-danger mt-4" onClick={handleDeleteAccount}>Delete Account</button>
					</div>
					</div>
					)}
	</div>
		);
};

export default Account;

