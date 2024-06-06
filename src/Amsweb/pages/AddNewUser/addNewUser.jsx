import React from "react";
import "./addNewUser.css";
import { toast } from "react-toastify";

function AddNewUser() {
  const notify = () => toast("New User Added");

  return (
    <div className="table-container-2">
      <div>
        <div className="header-text">
          <h1>Add new user</h1>
          <h2>please fill out the form with the users' details</h2>
        </div>
      </div>
      <div className="text-form-field-container">
        <div className="row-3">
          <div className="inputs">
            <div className="image-div">
              <img src="" alt="" className="iconforlogin" />
            </div>
            <div className="input-div">
              <input
                type="text"
                placeholder="Username"
                // value={username} onChange={(e)=>setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="inputs">
            <div className="image-div">
              <img src="" alt="" className="iconforlogin" />
            </div>
            <div className="input-div">
              <input
                type="text"
                placeholder="Username"
                // value={username} onChange={(e)=>setUsername(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="inputs">
          <div className="image-div">
            <img src="" alt="" className="iconforlogin" />
          </div>
          <div className="input-div">
            <input
              type="text"
              placeholder="Username"
              // value={username} onChange={(e)=>setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="inputs">
          <div className="image-div">
            <img src="" alt="" className="iconforlogin" />
          </div>
          <div className="input-div">
            <input
              type="text"
              placeholder="Username"
              // value={username} onChange={(e)=>setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="check-box-container">
          <label className="check-box-label-1">
            <input type="checkbox" />
            Sub Administrator
          </label>

          <label className="check-box-label-1">
            <input type="checkbox" />
            Super Administrator{''}
          </label>
        </div>
        <button className="add-user-btn" onClick={notify}>
          <h1>Request Approval</h1>
        </button>
      </div>
    </div>
  );
}

export default AddNewUser;
