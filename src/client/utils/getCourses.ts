import Course from "@typedefs/Course";
import getNeo4jDriver from "./getNeo4jDriver";

export interface GetCoursesQuery {
    school?: string;
    program?: string;
    pageSize?: number;
    page: number;
    sortBy?: string;
}

/**
 * Returns list of all courses
 * @param query Query parameters
 * @returns
 */
const getCourses = async (query?: GetCoursesQuery): Promise<Course[]> => {
  try {
    const { pageSize = 50, page = 0, school } = query;
    const driver = getNeo4jDriver();

    const session = driver.session();

    const result = await session.run(
      `
        MATCH (c: Course)
        call{
            WITH c
            MATCH (s: School ${school && `{abbrev: "${school}"}`})-[:OFFERS]->(c)
            return s.abbrev as school
        } 
        return c, school
        ORDER BY school, c.id
        SKIP(${+pageSize * +page}) 
        LIMIT(${pageSize})
      `
    );

    await session.close();
    await driver.close();

    return result.records.map((e) => e.get(0).properties);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getCourses;
