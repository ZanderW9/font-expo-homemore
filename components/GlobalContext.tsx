import React, { createContext, useState } from "react";

export const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [httpLinkUrl] = useState(process.env.EXPO_PUBLIC_BACKEND_URL);
  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        httpLinkUrl,
        token,
        setToken,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
