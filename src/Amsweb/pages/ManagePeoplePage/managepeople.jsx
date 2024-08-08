import React, { useState, useEffect } from "react";
import "./managepeople.css";
import { CiSearch } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { ToastContainer } from "react-toastify";

function Managepeople() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("admins"); // 'admins' or 'allUsers'
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetch("https://attsystem-latest.onrender.com/api/User/AddedUsers")
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((item) => ({
          Name: item.name,
          staffID: item.staff_ID,
          Email: item.email,
          Lab_role: item.lab_role,
        }));
        setContacts(formattedData);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.Name && (contact.Lab_role === "A1" || contact.Lab_role === "B2")
  );

  const filterContacts = contacts.filter(
    (contact) =>
      contact.Name &&
      contact.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (contact) => {
    setSelectedContact(contact);
  };

  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <>
      <ToastContainer />
      <div className="manage-people-container">
        {/* <header className="manage-people-header">
          <h1>Manage People</h1>
        </header> */}
        <div className="info-and-search">
          <div className="info-and-search-content">
            <h2>Users ({filterContacts.length})</h2>
          </div>
          <div className="info-and-search-content2">
            <form className="info-and-search-searchbar">
              <input
                type="text"
                className="input9"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <CiSearch id="search-icon" />
            </form>
          </div>
        </div>
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "admins" ? "active" : ""}`}
            onClick={() => handleTabSwitch("admins")}
          >
            Admins
          </button>
          <button
            className={`tab-button ${activeTab === "allUsers" ? "active" : ""}`}
            onClick={() => handleTabSwitch("allUsers")}
          >
            All Users
          </button>
        </div>
        {activeTab === "admins" && (
          <table>
            <thead>
              <tr className="tableHead">
                <th className="cell">Name</th>
                <th className="cell">Staff ID</th>
                <th className="cell">Email</th>
                <th className="cell">Admin</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact, index) => (
                <tr key={index} onClick={() => handleUserClick(contact)}>
                  <td className="cells-Name">{contact.Name}</td>
                  <td className="cells-staffID">{contact.staffID}</td>
                  <td className="cells-CheckIn">{contact.Email}</td>
                  <td className="cells-CheckOut">
                    {contact.Lab_role === "A1" || contact.Lab_role === "B2" ? (
                      <span style={{ color: "green" }}>Yes</span>
                    ) : (
                      <span style={{ color: "red" }}>No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {activeTab === "allUsers" && (
          <table>
            <thead>
              <tr className="tableHead">
                <th className="cell">Name</th>
                <th className="cell">Staff ID</th>
                <th className="cell">Email</th>
                <th className="cell">Role</th>
              </tr>
            </thead>
            <tbody>
              {filterContacts.map((contact, index) => (
                <tr key={index} onClick={() => handleUserClick(contact)}>
                  <td className="cells-Name">{contact.Name}</td>
                  <td className="cells-staffID">{contact.staffID}</td>
                  <td className="cells-CheckIn">{contact.Email}</td>
                  <td className="cells-CheckOut">
                    {" "}
                    {contact.Lab_role === "A1" || contact.Lab_role === "B2" ? (
                      <span style={{ color: "green" }}>Yes</span>
                    ) : (
                      <span style={{ color: "red" }}>No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Managepeople;
