import School from "@typedefs/School";
import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Get the school object associated with a given course
 * @param programNodeId ID of the program node in the DB
 * @returns
 */
const getProgramSchool = async (programNodeId: string): Promise<School> => {
  const driver = getNeo4jDriver();

  const session = driver.session();
  const data = await session.run(
    `
        MATCH(school:School)-[:OFFERS]->(program:Program)
        where id(program) = $nodeId 
        return school
        `,
    { nodeId: +programNodeId }
  );
  await session.close();
  await driver.close();

  return data.records[0].get("school").properties;
};

export default getProgramSchool;
