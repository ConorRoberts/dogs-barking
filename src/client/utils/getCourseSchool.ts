import School from "@typedefs/School";
import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Get the school object associated with a given course
 * @param courseNodeId ID of the course node in the DB
 * @returns
 */
const getCourseSchool = async (courseNodeId: string): Promise<School> => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  const data = await session.run(
    `
        MATCH(school:School)-[:OFFERS]->(course:Course)
        where id(course) = $nodeId 
        return school,id(school) as nodeId
        `,
    { nodeId: +courseNodeId }
  );

  await session.close();
  await driver.close();

  return { ...data.records[0].get("school").properties, nodeId: data.records[0].get("nodeId").toString() };
};

export default getCourseSchool;
