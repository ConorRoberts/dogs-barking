import { Query } from "@dogs-barking/common/types/Input";

const courseCodeRegex = new RegExp(/([A-Z]{4}\*[0-9]{4})/g);
const courseCodeRegex2 = new RegExp(/([A-Z]{3}\*[0-9]{4})/g);

const combinedCourseRegex = new RegExp(courseCodeRegex2.source + "|" + courseCodeRegex.source, "g");

const DBSearchString = (queries: Query) => {
  let searchString = `MATCH(s: School { `;
  let foundWhere = false;

  if (queries?.school !== "") {
    searchString += `abbrev:'${queries?.school.toUpperCase()}'`;
  }

  

  if (queries?.degree !== "") {
    searchString += `})-[:OFFERS]->(p: Program {degree:'${queries?.degree}'`;
    searchString += "})-[:MAJOR_REQUIRES]->(c: Course { ";
  } else {
    searchString += "})-[:OFFERS]->(c: Course { ";
  }

  if (queries?.department.match(/([A-Z]{3})|([A-Z]{4})/)) {
    searchString += `department:'${queries?.department}',`;
  }

  if (queries?.coursecode !== "") {
    searchString += `id:'${queries?.coursecode}',`;
  }

  if (queries?.weight > -1) {
    searchString += `weight:'${queries?.weight}',`;
  }

  if (queries?.coursenum > -1) {
    searchString += `number:${queries?.coursenum},`;
  }

  searchString = searchString.slice(0, -1); //remove extra comma
  searchString += "}) ";

  if (queries?.prerequisite.length > 0) {
    searchString += `-[:HAS_PREREQUISITE]->(pc: Course) WHERE `;
    for (let i = 0; i < queries.prerequisite.length; i++) {
      searchString += `pc.id = '${queries.prerequisite[i]}' `;
      if (i != queries.prerequisite.length - 1) searchString += "OR ";
    }
  }

  if (queries?.level > -1) {

    searchString += addPrefix(foundWhere) + `toString(c.number) STARTS WITH '${queries.level}' `;
    foundWhere = true;
  }

  if (queries?.options?.Scope === "Grad") {
    searchString += addPrefix(foundWhere) + `c.number > 5000 `;
    foundWhere = true;
  } else if (queries?.options?.Scope === "Undergrad") {
    searchString += addPrefix(foundWhere) + `c.number <= 5000 `;
    foundWhere = true;
  }

  if (queries?.semester.length > 0) {
  }

  if (queries?.title.length > 0) {
    searchString += addPrefix(foundWhere) + `c.name STARTS WITH '${queries.title[0]}'`;
    foundWhere = true;
  }

  searchString += "return c ";

  if (queries?.options?.SortMode === "Weight") {
  }

  if (queries?.options?.SortDirection === "Ascending") {
    if (queries?.options?.SortMode === "Raw") {
      searchString += "ORDER BY c.id ";
    } else {
      searchString += "ORDER BY c.weight ";
    }
  } else if (queries?.options?.SortDirection === "Descending") {
    if (queries?.options?.SortMode === "Raw") {
      searchString += "ORDER BY c.id DESC";
    } else {
      searchString += "ORDER BY c.weight DESC";
    }
  }

  return searchString;
};

const addPrefix= (foundWhere: boolean) => {
  if (!foundWhere) {
    return "WHERE ";
  } else {
    return "AND ";
  }
};

export default DBSearchString;