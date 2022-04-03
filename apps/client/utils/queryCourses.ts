/* eslint-disable indent */

import CourseQuery from "@dogs-barking/common/types/CourseQuery";
import getNeo4jDriver from "./getNeo4jDriver";

const generateQueryStr = (query: CourseQuery) => {
  let str = "WHERE"
  {query.degree?.length > 0 ? str += " program.degree = $degree AND" : ""}
  {query.school?.length > 0 ? str += " school.abbrev = $school AND" : ""}
  {query.scope === "undergrad" ? str += " course.number < 5000 AND" : ""}
  {query.scope === "grad" ? str += " course.number > 5000 AND" : ""}
  {query.courseId?.length > 0 ? str += " course.id STARTS WITH $courseId AND" : ""}
  {query.department?.length > 0 ? str += " course.department = $department AND" : ""}
  {!isNaN(query.weight) ? str += " course.weight = $weight AND" : ""}
  {!isNaN(query.number) ? str += " course.number = $number AND" : ""}
  {query.name?.length > 0 ? str += " course.name STARTS WITH $name AND" : ""}
  {query.description?.length > 0 ? str += ' course.description =~ ".*${query.description}.*"' : ""}
  
  // Remove trailing 'WHERE' or 'AND' if any
  const index = str.lastIndexOf(" ");
  const lastWord = str.substring(index + 1, str.length);
  if (lastWord === "WHERE" || lastWord === "AND") {
    str = str.substring(0, index);
  }
  return str;
}

/**
 * Excecutes a complex query to get all courses based on search criteria
 * @param query
 */
const queryCourses = async (query: CourseQuery) => {
  const driver = getNeo4jDriver();
  const db = driver.session();
  const str = generateQueryStr(query);

  const data = await db.run(
    `
      MATCH (school:School)
      -[:OFFERS]->
      ${query.degree?.length > 0 ? "(program: Program)-[:MAJOR_REQUIRES]->" : ""}
      (course: Course)
      ${
        query.prerequisites?.length > 0
          ? `-[:HAS_PREREQUISITE]->(pc: Course) WHERE pc.id IN [${query.prerequisites.map((e) => `"${e}"`).join(",")}]`
          : ""
      }

      ${str}

      with collect(course) as courses, count (course) as total
      unwind courses as course
      return course, id(course) as nodeId, total
      ${
        query.sortKey?.length > 0 && ["asc", "desc"].includes(query.sortDir)
          ? `ORDER BY course.${query.sortKey} ${query.sortDir}`
          : ""
      }

      SKIP(${+query.pageNum * +query.pageSize})
      LIMIT(${+query.pageSize})
    `,
    query
  );
  await db.close();
  await driver.close();
  return data.records.map((e) => ({ ...e.get("course").properties, nodeId: e.get("nodeId").low, total: e.get("total").low }));
};

export default queryCourses;
