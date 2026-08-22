import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiUser, FiLock } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { DEMO_CREDENTIALS } from "../../config";
import Loader from "../../components/Loader";
import loginArt from "../../assets/images/login.svg";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!staffId || !password) {
      toast.error("Enter your Staff ID and password.");
      return;
    }
    setLoading(true);
    try {
      await login({ staffId, password });
      navigate("/home", { replace: true });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Sign-in failed. Please try again.";
      toast.error(msg === "Invalid credentials" ? "Invalid Staff ID or password." : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <div className="login">
      {/* Brand panel: the secure-login illustration, scaled and centered */}
      <aside className="login__aside">
        <div className="login__aside-inner">
          <span className="login__logo">
            AMS<span>Admin Portal</span>
          </span>
          <img src={loginArt} alt="" className="login__art" />
          <h1 className="login__headline">Every arrival, accounted for.</h1>
          <p className="login__tagline">
            Attendance operations for the Digital Innovation Lab — live presence,
            onboarding approvals, and full history in one place.
          </p>
        </div>
      </aside>

      {/* Form */}
      <main className="login__main">
        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__form-head">
            <h2>Welcome back</h2>
            <p>Sign in to the admin portal</p>
          </div>

          <label className="login__label" htmlFor="staffId">
            Staff ID
          </label>
          <div className="field">
            <FiUser className="field__icon" />
            <input
              id="staffId"
              type="text"
              placeholder="e.g. Staff001"
              value={staffId}
              autoComplete="username"
              onChange={(e) => setStaffId(e.target.value)}
            />
          </div>

          <label className="login__label" htmlFor="password">
            Password
          </label>
          <div className="field">
            <FiLock className="field__icon" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <FiEye className="field__toggle" onClick={() => setShowPassword(false)} />
            ) : (
              <FiEyeOff className="field__toggle" onClick={() => setShowPassword(true)} />
            )}
          </div>

          <button
            type="button"
            className="login__forgot"
            onClick={() => navigate("/reset")}
          >
            Forgot password?
          </button>

          <button type="submit" className="btn btn--primary btn--block login__submit" disabled={loading}>
            {loading ? (
              <>
                Signing in <Loader />
              </>
            ) : (
              "Sign in"
            )}
          </button>

          <p className="login__demo">
            Demo access — Staff ID <code>{DEMO_CREDENTIALS.staffId}</code> · password{" "}
            <code>{DEMO_CREDENTIALS.password}</code>
          </p>
        </form>
      </main>
      </div>
    </>
  );
}

export default LoginPage;
