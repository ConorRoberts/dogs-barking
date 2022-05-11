import Program from "@typedefs/Program";
import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Gets program information from DB
 * @param id ID of the program's node
 */
const getProgram = async (id: string): Promise<Program | null> => {
  const driver = getNeo4jDriver();
  const session = driver.session();

  const result = await session.run(
    `
        MATCH(program:Program {id: $id})
        RETURN properties(program) as program
      `,
    { id }
  );

  await session.close();
  await driver.close();

  return result.records[0].get("program");
};

export default getProgram;
