import React, { useState, useEffect } from "react";
import "bootstrap";
import "./notification.css";
import { CiSearch } from "react-icons/ci";
import data from "../../data/approve data.json";
import userIcon from "../../../images/user-icon.svg";
import FrameIcon from "../../../images/Frame.svg";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import info from "../../../images/Vector-3.svg";
import userprofile from "../../../images/Group 1.svg";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Fixed import statement
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, NavigationType } from "react-router-dom";

const Notification = () => {
    const [Approve, setApprove] = useState(data);
    const [showApprove, setshowApprove] = useState(false);
    const [showPassword, setshowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [shoPassword, setShoPassword] = useState(false);
    const [showSeemore, setshowSeemore] = useState(false);
    const [notificationData, setNotification] = useState([]);
    const [staffID, setStaffId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const token = sessionStorage.getItem("token");
    const roleID = sessionStorage.getItem("roleID")
        ? sessionStorage.getItem("roleID")
        : null;
    console.log("roleID", roleID);
    const staffId = jwtDecode(token).nameid;
    console.log(staffId);

    const handleApprove = () => {
        console.log("pressed");
        setshowApprove(true);
    };
    const HandleClose = () => {
        setshowApprove(false);
        setshowSeemore(false);
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const HandleSeemore = () => {
        setshowSeemore(true);
    };

    useEffect(() => {
        // Fetch notifications from API
        fetch("https://attsystem-latest.onrender.com/api/User/GetNotification")
            .then((response) => response.json())
            .then((data) => {
                // Assuming RoleID is stored in session storage as 'roleID'
                const roleId = sessionStorage.getItem('roleID');

                // Filter notifications based on RoleID and isRead === false
                const filteredNotifications = data.filter((notification) => notification.roleID === roleId && !notification.isRead);

                // Map the message to the sen property of each notification object
                const notificationsWithSen = filteredNotifications.map((notification) => ({
                    Staff_ID: notification.staff_ID,
                    sen: notification.message,
                    sen1: notification.sen1,
                    sen2: notification.sen2,
                    sen3: notification.sen3,
                    sen4: notification.sen4,
                }));

                setNotification(notificationsWithSen);

                if (notificationsWithSen.length > 0) {
                    setStaffId(notificationsWithSen[0].Staff_ID); // Assuming you want the first Staff_ID
                }
            })
            .catch((error) => console.error("Error fetching notification:", error));
    }, []);

    const handleSubmitpassword = async () => {
        try {
            const response = await axios.post(
                "https://attsystem-latest.onrender.com/api/User/ConfirmPassword",
                {
                    Staff_ID: staffId,
                    Password: password,
                }
            );
            if (response.status === 200) {
                toast.success("Password confirmed successfully");

                const approveResponse = await axios.post(
                    "https://attsystem-latest.onrender.com/api/User/Approve",
                    {
                        Staff_ID: staffID,
                    }
                );

                if (approveResponse.status === 200) {
                    toast.success("User approved successfully");
                } else {
                    toast.error("Failed to approve user");
                }

                setshowApprove(false);
                setPassword("");
                fetch("https://attsystem-latest.onrender.com/api/User/GetNotification")
                    .then((response) => response.json())
                    .then((data) => {
                        const roleId = sessionStorage.getItem('roleID');
                        const filteredNotifications = data.filter((notification) => notification.roleID === roleId && !notification.isRead);
                        const notificationsWithSen = filteredNotifications.map((notification) => ({
                            Staff_ID: notification.staff_ID,
                            sen: notification.message,
                            sen1: notification.sen1,
                            sen2: notification.sen2,
                            sen3: notification.sen3,
                            sen4: notification.sen4,
                        }));
                        setNotification(notificationsWithSen);
                        if (notificationsWithSen.length > 0) {
                            setStaffId(notificationsWithSen[0].Staff_ID);
                        }
                    })
                    .catch((error) => console.error("Error fetching notification:", error));
            } else {
                toast.error("Invalid password");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error("Incorrect password. Please try again.");
            } else {
                console.error(error);
                toast.error("An error occurred. Please try again later.");
            }
        }
    };

    const handleDenyUser = async () => {
        try {
            const response = await axios.post(
                "https://attsystem-latest.onrender.com/api/User/DenyUser",
                {
                    Staff_ID: staffID,
                }
            );
            toast.success("User removed successfully");
            fetch("https://attsystem-latest.onrender.com/api/User/GetNotification")
                .then((response) => response.json())
                .then((data) => {
                    const roleId = sessionStorage.getItem('roleID');
                    const filteredNotifications = data.filter((notification) => notification.roleID === roleId && !notification.isRead);
                    const notificationsWithSen = filteredNotifications.map((notification) => ({
                        Staff_ID: notification.staff_ID,
                        sen: notification.message,
                        sen1: notification.sen1,
                        sen2: notification.sen2,
                        sen3: notification.sen3,
                        sen4: notification.sen4,
                    }));
                    setNotification(notificationsWithSen);
                    if (notificationsWithSen.length > 0) {
                        setStaffId(notificationsWithSen[0].Staff_ID);
                    }
                })
                .catch((error) => console.error("Error fetching notification:", error));
        } catch (error) {
            console.error("Error removing user:", error);
            toast.error("Failed to remove user");
        }
    };

    const filteredNotification = notificationData.filter((n) =>
        n.Staff_ID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <ToastContainer />
            <div className="table-container">
                <form className="searchbarNot">
                    <input
                        type="text"
                        className="input4"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <CiSearch id="search-icon" />
                </form>

                {notificationData.length > 0 ? (
                    <table>
                        <tbody>
                            {filteredNotification.map((notification, index) => (
                                <tr key={index}>
                                    <td style={{ fontWeight: "bold", fontSize: "larger" }}>
                                        {notification.sen}
                                    </td>
                                    <td></td>
                                    <td className="sen2">Today</td>
                                    {roleID && roleID === "A1" && (
                                        <>
                                            <td className="sen3">
                                                <button onClick={handleApprove}>Approve</button>
                                            </td>
                                            <td className="sen4">
                                                <button onClick={handleDenyUser}>Deny</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ textAlign: "center", marginTop: "20px" }}>
                        No information available
                    </p>
                )}

                {showApprove && (
                    <div className="darkBGModal">
                        <div className="centeredModal">
                            <div className="modalNotification">
                                <div className="relative">
                                    <FaTimes
                                        size={25}
                                        className="float-right"
                                        onClick={HandleClose}
                                    />
                                    <div className="password-box">
                                        <div className="pass-title">
                                            <h2>Password Required</h2>
                                            <p>
                                                Your administrator password is required to complete
                                                Approval process
                                            </p>
                                        </div>
                                        <div className="pass-input-box">
                                            <div className="pass-profile">
                                                <img src={userIcon} alt="" width="14px" height="14px" />
                                                <p>
                                                    John Doe <span>Super Administrator</span>
                                                </p>
                                            </div>
                                            <div className="e-inputs">
                                                <div className="imgoDiv">
                                                    <img src={FrameIcon} alt="" />
                                                </div>
                                                <div className="userpro"></div>
                                                <div className="inpoDiv">
                                                    <input
                                                        type={shoPassword ? "tel" : "password"}
                                                        placeholder=""
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                    {shoPassword ? (
                                                        <FaEye
                                                            className="eye"
                                                            onClick={() => setShoPassword(!shoPassword)}
                                                        />
                                                    ) : (
                                                        <FaEyeSlash
                                                            className="eye"
                                                            onClick={() => setShoPassword(!shoPassword)}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pass-button">
                                            <button
                                                onClick={handleSubmitpassword}
                                                className="proceed"
                                            >
                                                Proceed
                                            </button>
                                            <button className="Cancel" onClick={HandleClose}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showSeemore && (
                    <div className="darkBGModal">
                        <div className="centeredModal">
                            <div className="modalNotification">
                                <div className="relative">
                                    <FaTimes
                                        size={25}
                                        className="float-right"
                                        onClick={HandleClose}
                                    />
                                    <div className="password-box"></div>
                                    <h2>See More</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Notification;
