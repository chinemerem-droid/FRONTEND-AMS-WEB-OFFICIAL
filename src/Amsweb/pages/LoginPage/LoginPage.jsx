import React, { useState, useContext } from "react";
import "./LoginPage.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  LoginIcon,
  ContentIcon,
  userIcon,
  FrameIcon,
} from "../../components/SvgIcons";
import { useNavigate,Navigate } from "react-router-dom";
import * as imports from "../../components/SvgIcons";
import Loader from "../../components/Loader";
import { RoleContext } from "../../../RoleContext";

function LoginPage() {
  const navigate = useNavigate();
  const { setRoleID, setNameID } = useContext(RoleContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  // const handleForgotPassword = () => {
  //   navigate('/reset');
  // };

  const submitCredentials = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://attsystem-latest.onrender.com/api/User/loginAdmin",
        {
          Staff_ID: username,
          Password: password,
        }
      );
      setLoading(false);
      setMessage(response.data.message);
      const token = response.data.token;
      setToken(token);
      sessionStorage.setItem("token", token);

      const decodedToken = jwtDecode(token);
      const roleID = decodedToken.LabRole;
      const nameID = decodedToken.nameid;

      console.log("Decoded Token:", decodedToken);
      console.log("Role_ID:", roleID);

      sessionStorage.setItem("roleID", roleID);
      sessionStorage.setItem("nameID", nameID);

      console.log(`Staff_ID: ${nameID}`);
      navigate("/home");
    } catch (error) {
      setLoading(false);
      console.error("Error during login:", error);
      if (error.response && error.response.data) {
        toast.error(
          error.response.data.message || "Invalid credentials, Please try again "
        );
      } else {
        toast.error("An error occurred during login. Please try again.");
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container78">
        <div className="container2">
          <img src={LoginIcon} alt="" />
        </div>
        <div className="container1">
          <h1>Welcome</h1>
          <p>AMS Administrator portal</p>
          <div className="inputs">
            <div className="image-div">
              <img src={ContentIcon} alt="" className="iconforlogin" />
            </div>
            <div className="input-div">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="inputs">
            <div className="image-div">
              <img src={FrameIcon} alt="" className="iconforlogin" />
            </div>
            <div className="input-div">
              <input
                type={showPassword ? "tel" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPassword ? (
                <FaEye
                  className="hiddenPassword"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <FaEyeSlash
                  className="hiddenPassword"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
          </div>
          {loading ? (
            <div className="button-con2">
              <button disabled>
                Login <Loader />
              </button>
            </div>
          ) : (
            <div className="button-con">
              <button onClick={submitCredentials}>Login</button>
            </div>
          )}
          <div className="forgot-password">
            <a href="https://passwordreset-3ghz.onrender.com/" >
          Forgot Password?
        </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
