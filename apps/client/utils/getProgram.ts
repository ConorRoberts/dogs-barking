import Program from "@dogs-barking/common/types/Program";
import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Gets program information from DB
 * @param section major/minor/area
 */
const getProgram = async (nodeId: string): Promise<Program | null> => {
  try {
    const driver = getNeo4jDriver();
    const session = driver.session();
  
    const result = await session.run(
      `
        MATCH(program:Program)
        where id(program) = $nodeId 
        return program
      `,
      { nodeId: +nodeId }
    );
  
    await session.close();
    await driver.close();
  
    return { ...result.records[0].get("program").properties, nodeId };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getProgram;
