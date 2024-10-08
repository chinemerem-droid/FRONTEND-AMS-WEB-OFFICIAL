import React, { useState, useEffect } from "react";
// import "bootstrap";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { MdOutlineHome,MdOutlineNotifications,MdOutlineHistory,MdLockReset } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import userIcon from "../images/user-icon.svg";
import { CiSearch } from "react-icons/ci";
import data from "../Amsweb/data/mock-data.json";
import { TbLogout } from "react-icons/tb";
import dateIcon from "../images/date.svg";
import { TbClockHour2 } from "react-icons/tb";
import { RxPencil1 } from "react-icons/rx";
import { FiLock } from "react-icons/fi";
import "./Layout.css";
import FrameIcon from "../images/Frame.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import End from "../images/End.svg";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { RoleProvider } from "../RoleContext";
import { FaUser } from 'react-icons/fa'; 

const Layout = () => {
	const navigate = useNavigate();
	const [contacts, setContacts] = useState(data);
	const [isOpen, setOpen] = useState(true);
	const [showDropdown, setDropdown] = useState(false);
	const [showPasswordModal, setshowPasswordModal] = useState(false);
	const [password, settPassword] = useState("");
	const [newPassword, setnewPassword] = useState("false");
	const [Token, setToken] = useState("false");
	const [currentDateTime, setCurrentDateTime] = useState(new Date());
	const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
	const [staffID, setStaffID] = useState('');
	const [role, setRole] = useState(''); 
	const [shoPassword, setShoPassword] = useState(false);
	const [exitOpen, setexitOpen] = useState(false);
	const toggle = () => {
		setOpen(!isOpen);
	};
	const token = sessionStorage.getItem("token");
	const [openProfile, setOpenProfile] = useState(false);
	const menuItem = [
		{
			Path: "/home",
			name: "Home",
			Icon: <MdOutlineHome className="nav-icon" />,
		},
		{
			Path: "/notification",
			name: "Notification",
			Icon: <MdOutlineNotifications className="nav-icon" />,
		},
		{
			Path: "/managepeople",
			name: "Manage people",
			Icon: <IoSettingsOutline className="nav-icon" />,
		},
		{
			Path: "/history",
			name: "History",
			Icon: <MdOutlineHistory className="nav-icon" />,
		},
		// {
		// 	Path: "/reset",
		// 	name: "Reset Password",
		// 	Icon: <MdLockReset className="nav-icon" />,
		// },
	];
	const handlePasswordmodal = () => {
		setDropdown(false);
		setshowPasswordModal(true);
	};

	const handleExit = () => {
		setshowPasswordModal(false);
	};
	const handleLogout = () => {
		navigate("/");
		setTimeout(() => {
			sessionStorage.removeItem("token");
		}, 1500);
	};

		const roleID = sessionStorage.getItem('roleID')
		const nameID = sessionStorage.getItem('nameID')
		// setIsAdminLoggedIn(true);
		// setStaffID(staffID); 
		// setRole('Super administrator'); 
	  
	  useEffect(() => {
		// Check if roleID is set in sessionStorage on component mount
		const storedRoleID = sessionStorage.getItem('roleID');
		if (storedRoleID) {
			setIsAdminLoggedIn(true);
		  // Set staffID and role based on storedRoleID (example logic)
		  if (storedRoleID === 'A1') {
			setStaffID(staffID); // Replace with actual staff ID for super admin
			setRole('super administartor');
		  } else if (storedRoleID === 'B2') {
			setStaffID(staffID); // Replace with actual staff ID for sub admin
			setRole('sub administrator');
		  }
		}
	  }, []);
	  let iconText;
	  if (roleID === "A1") {
		iconText = "Super administrator";
	  } else {
		iconText = "Sub administrator";
	  }
	
	useEffect(() => {
		// Update the currentDateTime state every second
		const intervalId = setInterval(() => {
			setCurrentDateTime(new Date());
		}, 1000);

		// Clean up function to clear the interval when the component unmounts
		return () => clearInterval(intervalId);
	}, []); // Empty dependency array to run the effect only once on mount


	const now = new Date();
	

	// Get the parts of the date
	const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
	const day = now.getDate();
	const month = now.toLocaleDateString('en-US', { month: 'long' });
	const year = now.getFullYear();
	const currentDate = `${weekday}, ${month} ${day}, ${year}`;
	const options = { hour: 'numeric', minute: 'numeric', hour12: true };
	const currentTime = now.toLocaleTimeString('en-US', options);
	return (
		<>
			<ToastContainer />
			{token ? (
				<main className="main">
					<div className="origial">
						<header className="header">
						
							<p className="time-info">
								<img src={dateIcon} alt="" className="dateIcon" />
								{" "}
								{currentDate} 
								<TbClockHour2 className="clockIcon" />
								{currentTime}
								
							</p>

							<div
								className="user-con"
								onClick={() => setDropdown(!showDropdown)}
							>
								<div className="userinfo">
									<h4 className="firsthead">{nameID}</h4>
									<p className="firstpara">{iconText}</p>
								</div>
								<div className="usericon">
								<FaUser className="staff-id-icon" />
								</div>	
							</div>
						</header>

						<div className="containerD">
							<div className={isOpen ? "sidebar" : "sidebar-closed"}>
								<div className="top-section">
									<div className="arrow">
										{isOpen ? (
											<>
												<span className="ams">AMS ADMIN PORTAL</span>
												<IoIosArrowRoundBack
													onClick={toggle}
													className="main-arrow"
												/>
											</>
										) : (
											<>
												<IoIosArrowRoundForward
													onClick={toggle}
													className="main-arrow"
												/>
											</>
										)}
									</div>
								</div>

								{menuItem.map((item, index) => (
									<NavLink
										to={item.Path}
										key={index}
										className="link"
										activeClassName="acive"
									>
										<div className="icon">{item.Icon}</div>
										{isOpen && <div className="link_text">{item.name}</div>}
									</NavLink>
								))}
								<div className="borderline">

								</div>
								<NavLink
									to={"#"}
									className="logOutIcon2"
									onClick={handleLogout}
								>
									<div className="icon2">
										<TbLogout className="" />
									</div>
									{isOpen && <div className="link_text">Log Out</div>}
								</NavLink>
							</div>
							<div className="outlet-container">
								<Outlet />
							</div>
						</div>
						
					</div>
				</main>
			) : (
				<Navigate to="/" />
			)}
		</>
	);
};

export default Layout;
