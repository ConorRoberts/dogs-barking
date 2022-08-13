const setFilterPlaceHolder = (searchType:string, placeholderValue:string):string => {
  if (searchType === "course") {
    switch (placeholderValue) {
      case "code":
        return "Enter a course code, valid formats: CIS1300 ENGG1500 PSYC2000 HROB2010";
      case "number":
        return "Enter a course number, can range from 0-9999";
      case "name":
        return "Enter a course name, ie: Taxation or Into to financial accounting";
      case "description":
        return "Enter keyword(s)";
      case "level":
        return "Enter a number between 1000 and 9000";
      default:
        return "Enter a search value";
    }
  }
  if (searchType === "program") {
    switch (placeholderValue) {
      case "name":
        return "Enter in your program name";
      case "degree":
        return "Enter the degree program. Ie B.Sc B.Comp B.A B.Eng";
      case "code":
        return "Enter the shorthand code for your degree ie: BME PSYC CJPP";
      case "school":
        return "Enter a school ie: University of Guelph";
      default:
        return "Enter a search value";
    }
  }
  if (searchType === "school") {
    switch (placeholderValue) {
      case "country":
        return "Enter a country";
      case "name":
        return "Enter the name of a school ie: University of Guelph or University of Toronto";
      case "code":
        return "Enter the shorthand for a school ie: UofG for University of Guelph";
      case "province":
        return "Enter a province";
      case "city":
        return "Enter a city name";
      case "type":
        return "Enter a search value";
      case "description":
        return "Enter a keyword";
      default:
        return "Enter a search value";
    }
  }
};

export default setFilterPlaceHolder;