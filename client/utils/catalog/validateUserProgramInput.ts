
export const validateProgramCode = (programCode:string) => { // takes a program code ie: BME or BME:C
  const programCodeRegex = /^([A-Z]{3,4}|[A-Z]{3,4}:C)$/i;
  return programCodeRegex.test(programCode);
};

export const validateDegreeName = (degreeName:string) => { // validates a degree name
  const degreeNameRegex = /B\.?[A-Z]+.?/i;
  return degreeNameRegex.test(degreeName);
};

/**Validates input for programs */
const validateUserProgramInput = (filterValue:string, userInput: string):boolean => { // special validation for specific input types, will be added onto later
  switch (filterValue) {
    case "degree":
      return validateDegreeName(userInput);
    case "code":
      return validateProgramCode(userInput);
    default:
      return true;
  }
};

export default validateUserProgramInput;