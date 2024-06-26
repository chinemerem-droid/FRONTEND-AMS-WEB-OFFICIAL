import React, { useState } from "react";
import "./addNewUser.css";
import { toast, ToastContainer, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaUserAlt, FaEnvelope, FaPhone, FaIdCard } from "react-icons/fa";

function AddNewUser() {

  const notifySuccess = () => toast("Success");

  const notifyError = () => console.log("error");


  const handleEvent = () => {
    window.location.reload();
  };

  const roleID = sessionStorage.getItem('roleID');
  const nameID = sessionStorage.getItem('nameID');
 
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
      .then(response => response.text())
      .then(text => {
        if (text === "Password confirmed successfully.") {
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
            .then(response => response.text().then(text => ({ status: response.status, text })))
            .then(({ status, text }) => {
              if (status === 200) {
                notifySuccess("User added successfully");

                if (roleID === "A1") {
                  fetch("https://attsystem-latest.onrender.com/api/User/Approve", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ Staff_ID: newUser.staff_ID }),
                  })
                  .then((resp)=> console.log(resp.text()))
                    // .then(response => response.text().then(text => ({ status: response.status, text })))
                    // .then(({ status, text }) => {
                    //   if (status === 200) {
                    //     notifySuccess("User approved successfully");
                    //   } else {
                    //     notifyError("Failed to approve user: " + text);
                    //   }
                    // })
                    // .catch(error => {
                    //   notifyError("Failed to approve user: " + error.message);
                    // });
                } else if (roleID === "B2") {
                  notifySuccess("Request sent");
                }
              } else {
                notifyError("Failed to add user: " + text);
              }
              setShowPasswordPopup(false);
            })
            .catch(error => {
              notifyError("Failed to add user: " + error.message);
              setShowPasswordPopup(false);
            });
        } else {
          notifyError("Password confirmation failed: " + text);
        }
      })
      .catch(error => {
        notifyError("Password confirmation failed: " + error.message);
        setShowPasswordPopup(false);
      });
  };

  let buttonText;
  if (roleID === "A1") {
    buttonText = "Add New User";
  } else {
    buttonText = "Request Approval For New User";
  }

  return (
    <div className="table-container-2">
      <ToastContainer transition={Slide} />
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
