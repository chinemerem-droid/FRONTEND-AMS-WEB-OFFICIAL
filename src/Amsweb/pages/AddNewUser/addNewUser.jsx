import React, { useState, useContext } from "react";
import "./addNewUser.css";
import { toast } from "react-toastify";
import { RoleContext } from '../../../RoleContext';
import { FaUserAlt, FaEnvelope, FaPhone, FaIdCard } from "react-icons/fa";

function AddNewUser() {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const { roleID, nameID } = useContext(RoleContext);
 
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [staffID, setStaffID] = useState("");
  const [labRole, setLabRole] = useState("C3"); // Default role
  const [password, setPassword] = useState("");
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  const handleCheckboxChange = (role) => {
    setLabRole(role);
  };

  const handleFormSubmit = () => {
    setShowPasswordPopup(true);
  };
  
  const handlePasswordConfirmation = () => {
    fetch("https://attsystem-latest.onrender.com/api/User/Confirmpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      
      body: JSON.stringify({ password, Staff_ID: nameID }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const newUser = {
            name: username,
            email: email,
            phone_number: phoneNumber,
            staff_ID: staffID,
            lab_role: labRole,
          };

          fetch("https://attsystem-latest.onrender.com/api/User/AddUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          })
            .then(response => response.json())
            .then(data => {
              if (data.message === "User added successfully") {
                notifySuccess("User added successfully");
              } else {
                notifyError("Failed to add user");
              }
              setShowPasswordPopup(false);
            })
            .catch(error => notifyError("Failed to add user"));
        } else {
          notifyError("Password confirmation failed");
        }
      })
      .catch(error => notifyError("Password confirmation failed"));
  };

  let buttonText;
  if (roleID === "A1") {
    buttonText = "Add New User";
  } else {
    buttonText = "Request Approval For New User";
  }

  return (
    <div className="table-container-2">
      <div>
        <div className="header-text">
          <h1>{buttonText}</h1>
          <h2>Please fill out the form with the users' details</h2>
        </div>
      </div>
      <div className="text-form-field-container">
        <div className="row-3">
          <div className="inputs">
            <div className="image-div">
              <FaUserAlt className="input-icon" />
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
              <FaEnvelope className="input-icon" />
            </div>
            <div className="input-div">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="inputs">
          <div className="image-div">
            <FaPhone className="input-icon" />
          </div>
          <div className="input-div">
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="inputs">
          <div className="image-div">
            <FaIdCard className="input-icon" />
          </div>
          <div className="input-div">
            <input
              type="text"
              placeholder="Staff ID"
              value={staffID}
              onChange={(e) => setStaffID(e.target.value)}
            />
          </div>
        </div>
        <div className="check-box-container">
          <label className="check-box-label-1">
            <input type="checkbox" checked={labRole === "B2"} onChange={() => handleCheckboxChange("B2")} />
            Sub Administrator
          </label>

          <label className="check-box-label-1">
            <input type="checkbox" checked={labRole === "A1"} onChange={() => handleCheckboxChange("A1")} />
            Super Administrator
          </label>
        </div>
        <button className="add-user-btn" onClick={handleFormSubmit}>
          {buttonText}
        </button>
      </div>

      {showPasswordPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Confirm Password</h2>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handlePasswordConfirmation} className="butt1">Confirm</button>
            <button onClick={() => setShowPasswordPopup(false)} className="butt2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddNewUser;
