import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Account.css'; // Import the CSS file for styling

const Account = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [pageError, setPageError] = useState(null);
	const [passwordLengthError, setPasswordLengthError] = useState(null);
	const [passwordMismatchError, setPasswordMismatchError] = useState(null);

	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');

	useEffect(() => {
		axios.get('/api/v1/profile')
		.then(response => {
			setUser(response.data);
			setLoading(false);
		})
		.catch(err => {
			setPageError(err.toString());
			setLoading(false);
		});
	}, []);

	const handleLogout = () => {
		axios.post('/api/v1/logout')
		.then(() => {
			setUser(null);
			window.location.href = '/';
		})
		.catch(err => {
			setPageError(err.toString());
		});
	};

	const isValid = () => {
		if (newPassword.length < 12) {
			setPasswordLengthError('New password must be at least 12 characters');
			return false;
		}

		if (newPassword !== confirmNewPassword) {
			setPasswordMismatchError('Passwords do not match');
			return false;
		}

		setPasswordLengthError('');
		setPasswordMismatchError('');
		return true;
	};

	const handlePasswordChange = (e) => {
		const newPass = e.target.value;
		setNewPassword(newPass);
		if (newPass.length < 12) {
			setPasswordLengthError('New password must be at least 12 characters');
		} else {
			setPasswordLengthError('');
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		
		const oldPassword = e.target.oldPassword.value;
		const newPassword = e.target.newPassword.value;
		const confirmNewPassword = e.target.confirmNewPassword.value;

		if (newPassword !== confirmNewPassword) {
			alert("New password and confirm new password do not match")
			return;
		}

		const data = {
			user: user,
			old_password: oldPassword,
			new_password: newPassword,
			confirm_new_password: confirmNewPassword
		}
		
		axios.post('/api/v1/updatepassword', data)
		.then(() => {
			;
		})
		.catch(err => {
			setPageError(err.toString());
		});
	};


	const handleDeleteAccount = () => {
		if(window.confirm('Are you sure you want to delete your account?')) {
			axios.delete('/api/v1/delete-account')
			.then(() => {
				setUser(null);
				window.location.href = '/';
			})
			.catch(err => {
				setPageError(err.toString());
			});
		}
	};

	if (loading) return <p>Loading...</p>;
	if (pageError) return <p>Error: {pageError}</p>;

	return (
		<div className="account-container">
		{user && (
				<div>
					<div className="account-details">
						<h3 className="account-heading">Account Details</h3>
						<p>Username: {user.username}</p>
						<p>Account created: {user.date_created.match(/\d{2} \w{3} \d{4}/)[0]}</p>
						<button className="btn btn-primary mt-4" onClick={handleLogout}>Logout</button>
						
						<h3 className="pt-5 pb-2">Change Password</h3>
						<form onSubmit={handleSubmit}>
						<div className="form-group">
							<label htmlFor="oldPassword">Old Password</label>
							<input 
								type="password" 
								className="form-control" 
								id="oldPassword" 
								value={oldPassword} 
								onChange={
									(e) => setOldPassword(e.target.value)
								}
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="newPassword">New Password</label>
							<input 
								type="password" 
								className="form-control" 
								id="newPassword" 
								value={newPassword} 
								onChange={handlePasswordChange}
								required
							/>
							{passwordLengthError && <div style={{color:'red'}}>{passwordLengthError}</div>}
						</div>
						<div className="form-group">
							<label htmlFor="confirmNewPassword">Confirm New Password</label>
							<input 
								type="password" 
								className="form-control" 
								id="confirmNewPassword" 
								value={confirmNewPassword} 
								onChange={
									(e) => setConfirmNewPassword(e.target.value)
								}
								onBlur={() => isValid()}
								required
							/>
							{passwordMismatchError && <div style={{color:'red'}}>{passwordMismatchError}</div>}
						</div>
						<button type="submit" className="btn btn-secondary mt-2">Change Password</button>
						</form>
					
						<h3 className="mt-5 mb-3">Delete Account</h3>
						<p>Warning! Once your account is deleted it will not be recovered!</p>
						<button className="btn btn-danger mt-2" onClick={handleDeleteAccount}>Delete Account</button>
					</div>
				</div>
				)}
		</div>
	);
};

export default Account;

