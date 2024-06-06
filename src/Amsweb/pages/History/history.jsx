import React, { useState } from "react";
import "bootstrap";
// import "./HomePage.css";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { MdOutlineHome } from "react-icons/md";
import { MdOutlineNotifications } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineHistory } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { NavLink, Outlet } from "react-router-dom";
import userIcon from "../images/user-icon.svg";
import { CiSearch } from "react-icons/ci";
import data from "./mock-data.json";
import { TbLogout } from "react-icons/tb";
import dateIcon from "../images/date.svg";
import { TbClockHour2 } from "react-icons/tb";
import "./History.css";

const History = () => {

	const [count, setCount] = useState(false);

	const showattendancecontent = () => {
	setCount(true)
	}

	console.log()
  return (
    <>
      <div className="switch-button">
        <div onClick={showattendancecontent} className="attendance-history">
          <div className="attendance-history-content">Attendance History</div>
        </div>
        <div className="approval-history">
          <div className="approval-history-content">Approval History</div>
        </div>
      </div>

		<div className="contenet1">

			{showattendancecontent}
			
		</div>
	  
	  
	 
    </>
  );
};

export default History;
