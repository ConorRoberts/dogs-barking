import { Query } from "@dogs-barking/common/types/Input";
import getNeo4jDriver from "./getNeo4jDriver";

const courseCodeRegex = new RegExp(/([A-Z]{4}\*[0-9]{4})/g);
const courseCodeRegex2 = new RegExp(/([A-Z]{3}\*[0-9]{4})/g);

const combinedCourseRegex = new RegExp(courseCodeRegex2.source + "|" + courseCodeRegex.source, "g");

const DBSearchString = (queries: Query) => {
  // let searchString = `MATCH(s: School) `;
  // let foundWhere = false;

  // if (queries?.school !== "") {
  //   searchString += `WHERE school.abbrev: = "${queries?.school.toUpperCase()}"`;
  // }
  // const driver = getNeo4jDriver();
  // const session = driver.session();

  
  // await driver.close();
  // await session.close();


  return "";
};

const addPrefix = (foundWhere: boolean) => {
  if (!foundWhere) {
    return "WHERE ";
  } else {
    return "AND ";
  }
};

export default DBSearchString;
