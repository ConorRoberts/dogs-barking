const jwt = require("jsonwebtoken");
const neo4j = require("neo4j-driver");

/**
 * @method GET
 * @description Get a semester with a specific id
 */
exports.handler = async (event) => {
  console.log(event);

  // const body = JSON.parse(event.body ?? "{}");
  // const query = event.queryStringParameters;
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
      MATCH (user:User {id: $userId})-->(dp:DegreePlan)-->(semester: DegreePlanSemester {id: $semesterId})-->(c:Course)
      
      RETURN
        [(c)-->(s:Section)<--(semester) | 
          {
            course: properties(c),
            section: properties(s)
          }
        ] as courses,
        properties(semester) as semester
      `,
    { userId: sub, semesterId }
  );

  await session.close();
  await driver.close();

  return {
    ...records[0].get("semester"),
    courses: records[0].get("courses").map((record) => record.map(({ course, section }) => ({ ...course, section }))),
  };
};
