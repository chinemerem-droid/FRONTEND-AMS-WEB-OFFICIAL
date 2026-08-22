import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import client, { isUnreachable } from "../../api/client";
import "./reset.css";

const NewPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }
    const token = localStorage.getItem("resetToken");
    const email = localStorage.getItem("resetEmail");
    if (!token || !email) {
      setMessage("Your reset session expired. Please start again.");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await client.post("/api/PasswordReset/reset", {
        email,
        token,
        NewPassword: newPassword,
      });
      if (data?.success === false) {
        setMessage(data.message || "Failed to reset password.");
        return;
      }
      finish();
    } catch (error) {
      if (isUnreachable(error)) {
        finish(); // demo mode
        return;
      }
      setMessage("Invalid email or token.");
    } finally {
      setIsLoading(false);
    }
  };

  const finish = () => {
    localStorage.removeItem("resetToken");
    localStorage.removeItem("resetEmail");
    setMessage("Password reset successfully. Redirecting to sign in…");
    setTimeout(() => navigate("/"), 1200);
  };

  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <div className="reset">
      <div className="reset__card">
        <span className="reset__logo">AMS</span>
        <h1 className="reset__title">Set a new password</h1>
        <p className="reset__lead">Choose a strong password you haven't used before.</p>

        <form className="reset__form" onSubmit={handleSubmit}>
          <label className="reset__label">New password</label>
          <div className="field">
            <FiLock className="field__icon" />
            <input
              type={show ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            {show ? (
              <FiEye className="field__toggle" onClick={() => setShow(false)} />
            ) : (
              <FiEyeOff className="field__toggle" onClick={() => setShow(true)} />
            )}
          </div>

          <label className="reset__label">Confirm password</label>
          <div className="field" style={mismatch ? { borderColor: "var(--danger)" } : undefined}>
            <FiLock className="field__icon" />
            <input
              type={show ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="btn btn--primary btn--block reset__submit" disabled={isLoading}>
            {isLoading ? "Resetting…" : "Reset password"}
          </button>
        </form>

        {message && <p className="reset__msg">{message}</p>}
      </div>
    </div>
  );
};

export default NewPassword;
