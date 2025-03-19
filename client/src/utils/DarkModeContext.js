import { createContext, useContext } from "react";

export const DarkModeContext = createContext();

export const useDarkModeContext = () => {
  const isDarkMode = useContext(DarkModeContext);
  if (isDarkMode === undefined) {
    throw new Error("useDarkModeContext must be used with a DarkModeContext");
  }
  return isDarkMode;
};
