const validateCourseCode = (courseCode:string) => { // validates a course code
  const courseCodeRegex = /^[A-Z]{3,4}(\d{4})$/;
  const courseNumber = courseCodeRegex.test(courseCode) ? courseCodeRegex.exec(courseCode)[1] : undefined;
  return courseCodeRegex.test(courseCode) && parseInt(courseNumber) >= 1000 && parseInt(courseNumber) <= 9999;
};
const validateUserCourseInput = (filterValue:string, userInput: string):boolean => { // special validation for specific input types, will be added onto later
  switch (filterValue) {
    case "code":
      return validateCourseCode(userInput);
    case "number":
      return /^\d+$/.test(userInput) && parseInt(userInput) >= 0 && parseInt(userInput) <= 9999;
    default:
      return true;
  }
};
export default validateUserCourseInput;