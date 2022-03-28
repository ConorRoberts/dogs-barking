import getNeo4jDriver from "./getNeo4jDriver";

const getProgramRequireds = async (programId: string): Promise<any[]>=> {
  const driver = getNeo4jDriver();
  const db2 = driver.session();
  const program_specific = await db2.run(
    `
        match q=(p:Program) 
        -[:MAJOR_REQUIRES]->(course:Course) 
        where id(p) = $programId 
        return nodes(q)
        `,
    { programId: +programId }
  );
    
  await db2.close();
  await driver.close();
  return program_specific.records;
};

export default getProgramRequireds;