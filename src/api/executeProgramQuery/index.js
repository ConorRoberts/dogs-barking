const neo4j = require("neo4j-driver");

/**
* @method GET
* @description Executes a complex program query against the full program list
*/
exports.handler = async (
  event
) => {
  console.log(event);

  // const body = JSON.parse(event.body ?? "{}");
  const query = event.queryStringParameters;
  // const pathParams = event.pathParameters;
  // const headers = event.headers;

  let str = "WHERE";
  if (query.school?.length > 0) str += " school.abbrev = $school AND";
  if (query.programId?.length > 0) str += " program.id STARTS WITH $programId AND";
  if (query.name?.length > 0) str += ` program.name STARTS WITH $name`;


  // Remove trailing 'WHERE' or 'AND' if any
  const index = str.lastIndexOf(" ");
  const lastWord = str.substring(index + 1, str.length);
  if (lastWord === "WHERE" || lastWord === "AND") {
    str = str.substring(0, index);
  }

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();

  const { records } = await session.run(
    `
            MATCH (school: School)-[:OFFERS]->(program: Program)
      
            ${str}
      
            with collect(program) as programs, count (program) as total
            unwind programs as program
            return properties(program), total.low as total
            
            ${query.sortKey?.length > 0 && ["asc", "desc"].includes(query.sortDir) ? `ORDER BY $sortKey $sortDir` : ""}
              
            SKIP($skip)
            LIMIT($limit)
        `,
    { ...query, sortKey: `program.${query.sortKey}`, limit: Number(query.pageSize), skip: Number(query.pageNum) * Number(query.pageSize) }
  );

  await session.close();
  await driver.close();

  return records.map((e) => ({ ...e.get("program"), total: e.get("total") }));
};