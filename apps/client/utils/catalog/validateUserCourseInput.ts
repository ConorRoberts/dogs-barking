export const validateCourseCode = (courseCode:string):boolean => { // validates a course code
  const courseCodeRegex = /^[A-Z]{3,4}(\d{4})$/;
  const courseNumber = courseCodeRegex.test(courseCode) ? courseCodeRegex.exec(courseCode)[1] : undefined;
  return courseCodeRegex.test(courseCode) && parseInt(courseNumber) >= 1000 && parseInt(courseNumber) <= 9999;
};

export const validateCourseLevel = (courseLevel:string):boolean => {
  return /\d+/i.test(courseLevel) && (parseInt(courseLevel) >= 1000 && parseInt(courseLevel) <= 9000) && (parseInt(courseLevel) % 1000 === 0);
};

const validateUserCourseInput = (filterValue:string, userInput: string):boolean => { // special validation for specific input types, will be added onto later
  switch (filterValue) {
    case "code":
      return validateCourseCode(userInput);
    case "number":
      return /^\d+$/.test(userInput) && parseInt(userInput) >= 0 && parseInt(userInput) <= 9999;
    case "level":
      return validateCourseLevel(userInput);
    default:
      return true;
  }
};
export default validateUserCourseInput;