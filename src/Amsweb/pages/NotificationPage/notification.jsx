import React, { useState } from "react";
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
	const handleSubmitpassword = async () => {
		try {
			const response = await axios.post(
				"https://attsystem-latest.onrender.com/api/User/ConfirmPassword",
				{
					Staff_ID: staffId,
					Password: password,
				}
			);
			const approvalResponse = await axios.post( "https://attsystem-latest.onrender.com/api/User/Approve",
              
                {
                   Staff_ID: staffId
                }
			);
			toast.success("Approved successfully");
			console.log(response.data)
			if(response.status == 200){
				toast.success(response.data)
				setshowApprove(false)
				setPassword("")
			}else{
				toast.error("Invalid password")
			}
			console.log(response)
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
	return (
		<>
		<ToastContainer />
			<div className="table-ccontainer">
				<form className="searchbar">
					<input type="text" className="input" placeholder=" search" />
					<CiSearch id="search-icon" />
				</form>

				<table>
					<tbody>
						{Approve.map((Approve) => (
							<tr>
								<td
									className="sen"
									dangerouslySetInnerHTML={{ __html: Approve.sen }}
								></td>
								<button
									onClick={HandleSeemore}
									className="sen1"
									dangerouslySetInnerHTML={{ __html: Approve.sen1 }}
								></button>
								<td className="sen2">{Approve.sen2}</td>
								<td className="sen3">
									<button onClick={handleApprove}>{Approve.sen3}</button>
								</td>
								<td className="sen4">
									<button onClick={handleApprove}>{Approve.sen4}</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

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
