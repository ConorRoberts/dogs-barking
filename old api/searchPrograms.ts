import getNeo4jDriver from "@utils/getNeo4jDriver";

interface ProgramSearchResult {
  id: string;
  name: string;
  short: string;
  degree: string;
}
/**
 *
 */
const searchPrograms = async (query: string): Promise<ProgramSearchResult[]> => {
  try {
    if (typeof query !== "string") throw new Error("Query must be a string");

    const driver = getNeo4jDriver();
    const session = driver.session();

    const { records } = await session.run(
      `
        CALL db.index.fulltext.queryNodes("programSearch", 'name:${query}* OR short:"${query}"') 
        YIELD node, score
        RETURN properties(node) as program, score
        order by score DESC 
        limit(${15})
      `
    );

    await session.close();
    await driver.close();

    return records.map((e) => ({
      id: e.get("program").id as string,
      name: e.get("program").name as string,
      short: e.get("program").short as string,
      degree: e.get("program").degree as string,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default searchPrograms;
