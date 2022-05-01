import getNeo4jDriver from "@utils/getNeo4jDriver";

interface CourseSearchResult {
  id: string;
  name: string;
  description: string;
}
/**
 *
 */
const searchCourses = async (query: string): Promise<CourseSearchResult[]> => {
  try {
    if (typeof query !== "string") throw new Error("Query must be a string");

    const driver = getNeo4jDriver();
    const session = driver.session();

    const { records } = await session.run(
      `
        CALL db.index.fulltext.queryNodes("courseSearch", $query) 
        YIELD node, score
        RETURN properties(node) as course, score
        order by score DESC 
        limit(15)
      `,
      {
        query: `code:${query}* OR name:"${query}"`,
      }
    );

    await session.close();
    await driver.close();

    return records.map((e) => ({
      name: e.get("course").name as string,
      id: e.get("course").id as string,
      description: e.get("course").description as string,
      code: e.get("course").code as string,
    }));
  } catch (error) {
    return [];
  }
};

export default searchCourses;
