import getNeo4jDriver from "./getNeo4jDriver";

const getProgramPrerequisites = async(programId:string):Promise<any[]> => {
  const driver = getNeo4jDriver();
  const db = driver.session();

  const data = await db.run(
    `
        match q=(p:Program) 
        -[:MAJOR_REQUIRES]->(course:Course)-[:HAS_PREREQUISITE|OR*0..20]->(prereq)
        where id(p) = $programId
        return nodes(q)
      `,
    { programId: +programId }
  );

  await db.close();
  await driver.close();

  return data.records;
};

export default getProgramPrerequisites;
