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
import dayjs from "dayjs";
import { FaTrash } from "react-icons/fa";
import "./history.css";

const History = () => {
  const [count, setCount] = useState(false);
  const [search, setSearch] = useState("");
  const [showHistory, setShowHistory] = useState(true);
  const [showHistoryApproval, setShowHistoryApproval] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [day, setDay] = useState("");

  const showattendancecontent = () => {
    setShowHistory(true);
    setShowHistoryApproval(false);
  };
  const HandleHistoryApproval = () => {
    setShowHistory(false);
    setShowHistoryApproval(true);
  };

  //
  console.log(dayjs().format("DD MMM"));

  const filteredDates = (date) => {
    const today = dayjs();
    const lastMonth = today.subtract(1, "month");
    const lastWeek = today.subtract(7, "day");
    const last5Days = today.subtract(5, "day");

    if (day === "Last Month") {
      return date.filter((d) => dayjs(d) >= lastMonth && dayjs(d) < today);
    } else if (day === "Last Week") {
      return date.filter((d) => dayjs(d) >= lastWeek && dayjs(d) < today);
    } else if (day === "Last 5Days") {
      return date.filter((d) => dayjs(d) >= last5Days && dayjs(d) < today);
    } else {
      return date;
    }
  };

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
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "Decemeber",
    ];
    const extractedMonth = String(date).substring(5, 7);
    const monthVal = Number(extractedMonth);
    const month = months[monthVal - 1];
    const day = String(date).substring(8, 10);
    return `${month} ${day}`;
  };

  const filterbyDate =
    responseData &&
    responseData.filter((res) =>
      formatDate(res.date).toLowerCase().includes(search.toLowerCase())
    );

  const finalflowtrain = filteredDates(
    filterbyDate && filterbyDate.filter((d) => dayjs(d.date) === dayjs())
  );

  console.log(finalflowtrain);
  //   console.log(dayjs(d.date));
  console.log(dayjs("2024-05-20T00:00:00"));
  //   console.log(filterbyDate);
  // const filteredContacts = contacts.filter((contact) =>
  // 	contact.Name.toLowerCase().includes(searchTerm.toLowerCase())
  //);

  const NotificationBar = ({ text, onDelete }) => {
    return (
      <div className="notification-bar">
        <span>{text}</span>
        <FaTrash className="delete-icon" onClick={onDelete} />
      </div>
    );
  };

  const App = () => {
    const handleDelete = (message) => {
      alert(`Delete icon clicked for: ${message}`);
    };
  };

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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div class="dropdown">
                <button class="dropdown-button">
                  Last Month <span class="icon">&#9662;</span>
                </button>
                <div class="dropdown-content">
                  <a href="#" onClick={() => setDay("Last Month")}>
                    Last Month
                  </a>
                  <a href="#" onClick={() => setDay("Last Week")}>
                    Last week
                  </a>
                  <a href="#" onClick={() => setDay("Last 5Days")}>
                    Last 5 days
                  </a>
                </div>
              </div>
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
                {filterbyDate &&
                  filterbyDate.map((res, index) => (
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
          </>
        )}

        {showHistoryApproval && (
          <>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                className="search-bar"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
            <div className="notification-list">
              <NotificationBar
                text="You approved onboarding request of a new user John Doe"
                onDelete={() =>
                  handleDelete(
                    "You approved onboarding request of a new user John Doe"
                  )
                }
              />
              <NotificationBar
                text="You denied onboarding request of a new user John Doe"
                onDelete={() =>
                  handleDelete(
                    "You denied onboarding request of a new user John Doe"
                  )
                }
              />
            </div>
          </>
        )}
      </div>

      {/* </div> */}
    </>
  );
};

export default History;
