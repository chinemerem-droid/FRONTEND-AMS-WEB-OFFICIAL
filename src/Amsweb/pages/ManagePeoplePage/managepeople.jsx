import React, { useState, useEffect } from "react";
import "./managepeople.css";
import HorizontalScroll from "../../components/HorizontalScroll/HorizontalScroll";
import { CiSearch } from "react-icons/ci";
import AddNewUser from "../AddNewUser/addNewUser";
import { ToastContainer } from "react-toastify";

function UserPopup({ contact, onClose, onRemove, onUpdate }) {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="popup-close" onClick={onClose}>X</button>
        <h2>User Information</h2>
        <p><strong>Name:</strong> {contact.Name}</p>
        <p><strong>Staff ID:</strong> {contact.staffID}</p>
        <p><strong>Email:</strong> {contact.Email}</p>
        <p><strong>Role:</strong> {contact.Lab_role}</p>
        <div className="popup-buttons">
          <button className="popup-button" onClick={onRemove}>Remove User</button>
        </div>
      </div>
    </div>
  );
}

function Managepeople() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addNewUserPage, setAddNewUserPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);

  const handleClick = () => {
    setAddNewUserPage(2);
  };

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
      contact.Name &&
      (contact.Lab_role === "A1" || contact.Lab_role === "B2")
  );

  const filterContacts = contacts.filter(
    (contact) =>
      contact.Name &&
      contact.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (contact) => {
    setSelectedContact(contact);
  };

  const handleClosePopup = () => {
    setSelectedContact(null);
  };

  const handleRemoveUser = () => {
    // Handle user removal logic
    console.log("Remove user:", selectedContact);
    setSelectedContact(null);
  };



  return (
    <>
      <ToastContainer />
      <div className="manage-people-container">
        {addNewUserPage === 1 && (
          <>
            <header className="manage-people-header">
              <h1>Administrators</h1>
            </header>
            <div className="scroll-child horizontal-scroll">
              <div className="scroll-container">
                {filteredContacts.map((contact) => (
                  <div key={contact.id || Math.random()} className="scroll-item-container">
                    <td className="cells-staffID">
                      <span style={{ color: "green", fontWeight: "bold" }} className="center-text">{contact.staffID}</span>
                    </td>
                    <div className="scroll-child-1">
                      <img src="#" alt="" /> {/* Placeholder for image */}
                    </div>
                    <div className="scroll-child-2">
                      <h1>{contact.Name}</h1> {/* Assuming you want to repeat the name in h1 */}
                      <h2>
                        {contact.Lab_role === "A1" ? "SuperAdmin" : contact.Lab_role === "B2" ? "SubAdmin" : contact.Lab_role}
                      </h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="info-and-search">
              <div className="info-and-search-content">
                <h2>Users({filterContacts.length})</h2>
              </div>
              <div className="info-and-search-content2">
                <form className="info-and-search-searchbar">
                  <input
                    type="text"
                    className="input"
                    placeholder=" search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <CiSearch id="search-icon" />
                </form>
                <div>
                  <button className="add-user-button" onClick={handleClick}>
                    Add new User
                  </button>
                </div>
              </div>
            </div>
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
                {filterContacts.map((contact, index) => (
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
          </>
        )}
      </div>
      {addNewUserPage === 2 && <AddNewUser />}
      {selectedContact && (
        <UserPopup
          contact={selectedContact}
          onClose={handleClosePopup}
          onRemove={handleRemoveUser}
        />
      )}
    </>
  );
}

export default Managepeople;
