import React, { createContext, useState } from 'react';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [roleID, setRoleID] = useState(null);

  return (
    <RoleContext.Provider value={{ roleID, setRoleID }}>
      {children}
    </RoleContext.Provider>
  );
};
