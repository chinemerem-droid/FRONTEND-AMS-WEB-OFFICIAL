import React, { createContext, useState } from 'react';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [roleID, setRoleID] = useState(null);
  const [nameID, setNameID] = useState('');

  return (
    <RoleContext.Provider value={{ roleID, setRoleID, nameID, setNameID }}>
      {children}
    </RoleContext.Provider>
  );
};
