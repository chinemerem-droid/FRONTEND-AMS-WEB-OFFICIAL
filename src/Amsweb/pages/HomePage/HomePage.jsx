import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import "./HomePage.css";

const HomePage = () => {
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("https://attsystem-latest.onrender.com/api/Attendance/AttendanceHistory")
            .then((response) => response.json())
            .then((data) => {
                const formattedData = data.map((item) => ({
                    Name: item.staff_ID,
                    staffID: item.staff_ID,
                    CheckIn: item.entryTime,
                    CheckOut: item.exitTime,
                    location: item.date,
                }));
                setContacts(formattedData);
            })
            .catch((error) => console.error("Error fetching data: ", error));
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
                    className="input"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <CiSearch id="search-icon" />
            </form>

            <table>
                <thead>
                    <tr className="tableHead">
                        <th className="cell">Name</th>
                        <th className="cell">Staff ID</th>
                        <th className="cell">Check In</th>
                        <th className="cell">Check Out</th>
                        <th className="cell">Location</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredContacts.map((contact, index) => (
                        <tr key={index}>
                            <td className="cells-Name">{contact.Name}</td>
                            <td className="cells-staffID">{contact.staffID}</td>
                            <td className="cells-CheckIn">{contact.CheckIn}</td>
                            <td className="cells-CheckOut">{contact.CheckOut}</td>
                            <td className="cells-location">{contact.location}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HomePage;