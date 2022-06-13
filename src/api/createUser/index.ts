const neo4j = require("neo4j-driver");
const jwt = require("jsonwebtoken");

/**
 * @method POST
 * @description Creates metadata for a Cognito user within Neo4j
 */
exports.handler = async (event) => {
  console.log(event);

  // const body = JSON.parse(event.body ?? "{}");
  // const query = event.queryStringParameters;
  // const pathParams = event.pathParameters;
  const headers = event.headers;

  const { sub, birthdate, name, email } = jwt.decode(headers.authorization.replace("Bearer ", ""));

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();

  const { records } = await session.run(
    `
        MERGE (user: User {
            id: $sub,
            email: $email,
            birthdate: date($birthdate),
            name: $name,
            school: $school,
            major: $major,
            minor: $minor
        })

        return properties(user) as user
    `,
    { sub, email, name, birthdate: birthdate.slice(0, 10), major: "", minor: "", school: "" }
  );

  await session.close();
  await driver.close();

  return records[0].get("user");
};
