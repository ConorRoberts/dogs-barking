const neo4j = require("neo4j-driver");

/**
* @method GET
* @description Executes a complex course query against the full course list
*/
exports.handler = async (
  event
) => {
  console.log(event);

  // const body = JSON.parse(event.body ?? "{}");
  const query = event.queryStringParameters;
  // const pathParams = event.pathParameters;
  // const headers = event.headers;

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();
  const filters = [];

  if (query?.degree?.length > 0) filters.push("program.degree = $degree");
  if (query?.school?.length > 0) filters.push("school.short = $school");
  if (query?.scope === "undergrad") filters.push("course.number < 5000");
  if (query?.scope === "grad") filters.push("course.number > 5000");
  if (query?.code?.length > 0) filters.push("course.code STARTS WITH $code");
  if (query?.department?.length > 0) filters.push("course.department = $department");
  if (!isNaN(query?.weight)) filters.push("course.credits = $weight");
  if (!isNaN(query?.number)) filters.push("course.number = $number");
  if (query?.name?.length > 0) filters.push("course.name STARTS WITH $name");
  if (query?.description?.length > 0) filters.push("course.description =~ \".*${query.description}.*\"");

  const { records } = await session.run(
    `
      MATCH (school:School)
      -[:OFFERS]->
      ${query?.degree?.length > 0 ? "(program: Program)-[:MAJOR_REQUIRES]->" : ""}
      (course: Course)
      ${query?.prerequisites?.length > 0
      ? `-[:HAS_PREREQUISITE]->(pc: Course) WHERE pc.id IN $prerequisites`
      : ""
    }

      ${filters.join(" AND ")}

      with collect(course) as courses, count (course) as total
      unwind courses as course
      return properties(course) as course, total.low as total
      ${(query?.sortKey?.length > 0 && ["asc", "desc"].includes(query.sortDir))
      ? `ORDER BY $sortKey $sortDir`
      : ""
    }

      SKIP $skip
      LIMIT $limit
    `,
    { ...query, sortKey: `course.${query?.sortKey}`, limit: Number(query?.pageSize), skip: Number(query?.pageNum) * Number(query?.pageSize) }
  );
  await db.close();
  await driver.close();

  return records.map((e) => ({ ...e.get("course"), total: e.get("total") }));
};