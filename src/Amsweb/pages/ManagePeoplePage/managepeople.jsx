import React, { useState, useEffect } from "react";
import "./managepeople.css";
import HorizontalScroll from "../../components/HorizontalScroll/HorizontalScroll";
import { CiSearch } from "react-icons/ci";
import AddNewUser from "../AddNewUser/addNewUser";
import { ToastContainer } from "react-toastify";


function Managepeople() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addNewUserPage, setAddNewUserPage] = useState(1);

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
      contact.Name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (contact.Lab_role === "A1" || contact.Lab_role === "B2")
  );
  const filterContacts = contacts.filter(
    (contact) =>
      contact.Name &&
      contact.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <ToastContainer />
      <div className="manage-people-container">
        {addNewUserPage === 1 && (
          <>
            <header className="manage-people-header">
              <h1>Administrators</h1>
            </header>
            {/* <div className="scroll-child horizontal-scroll">
              <HorizontalScroll items={filteredContacts.map((contact) => contact.Name)} /> 
            </div> */}
            <div className="scroll-child horizontal-scroll">
              <div className="scroll-container">
                {filteredContacts.map((contact) => (
                  <div key={contact.id || Math.random()} className="scroll-item-container">
                    <span>{contact.staffID}</span>
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
                <h2>All Users</h2>
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
              <tr key={index}>
                <td className="cells-Name">{contact.Name}</td>
                <td className="cells-staffID">{contact.staffID}</td>
                <td className="cells-CheckIn">{contact.Email}</td>
                <td className="cells-CheckOut">{contact.Lab_role}</td>
              </tr>
            ))}
          </tbody>
        </table>
          </>
        )}

      

       
      </div>
      {addNewUserPage === 2 && <AddNewUser />}
    </>
  );
}

export default Managepeople;
