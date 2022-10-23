import toggleDarkMode from "~/utils/toggleDarkMode";
import { useState, useEffect, SetStateAction, Dispatch } from "react";

/**
 * Hook for managing dark mode
 * @returns Value and setter for dark mode
 */
const useDarkMode = (): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    try {
      const value = localStorage.getItem("darkMode") === "true";
      toggleDarkMode(value);
      setDarkMode(value);
    } catch (error) {
      return;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode ? "true" : "false");
    toggleDarkMode(darkMode);
  }, [darkMode]);

  return [darkMode, setDarkMode];
};

export default useDarkMode;
