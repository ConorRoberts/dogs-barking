import School from "@typedefs/School";
import getNeo4jDriver from "./getNeo4jDriver";

const getSchools = async (): Promise<School[]> => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  const data = await session.run(
    `
    MATCH (school:School)
    RETURN
      properties(school) as school,
      [
        (school)-[:OFFERS]->(program:Program) | 
        {
          program: properties(program),
          hasMajor: size([(program)-[:MAJOR_REQUIRES]->(e) | e]) > 0,
          hasMinor: size([(program)-[:MINOR_REQUIRES]->(e) | e]) > 0
        }
      ] as programs
    `
  );

  await session.close();

  return data.records.map((record) => ({
    programs: record
      .get("programs")
      .map(({ program, ...e }) => ({ ...program, ...e }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    ...record.get("school"),
  }));
};

export default getSchools;
