import getNeo4jDriver from "./getNeo4jDriver";

const getProgramRequireds = async (programId: string, type:string): Promise<any[]>=> {
  const driver = getNeo4jDriver();
  const db2 = driver.session();
  let queryStr = "";
  switch (type) {
    case "major":
      queryStr = `
      match q=(p:Program) 
      -[:MAJOR_REQUIRES]->(course:Course) 
      where id(p) = $programId 
      return nodes(q)
      `;
    break;
    case "minor":
      queryStr = `
      match q=(p:Program) 
      -[:MINOR_REQUIRES]->(course:Course) 
      where id(p) = $programId 
      return nodes(q)
      `;
    break;
    case "area":
      queryStr = `
      match q=(p:Program) 
      -[:AREA_REQUIRES]->(course:Course) 
      where id(p) = $programId 
      return nodes(q)
      `;
    break;
  }
  const program_specific = await db2.run(
    queryStr,
    { programId: +programId }
  );
    
  await db2.close();
  await driver.close();
  return program_specific.records;
};

export default getProgramRequireds;