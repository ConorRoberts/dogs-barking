export const overrides = `focus:ring-0 focus:outline-none appearance-none`;
export const styles = {
  default: {
    style:
      "focus:border-indigo-300 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 rounded-md w-full border border-gray-300 dark:border-gray-700 py-2 px-2",
    error: "border border-red-500",
  },
  file: {
    style:
      "focus:border-indigo-300 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 rounded-xl w-full py-2 px-2",
    error: "border border-red-500",
  },
  blank: {
    style: "",
    error: "",
  },
};
