import Program from "@dogs-barking/common/types/Program";
import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Gets the full list of programs
 * @returns List of programs
 */
const getPrograms = async (): Promise<Program[]> => {
  const driver = getNeo4jDriver();
  const session = driver.session();

  const data = await session.run(`
        MATCH (program:Program)
        return program
    `);

  await session.close();
  await driver.close();

  return data.records.map((e) => e.get(0).properties);
};

export default getPrograms;
