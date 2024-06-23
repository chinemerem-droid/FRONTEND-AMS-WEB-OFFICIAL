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
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
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
	// const [Token, setToken] = useState(false);

	const token = sessionStorage.getItem("token");
	const staffId = jwtDecode(token).nameid;
	console.log(staffId);

	const handleApprove = () => {
		console.log("pressed");
		setshowApprove(true);
	};
	// const [step, setStep] = useState(1);
	// const HandleNext = () => {
	// 	setStep((prev) => prev + 1);
	// };
	const HandleClose = () => {
		setshowApprove(false);
		setshowSeemore(false);
	};

	const HandleSeemore = () => {
		setshowSeemore(true);
	};
	useEffect(() => {
		fetch("https://attsystem-latest.onrender.com/api/User/GetNotification")
			.then((response) => response.json())
			.then((data) => {
				// Map the message to the sen property of each notification object
				const notificationsWithSen = data.map((notification) => ({
					Staff_ID:notification.staff_ID,
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
				// Password confirmed successfully
				toast.success("Password confirmed successfully");
	
				const approveResponse = await axios.post(
					"https://attsystem-latest.onrender.com/api/User/Approve", // Change this URL to your actual approval endpoint
					{
						Staff_ID: staffID,
					}
				);
		
					if (approveResponse.status === 200) {
						// User approved successfully
						toast.success("User approved successfully");
					} else {
						toast.error("Failed to approve user");
					}


            setshowApprove(false);
            setPassword("");
				setshowApprove(false);
				setPassword("");
			} else {
				toast.error("Invalid password");
			}
			console.log(response);
		} catch (error) {
			if (error.response.status === 401) {
				toast.error("Incorrect password. Please try again.");
			} else {
				// Other errors
				console.error(error);
				toast.error("An error occurred. Please try again later.");
			}
		}
	};
	

	
	const handleDenyUser = async () => {
		try {
			const response = await axios.post(
				"https://attsystem-latest.onrender.com/api/User/RemoveUser",
				{
					Staff_ID: staffID,
				}
			);
			console.log(response.data);
			// Handle success
			toast.success("User removed successfully");
		} catch (error) {
			console.error("Error removing user:", error);
			// Handle error, e.g., show an error message
			toast.error("Failed to remove user");
		}
	};



	return (
        <>
            <ToastContainer />
            <div className="table-ccontainer">
                <form className="searchbarNot">
                    <input type="text" className="input4" placeholder="Search" />
                    <CiSearch id="search-icon" />
                </form>

                {notificationData.length > 0 ? (
                    <table>
                        <tbody>
                            {notificationData.map((notification, index) => (
                                <tr key={index}>
                                    <td
                                        style={{ fontWeight: 'bold', fontSize: 'larger' }}
                                        dangerouslySetInnerHTML={{ __html: notification.sen }}
                                    ></td>
                                    <td>
                                        <button className="sen1" onClick={HandleSeemore}>
                                            See More
                                        </button>
                                    </td>
                                    <td className="sen2">Today</td>
                                    <td className="sen3">
                                        <button onClick={handleApprove}>Approve</button>
                                    </td>
                                    <td className="sen4">
                                        <button onClick={handleDenyUser}>Deny</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>No information available</p>
                )}

				{showApprove && (
					<div className="darkBGModal">
						<div className="centeredModal">
							{/* {step && step === 1 && ( */}
							<div className="modalNotification">
								<div className="relative">
									<FaTimes
										size={25}
										className="float-right"
										onClick={HandleClose}
									/>
									<div className="password-box">
										<div className="pass-title">
											<h2 className="">Password Required</h2>
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
							{/* )} */}

							{/* {step && step === 2 && ( */}
							{/* <div className="modalInfformation">
									<div className="relative">
										<FaTimes
											size={25}
											className="float-right"
											onClick={HandleClose}
										/>
										<h2>User Information</h2>
										<div className="information">
											<img src={userprofile} alt="" />
											<h4>John Doe</h4>
											<span>211-FF-4</span>
										</div>

										<div className="userprof">
											

										</div>
									</div>
								</div> */}
							{/* )} */}
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
									<h2>hwfar</h2>
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
