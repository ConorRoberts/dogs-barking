import { v4 } from "uuid";
import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Adds a new DegreePlanSemester to a DegreePlan.
 * @param planId Plan to add the semester to
 * @returns The created semester
 */
const createDegreePlanSemester = async (planId: string) => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  try {
    const { records } = await session.run(
      `
            MATCH (dp:DegreePlan {id: $planId})
            CREATE (dp)-[:CONTAINS]->(s:DegreePlanSemester {id: $semesterId, year: $year, semester: $semester})
            RETURN properties(s) as semester
      `,
      { planId, semesterId: v4(), year: new Date().getFullYear(), semester: "winter" }
    );

    return records[0].get("semester");
  } catch (error) {
    throw Error("Could not create semester");
  }
};

export default createDegreePlanSemester;
