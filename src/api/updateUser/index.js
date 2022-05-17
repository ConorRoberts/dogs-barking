const neo4j = require("neo4j-driver");
const jwt = require("jsonwebtoken");

/**
 * @method method POST
 * @description Updates a user's metadata in Neo4j
 */
exports.handler = async (event) => {
  console.log(event);

  const { major = "", minor = "", school = "", takenCourses = [] } = JSON.parse(event.body ?? "{}");
  const headers = event.headers;

  const { sub } = jwt.decode(headers.authorization.replace("Bearer ", ""));

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  let user = {
    major: null,
    minor: null,
    school: null,
    takenCourses: [],
  };

  // Handle major
  if (major !== "") {
    try {
      const session = driver.session();

      const { records } = await session.run(
        `
        MATCH (user:User {id: $userId})
        
        OPTIONAL MATCH 
        (user)-[studiesMajor:STUDIES_MAJOR]->(program: Program),
        (major: Program {id: $major})
        
        DELETE studiesMajor
        CREATE (user)-[:STUDIES_MAJOR]->(major)
        
        RETURN properties(major) as major
        `,
        { userId: sub, major }
      );

      await session.close();

      user.major = records[0].get("major");
    } catch (error) {
      console.error(error);
    }
  }

  // Handle minor
  if (minor !== "") {
    try {
      const session = driver.session();

      const { records } = await session.run(
        `
        MATCH (user:User {id: $userId})

        OPTIONAL MATCH 
        (user)-[studiesMinor:STUDIES_MINOR]->(program: Program),
        (minor: Program {id: $minor})

        DELETE studiesMinor
        CREATE (user)-[:STUDIES_MINOR]->(minor)

        RETURN properties(minor) as minor
      `,
        { userId: sub, minor }
      );

      await session.close();

      user.minor = records[0].get("minor");
    } catch (error) {
      console.error(error);
    }
  }

  // Handle school
  if (school !== "") {
    try {
      const session = driver.session();

      const { records } = await session.run(
        `
        MATCH (user:User {id: $userId})

        OPTIONAL MATCH 
        (user)-[attends:ATTENDS]->(school: School),
        (school: School {id: $school})

        DELETE attends
        CREATE (user)-[:ATTENDS]->(school)

        RETURN properties(school) as school
      `,
        { userId: sub, school }
      );

      await session.close();

      user.school = records[0].get("school");
    } catch (error) {
      console.error(error);
    }
  }

  const session = driver.session();

  const { records } = await session.run(
    `
        UNWIND $takenCourses as takenCourse
        MATCH (course:Course {id: takenCourse})

        MERGE (user:User {id: $userId})
        
        CREATE (user)-[:HAS_TAKEN]->(course)

        RETURN 
          properties(user) as user,
          [(user)-[:HAS_TAKEN]->(course:Course) | properties(course)] as takenCourses,
        `,
    { userId: sub, takenCourses }
  );

  await session.close();
  await driver.close();

  // Update our user object
  user = {
    ...records[0].get("user"),
    takenCourses: records[0].get("takenCourses"),
    ...user,
  };

  console.log(records);

  return {
    ...records[0].get("user"),
    school: records[0].get("school"),
    major: records[0].get("major"),
    minor: records[0].get("minor"),
    takenCourses: records[0].get("takenCourses"),
  };
};
