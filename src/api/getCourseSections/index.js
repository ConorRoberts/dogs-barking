const neo4j = require("neo4j-driver");

/**
 * @method GET
 * @description Gets the sections for the given course id
 */
exports.handler = async (event) => {
  console.log(event);

  const { courseId } = event.pathParameters;

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();
  const { records } = await session.run(
    `
    MATCH (course: Course {id: $courseId})-[:HAS]->(section: Section)

    return properties(section) as section
  `,
    { courseId }
  );

  await session.close();
  await driver.close();

  return records.map((e) => e.get("section"));
};
