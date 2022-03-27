import getNeo4jDriver from "@utils/getNeo4jDriver";

interface CourseSearchResult {
  id: string;
  nodeId: number;
  name: string;
  weight: number;
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

    const data = await session.run(
      `
        CALL db.index.fulltext.queryNodes("coursesIndex", 'id:${query}* OR name:"${query}"') 
        YIELD node, score
        RETURN node, score
        order by score DESC 
        limit(${15})
      `
    );

    await session.close();
    await driver.close();

    return data.records.map((e) => ({
      name: e.get(0).properties.name as string,
      id: e.get(0).properties.id as string,
      nodeId: e.get(0).identity.low as number,
      weight: e.get(0).properties.weight as number,
      description: e.get(0).properties.description as string,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default searchCourses;
