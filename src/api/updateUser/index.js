const neo4j = require("neo4j-driver");
const jwt = require("jsonwebtoken");

/**
 * @method method POST
 * @description Updates a user's metadata in Neo4j
 */
exports.handler = async (event) => {
  console.log(event);

  const { major = "", minor = "", school = "", takenCourses = [] } = JSON.parse(event.body ?? "{}");
  // const query = event.queryStringParameters;
  // const pathParams = event.pathParameters;
  const headers = event.headers;

  const { sub } = jwt.decode(headers.authorization.replace("Bearer ", ""));

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();

  const { records } = await session.run(
    `
        MERGE (user:User {id: $sub})
  
        WITH user
        OPTIONAL MATCH (user)-[attends:ATTENDS]->(school: School)
        DELETE attends

        WITH user
        OPTIONAL MATCH (user)-[studiesMajor:STUDIES_MAJOR]->(program: Program)
        DELETE studiesMajor

        with user
        OPTIONAL MATCH (user)-[studiesMinor:STUDIES_MINOR]->(program: Program)
        DELETE studiesMinor

        with user
        unwind $takenCourses as takenCourse
        MATCH (course:Course {id: takenCourse})
        CREATE (user)-[:HAS_TAKEN]->(course)
        
        ${
          school !== ""
            ? `with user
        OPTIONAL MATCH (school: School {id: $school})
        CREATE (user)-[:ATTENDS]->(school)`
            : ""
        }

        ${
          major !== ""
            ? `with user, school
        OPTIONAL MATCH (major: Program {id: $major})
        CREATE (user)-[:STUDIES_MAJOR]->(major)`
            : ""
        }
        
        ${
          minor !== ""
            ? `with user, school, major
        OPTIONAL MATCH (minor: Program {id: $minor})
        CREATE (user)-[:STUDIES_MINOR]->(minor)`
            : ""
        }
        
        RETURN 
          properties(user) as user,
          [(user)-[:HAS_TAKEN]->(course:Course) | properties(course)] as takenCourses,
          ${major !== "" ? "properties(major)" : "NULL"} as major,
          ${minor !== "" ? "properties(minor)" : "NULL"} as minor,
          ${school !== "" ? "properties(school)" : "NULL"} as school
        `,
    { major, minor, school, sub, takenCourses }
  );

  await session.close();
  await driver.close();

  console.log(records);

  return {
    ...records[0].get("user"),
    school: records[0].get("school"),
    major: records[0].get("major"),
    minor: records[0].get("minor"),
    takenCourses: records[0].get("takenCourses"),
  };
};
