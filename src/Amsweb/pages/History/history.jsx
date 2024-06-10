import React, { useState, useEffect } from "react";
import "bootstrap";
// import "./HomePage.css";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { MdOutlineHome } from "react-icons/md";
import { MdOutlineNotifications } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineHistory } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { NavLink, Outlet } from "react-router-dom";
// import userIcon from "../images/user-icon.svg";
import { CiSearch } from "react-icons/ci";
// import data from "./mock-data.json";
import { TbLogout } from "react-icons/tb";
// import dateIcon from "../images/date.svg";
import { TbClockHour2 } from "react-icons/tb";
import "./history.css";

const History = () => {
  const [count, setCount] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [showHistoryApproval, setShowHistoryApproval] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const showattendancecontent = () => {
    setShowHistory(true);
    setShowHistoryApproval(false);
  };
  const HandleHistoryApproval = () => {
    setShowHistory(false);
    setShowHistoryApproval(true);
  };

  //

  useEffect(() => {
    fetch(
      "https://attsystem-latest.onrender.com/api/Attendance/AttendanceHistory"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("response data: ", data);
        setResponseData(data);
        const formattedData = data.map((x) => ({
          Name: x.staff_ID,
          staffID: x.staff_ID,
          CheckIn: x.entryTime,
          CheckOut: x.exitTime,
          date: x.date,
        }));
        console.log(formattedData);
        setContacts(formattedData);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const formatDate = (date) => {
    const month = date.toLocaleString("en-US", { Month: "long" });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  // const filteredContacts = contacts.filter((contact) =>
  // 	contact.Name.toLowerCase().includes(searchTerm.toLowerCase())
  //);
  return (
    <>
      {/* <div className="table-container-history"> */}
      <div className="switch-button">
        <div
          onClick={showattendancecontent}
          className={
            showHistory
              ? "attendance-history attendance-history-background"
              : "attendance-history"
          }
        >
          <div className="attendance-history-content">Attendance History</div>
        </div>
        <div
          className={
            showHistoryApproval
              ? "approval-history approval-history-background"
              : "approval-history"
          }
          onClick={HandleHistoryApproval}
        >
          <div className="approval-history-content">Approval History</div>
        </div>
      </div>

      <div className="content">
        {showHistory && (
          <>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                className="search-bar"
              />
              <div class="dropdown">
                <button class="dropdown-button">
                  Last Month <span class="icon">&#9662;</span>
                </button>
                <div class="dropdown-content">
                  <a href="#">Last Month</a>
                  <a href="#">Last week</a>
                  <a href="#">Last 5 days</a>
                </div>
              </div>
            </div>
          </>
        )}

        {showHistoryApproval && (
          <>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                className="search-bar"
              />
              <div class="dropdown">
                <button class="dropdown-button">
                  Last Month <span class="icon">&#9662;</span>
                </button>
                <div class="dropdown-content">
                  <a href="#">Last Month</a>
                  <a href="#">Last week</a>
                  <a href="#">Last 5 days</a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Name</th>
            <th>Staff ID</th>
            <th>Check in</th>
            <th>Check out</th>
          </tr>
        </thead>
        <tbody>
          {responseData &&
            responseData.map((res, index) => (
              <tr key={index}>
                <td>{formatDate(res.date)}</td>
                <td>{res.staff_ID}</td>
                <td>{res.staff_ID}</td>
                <td>{res.entryTime}</td>
                <td>{res.exitTime}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* </div> */}
    </>
  );
};

export default History;
