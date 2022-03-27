/* eslint-disable indent */

import CourseQuery from "@dogs-barking/common/types/CourseQuery";
import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Excecutes a complex query to get all courses based on search criteria
 * @param query
 */
const queryCourses = async (query: CourseQuery) => {
  const driver = getNeo4jDriver();
  const db = driver.session();

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
      ${query.degree?.length > 0 ? "WHERE program.degree = $degree" : ""}
      ${query.school?.length > 0 ? "WHERE school.abbrev = $school" : ""}
      ${query.scope==="undergrad" ? "WHERE course.number < 5000" : ""}
      ${query.scope==="grad" ? "WHERE course.number > 5000" : ""}
      ${query.courseId?.length > 0 ? "WHERE course.id STARTS WITH $courseId" : ""}
      ${query.department?.length > 0 ? "WHERE course.department = $department" : ""}
      ${!isNaN(query.weight) ? `WHERE course.weight = $weight` : ""}
      ${!isNaN(query.number) ? `WHERE course.number = $number` : ""}
      ${query.name?.length > 0 ? `WHERE course.name STARTS WITH $name` : ""}
      ${query.description?.length > 0 ? `WHERE course.description =~ ".*${query.description}.*"` : ""}

      return course

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

  return data.records.map((e) => e.get(0).properties);
};

export default queryCourses;
