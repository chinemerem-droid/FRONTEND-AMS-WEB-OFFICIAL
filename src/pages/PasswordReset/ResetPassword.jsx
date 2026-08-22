import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import client, { isUnreachable } from "../../api/client";
import "./reset.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await client.post("/api/PasswordReset/request-reset", { email });
      localStorage.setItem("resetEmail", email);
      navigate("/new-token");
    } catch (error) {
      if (isUnreachable(error)) {
        // Demo mode: backend offline, let the flow continue.
        localStorage.setItem("resetEmail", email);
        navigate("/new-token");
        return;
      }
      setMessage("We couldn't send a reset email. Check the address and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset">
      <div className="reset__card">
        <span className="reset__logo">AMS</span>
        <h1 className="reset__title">Reset password</h1>
        <p className="reset__lead">Enter your email and we'll send you a reset token.</p>

        <form className="reset__form" onSubmit={handleSubmit}>
          <label className="reset__label" htmlFor="email">
            Email address
          </label>
          <div className="field">
            <FiMail className="field__icon" />
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn--primary btn--block reset__submit" disabled={loading}>
            {loading ? "Sending…" : "Send reset token"}
          </button>
        </form>

        {message && <p className="reset__msg">{message}</p>}
        <button className="reset__back" onClick={() => navigate("/")}>
          Back to sign in
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
