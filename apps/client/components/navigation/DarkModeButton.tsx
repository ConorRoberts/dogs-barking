import { useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "~/components/Icons";

const DarkModeButton = () => {
  const [darkMode, setDarkMode] = useState(false);

  const onDarkModeChange = useCallback(
    (newValue: boolean) => {
      setDarkMode(newValue);
      if (newValue) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }

      localStorage.setItem("darkMode", newValue ? "true" : "false");
    },
    [setDarkMode]
  );

  useEffect(() => {
    const localDarkModeValue = localStorage.getItem("darkMode");
    onDarkModeChange(localDarkModeValue === "true");
  }, [onDarkModeChange]);

  return (
    <div
      className="rounded-full p-2 hover:bg-gray-100 transition dark:hover:bg-gray-800 cursor-default"
      onClick={() => onDarkModeChange(!darkMode)}
    >
      {darkMode ? (
        <>
          <Sun className="w-6 h-6" />
        </>
      ) : (
        <>
          <Moon className="w-6 h-6" />
        </>
      )}
    </div>
  );
};

export default DarkModeButton;
