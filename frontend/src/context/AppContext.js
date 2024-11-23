"use client"
import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  const value = {
    user,
    setUser,
    theme,
    setTheme,
    language,
    setLanguage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook for easy access
export function useAppContext() {
  return useContext(AppContext);
}
