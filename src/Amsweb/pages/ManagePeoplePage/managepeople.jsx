import React, { useState } from "react";
import "./managepeople.css";
import HorizontalScroll from "../../components/HorizontalScroll/HorizontalScroll";
import { CiSearch } from "react-icons/ci";
import AddNewUser from "../AddNewUser/addNewUser";
import { ToastContainer } from "react-toastify";
// import menuDot from "../images/menu-dots";

function Managepeople() {
  const [addNewUserPage, setAddNewUserPage] = useState(1);

  const handleClick = () => {
    setAddNewUserPage(2);
  };

  const items = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "hyy",
    "hyy",
    "hyy",
  ];

  return (
    <>
      <ToastContainer />
      <div className="manage-people-container">
        {addNewUserPage && addNewUserPage === 1 && (
          <>
            <header className="manage-people-header">
              <h1>Administrators</h1>
            </header>
            <div className="scroll-child">
              <HorizontalScroll items={items} />
            </div>
            <div className="info-and-search">
              <div className="info-and-search-content">
                <h2>All Users</h2>
              </div>
              <div className="info-and-search-content2">
                <form className="info-and-search-searchbar">
                  <input type="text" className="input" placeholder=" search" />
                  <CiSearch id="search-icon" />
                </form>
                <div>
                  <button className="add-user-button" onClick={handleClick}>
                    Add new User
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {addNewUserPage && addNewUserPage == 2 && (
          <>
            <AddNewUser />
          </>
        )}
      </div>
    </>
  );
}

export default Managepeople;
