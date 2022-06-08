const neo4j = require("neo4j-driver");
const jwt = require("jsonwebtoken");
const { LambdaClient, AddLayerVersionPermissionCommand } = require("@aws-sdk/client-lambda");

const client = new LambdaClient({ region: "us-east-1" });

/**
 * @param requirement The requirement in question
 * @param taken List of requirements already met
 * @returns Whether or not the requirement is met
 */
const isRequirementMet = (requirement, taken = []) => {
  if (!requirement) return false;

  const { id, label } = requirement;
  if (label === "Course") {
    // This is a course and the user has taken this course
    return taken.some((e) => e.id === id);
  } else if (label === "OrBlock") {
    const block = requirement;
    if (block?.type === "course") {
      // The user has taken target number of courses
      return block.requirements.filter((e) => taken.some((e2) => e2.id === e.id)).length === block.target;
    } else if (block.type === "credit") {
      // The user has taken target number of credits
      return (
        block.requirements.filter((e) => taken.some((e2) => e2.id === e.id)).reduce((a, b) => a + b.credits, 0) >=
        block.target
      );
    }
  } else if (label === "CreditRequirement") {
    const block = requirement;
    return taken.reduce((a, b) => a + b.credits, 0) >= block.value;
  }

  return false;
};

/**
 * @method method
 * @description description
 */
exports.handler = async (event) => {
  console.log(event);

  // const body = JSON.parse(event.body ?? "{}");
  // const query = event.queryStringParameters;
  const { planId } = event.pathParameters;
  const { authorization } = event.headers;

  const { sub } = jwt.decode(authorization.replace("Bearer ", ""));

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  let session = driver.session();
  const { records: takenCourses } = await session.run(
    `
      MATCH (user:User {id:$userId})-[:HAS_TAKEN]->(c:Course)
      RETURN collect(properties(c)) as courses
  `,
    { userId: sub, planId }
  );
  await session.close();

  session = driver.session();
  const { records: semesters } = await session.run(
    `
      MATCH (:User {id:$userId})-[:HAS]->(:DegreePlan {id:$planId})-[:CONTAINS]->(s:DegreePlanSemester)-[:CONTAINS]->(c:Course)

      RETURN 
        properties(s) as semester,
        collect(properties(c)) as courses
`,
    { planId, userId: sub }
  );
  await session.close();

  session = driver.session();
  const { records: userData } = await session.run(
    `
        MATCH (u:User {id:$userId})

        OPTIONAL MATCH (u)-[:STUDIES_MAJOR]->(p1:Program)
        OPTIONAL MATCH majorPath=(p1)-[:REQUIRES|MAJOR_REQUIRES*]->(prereq)
        
        OPTIONAL MATCH (u)-[:STUDIES_MINOR]->(:Program)
        OPTIONAL MATCH minorPath=(p1)-[:REQUIRES|MAJOR_REQUIRES*]->(prereq)

        MATCH (school:School)-[:OFFERS]->(program)
        OPTIONAL MATCH (program)-[:HAS_RATING]->(rating:Rating)

        return 
            properties(program) as program,
            properties(school) as school,
            [n in nodes(path) | {data: properties(n), label: labels(n)[0]}] as requirements

        RETURN
          properties(major) as major,
          properties(minor) as minor
      `,
    { userId: sub }
  );
  await session.close();

  const requirements = await driver.close();

  return {
    valid: false,
    errors: [],
  };
};
