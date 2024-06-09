import React, { useState, useContext } from "react";
import "./addNewUser.css";
import { toast } from "react-toastify";
import { RoleContext } from '../../../RoleContext';
import { FaUserAlt, FaEnvelope, FaPhone, FaIdCard } from "react-icons/fa";

function AddNewUser() {
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const { roleID } = useContext(RoleContext);

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
    const newUser = {
      name: username,
      email: email,
      phone_number: phoneNumber, // Add phone number to the data
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
      setShowPasswordPopup(true);
    })
    .catch(error => notifyError("Failed to add user"));
  };

  const handlePasswordConfirmation = () => {
    fetch("https://attsystem-latest.onrender.com/api/User/Confirmpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        if (roleID === "A1") {
          fetch("https://attsystem-latest.onrender.com/api/User/approve", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ staff_ID: staffID }),
          })
          .then(response => response.json())
          .then(data => {
            notifySuccess("User added successfully");
            setShowPasswordPopup(false);
          })
          .catch(error => notifyError("Failed to approve user"));
        } else if (roleID === "B2") {
          fetch("https://attsystem-latest.onrender.com/api/User/Notification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ staff_ID: staffID }),
          })
          .then(response => response.json())
          .then(data => {
            notifySuccess("User request sent successfully");
            setShowPasswordPopup(false);
          })
          .catch(error => notifyError("Failed to send notification"));
        }
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
          <h2>please fill out the form with the users' details</h2>
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
            <button onClick={handlePasswordConfirmation}>Confirm</button>
            <button onClick={() => setShowPasswordPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddNewUser;
