/**
 * Toggle dark mode
 * @param state
 */
const toggleDarkMode = (state?: boolean) => {
  const body = document.querySelector("body").classList;

  if (state === false) {
    body.remove("dark");
  } else if (state === true) {
    body.add("dark");
  } else {
    body.toggle("dark");
  }

  localStorage.setItem("darkMode", body.contains("dark") ? "true" : "false");
};

export default toggleDarkMode;
