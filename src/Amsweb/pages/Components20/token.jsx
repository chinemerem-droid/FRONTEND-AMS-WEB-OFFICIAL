import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AcceptToken = () => {
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store token in local storage or state management (e.g., Redux, Context)
    localStorage.setItem('resetToken', token);
    // Navigate to the next page
    navigate('/new-password');
  };

  return (
    <div className="container">
      <h2 className="title">Reset Password</h2>
      <form onSubmit={handleSubmit} className="form">
        <label className="label3" htmlFor="token">Enter Token</label>
        <label className='label2'>Enter the token you received</label>
        <input
          type="text"
          id="token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="input"
          placeholder="Token"
          required
        />
        <button type="submit" className="button">Submit</button>
      </form>
    </div>
  );
};

export default AcceptToken;
