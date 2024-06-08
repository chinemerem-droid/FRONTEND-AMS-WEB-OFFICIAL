import React, { useState, useContext } from 'react';
import "./LoginPage.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import  {jwtDecode}  from "jwt-decode"; 
import axios from 'axios';
import { LoginIcon, ContentIcon, FrameIcon } from '../../components/SvgIcons';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '../../../RoleContext'; // Correct import path

function LoginPage() {
  const navigate = useNavigate();
  const { setRoleID } = useContext(RoleContext); // Use context
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  const submitCredentials = async () => {
    try {
      const response = await axios.post('https://attsystem-latest.onrender.com/api/User/loginAdmin', {
        Staff_ID: username,
        Password: password
      });
      setMessage(response.data.message);
      const token = response.data.token;
      setToken(token);
      const decodedToken = jwtDecode(token);
      const roleID = decodedToken.LabRole;
      console.log('Decoded Token:', decodedToken);
      console.log('Role_ID:', roleID);
      setRoleID(roleID); 
      toast.success(`Role_ID: ${roleID}`);
      navigate('/home');
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container">
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
                type={showPassword ? 'tel' : 'password'}
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

          <div className="button-con">
            <button onClick={submitCredentials}>Login</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
