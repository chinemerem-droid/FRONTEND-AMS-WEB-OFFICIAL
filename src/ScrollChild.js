import React from 'react';

function ScrollChild({ users }) {
  return (
    <div className="scroll-child">
      <div className="scroll-container">
        {users.map((user, index) => (
          <div className="scroll-item-container" key={index}>
            <span>Item {index + 1}</span>
            <div className="scroll-child-1">
              <img src="#" alt="" />
            </div>
            <div className="scroll-child-2">
              <h1>{user.name}</h1>
              <h2>{user.lab_role}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScrollChild;
