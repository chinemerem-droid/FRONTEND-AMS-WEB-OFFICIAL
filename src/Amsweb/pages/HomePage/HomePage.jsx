import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import "./HomePage.css";
import { FaUser } from "react-icons/fa";
import CheckIn from "../../../images/check in .svg";

const HomePage = () => {
	const [contacts, setContacts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	const fetchContacts = () => {
		const currentDate = new Date().toISOString().split("T")[0];
		const apiUrl =
			"https://attsystem-latest.onrender.com/api/Attendance/AttendanceByDate";

		fetch(apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ date: currentDate }),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				const formattedData = data.map((item) => ({
					Name: item.staff_ID,
					staffID: item.staff_ID,
					CheckIn: item.entryTime,
					CheckOut: item.exitTime,
					Date: item.date,
				}));
				setContacts(formattedData);
			})
			.catch((error) => console.error("Error fetching data: ", error));
	};

	useEffect(() => {
		// Fetch data initially
		fetchContacts();

		// Set interval to fetch data every 10 seconds
		const intervalId = setInterval(fetchContacts, 10000);

		// Clear interval on component unmount
		return () => clearInterval(intervalId);
	}, []);

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const filteredContacts = contacts.filter((contact) =>
		contact.Name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="table-container">
			<form className="searchbar">
				<input
					type="text"
					className="input2"
					placeholder="Search"
					value={searchTerm}
					onChange={handleSearchChange}
				/>
				<CiSearch id="search-icon" />
			</form>

			<table className="ttable">
				<thead className="thead">
					<tr className="tableHead">
						<th className="cell2"></th>
						<th className="cell">Name</th>
						<th className="cell">Staff ID</th>
						<th className="cell">Check In</th>
						<th className="cell">Check Out</th>
						<th className="cell">Location</th>
					</tr>
				</thead>
				<tbody className="tBodyContainer">
					{filteredContacts.length > 0 ? (
						filteredContacts.map((contact, index) => (
							<tr key={index}>
								<td className="cells-icon">
									<FaUser className="user-icon" />
								</td>
								<td className="cells-Name">{contact.Name}</td>
								<td className="cells-staffID">{contact.staffID}</td>
								<td className="cells-CheckIn">{contact.CheckIn}</td>
								<td className="cells-CheckOut">{contact.CheckOut}</td>
								<td className="cells-CheckOut">Digital Lab Innovation</td>
							</tr>
						))
					) : (
						<div className="CheckIn">
							<img src={CheckIn} alt="" className="Check" />
							<h2 className="name">No Check-ins</h2>
							<p>No one has checked in yet today</p>
						</div>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default HomePage;
