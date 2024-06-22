import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './newpassword.css'; 

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match. Please try again.');
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('resetToken');
    if (!token) {
      setMessage('Token not found. Please go back and enter the token.');
      setIsLoading(false);
      return;
    }
    const email = localStorage.getItem('resetEmail');
    if (!email) {
      setMessage('Email not found. Please go back and enter the email.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://attsystem-latest.onrender.com/api/PasswordReset/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token, NewPassword: newPassword }),
      });

      if (!response.ok) {
        throw new Error(`Error resetting password: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessage('Password reset successfully.');
        localStorage.removeItem('resetToken');
      } else {
        setMessage(data.message || 'Failed to reset password.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
      console.error('Error resetting password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (event) => {
    const { target: { value } } = event;
    setNewPassword(value);
    setMessage('');
  };

  const handleConfirmPasswordChange = (event) => {
    const { target: { value } } = event;
    setConfirmPassword(value);
    setMessage('');
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="container">
      <h2 className="title">Reset Password</h2>
      <form onSubmit={handleSubmit} className="form">
        <label className="label" htmlFor="newPassword">
          Enter Your New Password
        </label>
        <div className="password-input-container">
          <input
            type={showNewPassword ? 'text' : 'password'}
            id="newPassword"
            value={newPassword}
            onChange={handlePasswordChange}
            className={`input ${newPassword !== confirmPassword && 'error'}`}
            placeholder="New Password"
            required
            disabled={isLoading}
          />
          <i
            className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password-icon`}
            onClick={toggleShowNewPassword}
          ></i>
        </div>
        <div className="password-input-container">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={`input ${newPassword !== confirmPassword && 'error'}`}
            placeholder="Re-enter New Password"
            required
            disabled={isLoading}
          />
          <i
            className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password-icon`}
            onClick={toggleShowConfirmPassword}
          ></i>
        </div>
        <button type="submit" className="button" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Submit'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default NewPassword;
