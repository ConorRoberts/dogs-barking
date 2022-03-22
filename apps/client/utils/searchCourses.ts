import CourseQuery from "@dogs-barking/common/types/CourseQuery";
import getNeo4jDriver from "@utils/getNeo4jDriver";

interface CourseSearchResult {
  id: string;
  nodeId: number;
  name: string;
  weight: number;
}
/**
 *
 */
const searchCourses = async (query): Promise<CourseSearchResult[]> => {
  const { courseId } = query;

  const pageSize = (query.pageSize as string) ?? "25";
  const pageNum = (query.pageNum as string) ?? "0";

  try {
    const driver = getNeo4jDriver();
    const session = driver.session();

    const data = await session.run(
      `
        CALL db.index.fulltext.queryNodes("coursesIndex", 'id:${courseId}*') 
        YIELD node, score
        RETURN node, score
        order by score DESC 
        skip(${+pageSize * +pageNum}) 
        limit(${pageSize})
    `
    );

    await session.close();
    await driver.close();

    return data.records.map((e) => ({
      name: e.get(0).properties.name as string,
      id: e.get(0).properties.id as string,
      nodeId: e.get(0).identity.low as number,
      weight: e.get(0).properties.weight as number,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default searchCourses;
