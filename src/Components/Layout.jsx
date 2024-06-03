import React, { useState } from "react";
// import "bootstrap";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { MdOutlineHome } from "react-icons/md";
import { MdOutlineNotifications } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineHistory } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { NavLink, Outlet } from "react-router-dom";
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

const Layout = () => {
	const [contacts, setContacts] = useState(data);
	const [isOpen, setOpen] = useState(false);
	const [showDropdown, setDropdown] = useState(false);
	const [showPassword, setshowPassword] = useState(false);
	const [password, settPassword] = useState("");
	const [shoPassword, setShoPassword] = useState(false);
	const [exitOpen, setexitOpen] = useState(false);
	const toggle = () => {
		setOpen(!isOpen);
	};
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
	];
	const handlePasswordmodal = () => {
		setDropdown(false);
		setshowPassword(true);
	};

	const handleExit = () => {
		setshowPassword(false);
	};
	return (
		<>
			<main className="main">
				<div className="origial">
					<header className="header">
						<p>
							<img src={dateIcon} alt="" className="dateIcon" /> Monday,May
							13,2024 <TbClockHour2 className="clockIcon" />
							08:34am
						</p>

						<div
							className="user-con"
							onClick={() => setDropdown(!showDropdown)}
						>
							<div className="userinfo">
								<h4 className="firsthead">John Doe</h4>
								<p className="firstpara">Administrator</p>
							</div>
							<div className="usericon">
								<img src={userIcon} alt="" />
							</div>
						</div>
						{showDropdown && (
							<div className="userDropdown">
								<div className="box">
									<img
										src={userIcon}
										alt=""
										style={{ position: "relative", width: "50px" }}
									/>{" "}
									<RxPencil1
										style={{
											position: "absolute",
											top: "50px",
											right: "8rem",
											width: "20px",
											height: "20px",
											background: "#345782",
											color: "white",
											border: "1px solid white",
											borderRadius: "50px",
											padding: "3px",
										}}
									/>
									<h4 style={{ paddingTop: "15px" }}>John Doe</h4>
									<p className="center para">Super Administration</p>
									<p
										className="center"
										style={{ color: "#345782", cursor: "pointer" }}
										onClick={handlePasswordmodal}
									>
										<FiLock /> Passwords
									</p>
								</div>
							</div>
						)}
						{showPassword && (
							<div className="darkBG">
								<div className="centered">
									<div className="modal">
										<div className="top">
											<h4>Reset password</h4>
											<button onClick={handleExit} className="Exit">
												<img src={End} alt="" />
											</button>
										</div>
										<div className="inputss">
											<div className="imageDiv">
												<img src={FrameIcon} alt="" className="iconforreset" />
											</div>
											<div className="inputDiv">
												<input
													type={showPassword ? "tel" : "password"}
													placeholder="Old Password"
													value={password}
													onChange={(e) => settPassword(e.target.value)}
												/>
												{showPassword ? (
													<FaEye
														className="hidePassword"
														onClick={() => setShoPassword(!showPassword)}
													/>
												) : (
													<FaEyeSlash
														className="hidePassword"
														onClick={() => setShoPassword(!showPassword)}
													/>
												)}
											</div>
										</div>
										<div className="inputss">
											<div className="imageDiv">
												<img src={FrameIcon} alt="" className="iconforreset" />
											</div>
											<div className="inputDiv">
												<input
													type={showPassword ? "tel" : "password"}
													placeholder="New Password"
													value={password}
													onChange={(e) => settPassword(e.target.value)}
												/>
												{showPassword ? (
													<FaEye
														className="hidePassword"
														onClick={() => setShoPassword(!showPassword)}
													/>
												) : (
													<FaEyeSlash
														className="hidePassword"
														onClick={() => setShoPassword(!showPassword)}
													/>
												)}
											</div>
										</div>
										<button className="Reset">Reset Password</button>
									</div>
								</div>
							</div>
						)}
					</header>

					<div className="containerD">
						<div className={isOpen ? "sidebar" : "sidebar-closed"}>
							<div className="top-section">
								<div className="arrow">
									{isOpen ? (
										<>
											<span className="ams">AMS ADMIN PORTAL</span>
											<IoIosArrowRoundForward
												onClick={toggle}
												className="main-arrow"
											/>
										</>
									) : (
										<>
											<IoIosArrowRoundBack
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
							<NavLink
								to={"/"}
								className="logOutIcon"
								// activeClassName="acive"
								style={{ display: "flex" }}
							>
								<div className="icon">
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
		</>
	);
};

export default Layout;
