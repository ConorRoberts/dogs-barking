import School from "@typedefs/School";
import getNeo4jDriver from "./getNeo4jDriver";

const getSchools = async (): Promise<School[]> => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  const data = await session.run(
    `
            MATCH (school:School)
            RETURN
                [(school)-[:HAS]->(major:Major) | properties(major)] AS majors,
                [(school)-[:HAS]->(minor:Minor) | properties(minor)] AS minors,
                properties(school) as school
        `
  );

  await session.close();

  return data.records.map((record) => ({
    majors: record.get("majors"),
    minors: record.get("minors"),
    ...record.get("school"),
  }));
};

export default getSchools;
