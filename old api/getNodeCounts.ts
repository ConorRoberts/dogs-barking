import getNeo4jDriver from "../src/client/utils./../../old api/getNeo4jDriver";

/**
 * @returns Number of nodes per type in the database
 */
const getNodeCounts = async (): Promise<{ courses: number; programs: number }> => {
  const driver = getNeo4jDriver();
  const session = driver.session();

  const result = await session.run(
    `
    MATCH (course:Course)
    WITH count(course) as count
      RETURN 'courses' as label, count
    UNION ALL
    MATCH (program:Program)
    WITH count(program) as count
      RETURN 'programs' as label, count
    `
  );

  await session.close();
  await driver.close();

  return Object.fromEntries(result.records.map((record) => [record.get("label"), record.get("count").low]));
};

export default getNodeCounts;
