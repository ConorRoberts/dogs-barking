const validateSchoolCode = (schoolCode:string) => { // takes a school code ie: UofG or UoG and tests for validity
  const programCodeRegex = /^[A-Z]{3,4}$/i;
  return programCodeRegex.test(schoolCode);
};

const validateUserSchoolInput = (filterValue:string, userInput: string):boolean => { // special validation for specific input types, will be added onto later
  switch (filterValue) {
    case "code":
      return validateSchoolCode(userInput);
    default:
      return true;
  }
};

export default validateUserSchoolInput;