import getNeo4jDriver from "./getNeo4jDriver";

/**
 * 
 * @param programId 
 * @returns 
 */
const getProgramCourses = async (programId: string) => {
  const driver = getNeo4jDriver();
  const db = driver.session();

  const queryData = await db.run(
    `
        match (p:Program) 
        -[:MAJOR_REQUIRES]->(course:Course)
        where id(p) = $programId
        return p,course
      `,
    { programId: +programId }
  );

  await db.close();
  await driver.close();

  return { major: queryData.records.map((e) => ({ course: e.get("course").properties })) };
};

export default getProgramCourses;
