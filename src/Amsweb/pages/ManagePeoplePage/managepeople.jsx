import React, { useState, useEffect } from "react";
import "./managepeople.css";
import HorizontalScroll from "../../components/HorizontalScroll/HorizontalScroll";
import { CiSearch } from "react-icons/ci";
import AddNewUser from "../AddNewUser/addNewUser";
import { ToastContainer } from "react-toastify";
import ScrollChild from '../../../ScrollChild'; 

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
      contact.Name && contact.Name.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="scroll-child horizontal-scroll"> {/* Added 'horizontal-scroll' class */}
              <HorizontalScroll items={filteredContacts.map((contact) => contact.Name)} /> {/* Pass only names to HorizontalScroll */}
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
            {filteredContacts.map((contact, index) => (
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
