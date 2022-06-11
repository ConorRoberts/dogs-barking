const jwt = require("jsonwebtoken");
const neo4j = require("neo4j-driver");

/**
 * @method POST
 * @description Adds a list of sections to a given degree plan semester
 */
exports.handler = async (event) => {
  console.log(event);

  const { sections } = JSON.parse(event.body ?? "{}");
  //   const query = event.queryStringParameters;
  const { semesterId } = event.pathParameters;
  const { authorization } = event.headers;

  const { sub } = jwt.decode(authorization.replace("Bearer ", ""));

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();

  const { records } = await session.run(
    `
        MATCH (semester: DegreePlanSemester {id: $semesterId})

        UNWIND $sections AS section
        MATCH (c:Course)-->(s: Section {id: section})

        MERGE (semester)-[:CONTAINS]->(s)
        MERGE (semester)-[:CONTAINS]->(c)

        RETURN 
          properties(s) as section
    `,
    {
      userId: sub,
      semesterId,
      sections: sections,
    }
  );

  await session.close();
  await driver.close();

  return records.map((record) => record.get("section"));
};
