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
							<div className="modal">
								<h6>Password Required</h6>
								<p>
									Your Administrator password is required to complete Approval
									process
								</p>
								<img src={userIcon} alt="" /> <h6> John Doe</h6>
								<span>Super Administration</span>
								<div className="e-inputs">
									<div className="imgeDiv">
										<img src={FrameIcon} alt="" className="iconforreset" />
									</div>
									<div className="inpuDiv">
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
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Notification;
