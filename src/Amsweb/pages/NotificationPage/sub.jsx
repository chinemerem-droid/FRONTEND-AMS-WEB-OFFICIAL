import React from "react";
import { useState } from "react";
import "bootstrap";
import "./notification.css";
import { CiSearch } from "react-icons/ci";
import data from "../../data/approve data.json";
import userIcon from "../../../images/user-icon.svg";
import FrameIcon from "../../../images/Frame.svg";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

const Sub = () => {
	const [showPassword, setshowPassword] = useState(false);
	const [password, settPassword] = useState("");
	const [shoPassword, setShoPassword] = useState(false);
	const [step, setStep] = useState(1);
    const HandleNext = () => {
        setStep((prev) => prev + 1)
    }
    
	return (
		<div className="darkBGModal">
			<div className="centeredModal">
				<div className="modalNotification">
					<div className="relative">
						<FaTimes size={25} className="float-right" />
						{step && step === 1 && (
							<div className="password-box">
								<div className="pass-title">
									<h2 className="">Password Required</h2>
									<p>
										Your administrator password is required to complete Approval
										process
									</p>
								</div>
								<div className="pass-input-box">
									<div className="pass-profile">
										<img src={userIcon} alt="" width="14px" height="14px" />
										<p>
											John Doe | <span>Super Administrator</span>
										</p>
									</div>
									<div className="e-inputs">
										<div className="imgoDiv">
											<img src={FrameIcon} alt="" />
										</div>
										<div className="userpro"></div>

										<div className="inpoDiv">
											<input
												type={showPassword ? "tel" : "password"}
												placeholder=""
												value={password}
												onChange={(e) => settPassword(e.target.value)}
											/>
											{showPassword ? (
												<FaEye
													className="eye"
													onClick={() => setShoPassword(!showPassword)}
												/>
											) : (
												<FaEyeSlash
													className="eye"
													onClick={() => setShoPassword(!showPassword)}
												/>
											)}
										</div>
									</div>
								</div>
								<div className="pass-button">
									<button onClick={HandleNext}>Proceed</button>
									<button>Cancel</button>
								</div>
							</div>
						)}

                        {step && step === 2 && (
                            <>how re u</>
                        )}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sub;
