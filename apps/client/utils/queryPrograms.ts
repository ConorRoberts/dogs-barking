/* eslint-disable indent */

import ProgramQuery from "@dogs-barking/common/types/ProgramQuery";
import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Excecutes a complex query to get all courses based on search criteria
 * @param query
 */
const queryPrograms = async (query: ProgramQuery) => {
  const driver = getNeo4jDriver();
  const db = driver.session();
  const data = await db.run(
      `
      MATCH (school: School)-[:OFFERS]->(program: Program)
      ${query.school?.length > 0 ? "WHERE school.abbrev = $school" : ""}
      ${query.programId?.length > 0 ? "WHERE program.id STARTS WITH $programId" : ""}
      ${query.name?.length > 0 ? `WHERE program.name STARTS WITH $name` : ""}
      with collect(program) as programs, count (program) as total
      unwind programs as program
      return program, id(program) as nodeId, total
      
      ${
          query.sortKey?.length > 0 && ["asc", "desc"].includes(query.sortDir)
          ? `ORDER BY program.${query.sortKey} ${query.sortDir}`
          : ""
        }
        
        SKIP(${+query.pageNum * +query.pageSize})
        LIMIT(${+query.pageSize})
        `,
        query
  );
  await db.close();
  await driver.close();

  return data.records.map((e) => ({ ...e.get("program").properties, nodeId: e.get("nodeId").low, total: e.get("total").low}));
};

export default queryPrograms;
