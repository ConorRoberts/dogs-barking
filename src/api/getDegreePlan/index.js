const neo4j = require("neo4j-driver");
const jwt = require("jsonwebtoken");

/**
 * @method GET
 * @description Gets a degree plan
 */
exports.handler = async (event) => {
  console.log(event);

  // const body = JSON.parse(event.body ?? "{}");
  // const query = event.queryStringParameters;
  const { planId } = event.pathParameters;
  const headers = event.headers;

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const { sub } = jwt.decode(headers.authorization.replace("Bearer ", ""));

  const session = driver.session();

  const { records } = await session.run(
    ` 
        MATCH (user: User)-[:HAS]->(plan: DegreePlan {id: $planId})
        RETURN 
          properties(plan) as plan,
          [(plan)-[:CONTAINS]->(semester:DegreePlanSemester) | 
            {
              semester: properties(semester),
              courses: [(semester)-[:CONTAINS]->(s:Section)<-[:HAS]->(c:Course) | 
                {
                  course: properties(c),
                  section: properties(s)
                }
              ]
          }] as semesters
    `,
    {
      id: sub,
      planId,
    }
  );

  await session.close();
  await driver.close();

  return {
    ...records[0].get("plan"),
    semesters: records[0].get("semesters").map((e) => ({ ...e.semester, courses: e.courses })),
  };
};
