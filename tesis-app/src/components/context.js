import React, { createContext, useState } from "react";
export const UserContext = createContext();

export const UserProvider = props => {
  const [isAuthenticated, setAuth] = useState(false);
  const [isAdministrator, setAdmin] = useState(false);
  const auth = {
    isAuth: isAuthenticated,
    isAdmin: isAdministrator,
    setAuthentication: isLogged => {
      setAuth(isLogged);
    },
    setAdministrator: isAdmin => {
      setAdmin(isAdmin);
    }
  };

  return (
    <UserContext.Provider
      value={{
        auth
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
