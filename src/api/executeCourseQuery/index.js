const neo4j = require("neo4j-driver");

/**
 * @method GET
 * @description Executes a complex course query against the full course list
 */
exports.handler = async (event) => {
  console.log(event);

  const query = event.queryStringParameters;

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const filters = [];

  const { pageNum = 0, pageSize = 50, sortKey = "code", sortDir = "desc" } = query ?? {};

  if (!["asc", "desc"].includes(sortDir)) throw new Error("Invalid sort direction (sortDir)");

  if (query?.school?.length > 0) filters.push("s.short = $school");
  if (query?.code?.length > 0) filters.push("c.code STARTS WITH $code");
  if (query?.department?.length > 0) filters.push("c.department = $department");
  if (!isNaN(query?.weight)) filters.push("c.credits = $weight");
  if (!isNaN(query?.number)) filters.push("c.number = $number");
  if (query?.name?.length > 0) filters.push("c.name STARTS WITH $name");
  if (query?.description?.length > 0) filters.push(`c.description CONTAINS $description`);

  const session = driver.session();
  const { records, summary } = await session.run(
    `
      MATCH (s:School)-[:OFFERS]->(c:Course) 

      ${filters.length > 0 ? "WHERE " : ""}${filters.join(" AND ")}

      WITH count(c) as total, properties(c) as course
      
      RETURN DISTINCT
        properties(c) as course,
        total

      ORDER BY course.code ${sortDir}
      SKIP $skip
      LIMIT $limit
    `,
    {
      ...query,
      number: parseInt(query?.number),
      sortKey: `course.${sortKey}`,
      limit: neo4j.int(Number(pageNum) * Number(pageSize) + Number(pageSize)),
      skip: neo4j.int(Number(pageNum) * Number(pageSize)),
    }
  );

  console.log(summary);

  await session.close();
  await driver.close();

  return {
    total: records[0].get("total").low,
    courses: records.map((record) => record.get("course")),
  };
};
