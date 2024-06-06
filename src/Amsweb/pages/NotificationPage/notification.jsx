import React, { useState } from "react";
import "bootstrap";
import "./notification.css";
import { CiSearch } from "react-icons/ci";
import data from "../../data/approve data.json";
import userIcon from "../../../images/user-icon.svg";
import FrameIcon from "../../../images/Frame.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Notification = () => {
	const [Approve, setApprove] = useState(data);
	const [showApprove, setshowApprove] = useState(false);
	const [showPassword, setshowPassword] = useState(false);
	const [password, settPassword] = useState("");
	const [shoPassword, setShoPassword] = useState(false);
	const handleApprove = () => {
		console.log("pressed");
		setshowApprove(true);
	};

	return (
		<>
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
								<td
									className="sen1"
									dangerouslySetInnerHTML={{ __html: Approve.sen1 }}
								></td>
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
					<div className="darkBG">
						<div className="centered">
							<div className="modal notification">
								<div className="passreset">
									<h6>Password Required</h6>
									<p>
										Your Administrator password is required to complete Approval
										process
									</p>
								</div>
								<div className="sub-card">
								<div className="profile">
									<div className="userp">
									<img src={userIcon} alt="" width="14px" height="14px" /> 
									<h6> John Doe</h6>
									</div>
									<div className="userpro">

									</div>
									<div className="usertitle">
									<span>Super Administration</span>
									</div>
								</div>
									
								<div className="e-inputs">
									<div className="imgoDiv">
										<img src={FrameIcon} alt="" className="iconforpass" />
									</div>
									<div className="inpoDiv">
										<input
											type={showPassword ? "tel" : "password"}
											placeholder="Old Password"
											value={password}
											onChange={(e) => settPassword(e.target.value)}
										/>
										{showPassword ? (
											<FaEye
												className="hidddePassword"
												onClick={() => setShoPassword(!showPassword)}
											/>
										) : (
											<FaEyeSlash
												className="hidddePassword"
												onClick={() => setShoPassword(!showPassword)}
											/>
										)}
									</div>
								</div>
								</div>
								<div className="buts">
								<button className="proceed">proceed</button>
								<button className="cancel">cancel</button>
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
