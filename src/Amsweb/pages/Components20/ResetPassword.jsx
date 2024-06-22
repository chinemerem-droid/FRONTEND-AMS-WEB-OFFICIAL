import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://attsystem-latest.onrender.com/api/PasswordReset/request-reset', { email });

      if (response.status === 200) {
        setMessage('Email sent successfully');
        localStorage.setItem('resetEmail', email);
        navigate('/new-token');
      } else {
        setMessage('Failed to send email');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Reset Password</h2>
      <form onSubmit={handleSubmit} className="form">
        <label className="label3" htmlFor="email">
          Enter Email
        </label>
        <label className='label2' >Enter your Email To Recieve Reset Token</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="Name@example.com"
          required
        />
        <button type="submit" className="button">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
