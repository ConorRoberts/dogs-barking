import Course from "@dogs-barking/common/types/Course";
import getNeo4jDriver from "./getNeo4jDriver";

/**
 *
 * @param programId
 * @returns
 */
const getProgramCourses = async (programId: string): Promise<{ major: Course[] }> => {
  const driver = getNeo4jDriver();
  const db = driver.session();

  const queryData = await db.run(
    `
        match (p:Program) 
        -[:MAJOR_REQUIRES]->(course:Course)
        where id(p) = $programId
        return course
      `,
    { programId: +programId }
  );

  await db.close();
  await driver.close();

  return {
    major: queryData.records.map((e) => ({ ...e.get("course").properties, nodeId: e.get("course").identity.low })),
  };
};

export default getProgramCourses;
