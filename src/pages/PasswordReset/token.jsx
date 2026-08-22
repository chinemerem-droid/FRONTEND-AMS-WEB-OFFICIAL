import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiKey } from "react-icons/fi";
import "./reset.css";

const AcceptToken = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("resetToken", token);
    navigate("/new-password");
  };

  return (
    <div className="reset">
      <div className="reset__card">
        <span className="reset__logo">AMS</span>
        <h1 className="reset__title">Enter your token</h1>
        <p className="reset__lead">
          We sent a token{email ? ` to ${email}` : ""}. Paste it below to continue.
        </p>

        <form className="reset__form" onSubmit={handleSubmit}>
          <label className="reset__label" htmlFor="token">
            Reset token
          </label>
          <div className="field">
            <FiKey className="field__icon" />
            <input
              id="token"
              type="text"
              placeholder="Paste your token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn--primary btn--block reset__submit">
            Continue
          </button>
        </form>

        <button className="reset__back" onClick={() => navigate("/reset")}>
          Use a different email
        </button>
      </div>
    </div>
  );
};

export default AcceptToken;
