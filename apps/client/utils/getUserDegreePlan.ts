import getNeo4jDriver from "./getNeo4jDriver";
import { v4 } from "uuid";

const getUserDegreePlan = async (userId: string) => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  try {
    // Does the user already have a plan?
    const { records } = await session.run(
      `
            MATCH (u:User {id: $userId})
            MATCH (u)-[:HAS_DEGREE_PLAN]->(dp:DegreePlan)
            RETURN properties(dp) as plan, [(dp)-[:CONTAINS_SEMESTER]->(s:DegreePlanSemester) | properties(s)] as semesters
        `,
      { userId }
    );

    return { ...records[0].get("plan"), semesters: records[0].get("semesters") };
  } catch (error) {
    // User must not have a plan, create one
    try {
      const { records } = await session.run(
        `
            MATCH (u:User {id: $userId})
            MERGE (u)-[:HAS_DEGREE_PLAN]->(dp:DegreePlan {id: $planId})
            RETURN properties(dp) as plan, [(dp)-[:CONTAINS_SEMESTER]->(s:DegreePlanSemester) | properties(s)] as semesters
        `,
        { userId, planId: v4() }
      );

      return { ...records[0].get("plan"), semesters: records[0].get("semesters") };
    } catch (e) {
      return null;
    }
  } finally {
    await session.close();
  }
};

export default getUserDegreePlan;
