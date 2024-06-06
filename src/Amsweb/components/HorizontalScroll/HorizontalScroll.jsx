import React from "react";
import "./HorizontalScroll.css";

const HorizontalScroll = ({ items }) => {
  return (
    <div className="scroll-container">
      {items.map((item, index) => (
        <div key={index} className="scroll-item-container">
          {item}

          {/* <div className="scroll-item-"></div> */}
          <div className="scroll-child-1">
            <img src="#" alt=""></img>
          </div>
              <div className="scroll-child-2">
                  <h1>John Doe</h1>
                  <h2>Super Administrator</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HorizontalScroll;
