import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import School from "@dogs-barking/common/School";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * @method method POST
 * @description Updates a user's metadata in Neo4j
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<School[]>> => {
  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME as string, process.env.NEO4J_PASSWORD as string)
  );

  try {
    console.log(event);

    const { major = "", minor = "", school = "", takenCourses = [] } = JSON.parse(event.body ?? "{}");
    const { authorization } = event.headers;

    if (!authorization) throw new Error("Unauthorized");
    const { sub } = jwt.decode(authorization.replace("Bearer ", "")) as JwtPayload;

    const user = {
      major: null,
      minor: null,
      school: null,
      takenCourses: [],
    };

    let session = driver.session();
    await session.run(
      `
    MERGE (user:User {id: $userId})
    `,
      { userId: sub }
    );
    await session.close();

    // Handle major
    if (major !== "") {
      try {
        session = driver.session();

        const { records } = await session.run(
          `
        MATCH (user:User {id: $userId})
        
        WITH user
        OPTIONAL MATCH (user)-[studiesMajor:STUDIES_MAJOR]->(program: Program)
        MATCH (major: Program {id: $major})
        
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
        session = driver.session();

        const { records } = await session.run(
          `
        MATCH (user:User {id: $userId})

        WITH user
        OPTIONAL MATCH (user)-[studiesMinor:STUDIES_MINOR]->(program: Program)
        MATCH (minor: Program {id: $minor})

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
        session = driver.session();

        const { records } = await session.run(
          `
        MATCH (user:User {id: $userId})

        CALL{
          WITH user
          OPTIONAL MATCH (user)-[attends:ATTENDS]->(:School)
          DELETE attends
        }

        CALL{
          WITH user
          MATCH (school: School {id: $school})
          CREATE (user)-[:ATTENDS]->(school)
          RETURN school
        }

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

    session = driver.session();

    const { records } = await session.run(
      `
      CALL{
        MATCH (user: User {id: $userId})-[r:HAS_TAKEN]->(:Course)
        DELETE r
      }
    
      CALL{
        UNWIND $takenCourses as takenCourse
        MATCH 
          (course:Course {id: takenCourse}),
          (user:User {id: $userId})

        MERGE (user)-[:HAS_TAKEN]->(course)
      }

      CALL{
        MATCH (user:User {id: $userId})
        RETURN user
      }

      WITH user
      
      RETURN 
        properties(user) as user,
        [(user)-[:HAS_TAKEN]->(c:Course) | properties(c)] as takenCourses
        `,
      { userId: sub, takenCourses }
    );

    await session.close();
    await driver.close();

    console.log(records);

    return {
      ...records[0].get("user"),
      ...user,
      takenCourses: records[0].get("takenCourses"),
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await driver.close();
  }
};
