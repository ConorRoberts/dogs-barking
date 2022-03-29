import { Record } from "neo4j-driver";
import getNeo4jDriver from "./getNeo4jDriver";

const getProgramPrerequisites = async(programId:string, type?:string):Promise<Record[]> => {
  const driver = getNeo4jDriver();
  const db = driver.session();
  let queryStr = ""
  switch (type) {
    case "major":
      queryStr = `
      match q=(p:Program) 
      -[:MAJOR_REQUIRES]->(course:Course)-[:HAS_PREREQUISITE|OR*0..20]->(prereq)
      where id(p) = $programId
      return nodes(q)
      `;
    break;
    case "minor":
      queryStr = `
      match q=(p:Program) 
      -[:MINOR_REQUIRES]->(course:Course)-[:HAS_PREREQUISITE|OR*0..20]->(prereq)
      where id(p) = $programId
      return nodes(q)
      `;
    break;
    case "area":
      queryStr = `
      match q=(p:Program) 
      -[:AREA_REQUIRES]->(course:Course)-[:HAS_PREREQUISITE|OR*0..20]->(prereq)
      where id(p) = $programId
      return nodes(q)
      `;
    break;
    default:
      queryStr = `
      match q=(p:Program) 
      -[:MAJOR_REQUIRES]->(course:Course)-[:HAS_PREREQUISITE|OR*0..20]->(prereq)
      where id(p) = $programId
      return nodes(q)
      `;
    break;
  }
  const data = await db.run(
    queryStr,
    { programId: +programId }
  );

  await db.close();
  await driver.close();

  return data.records;
};

export default getProgramPrerequisites;
