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

  const { pageNum = 0, pageSize = 50, sortKey = "code", sortDir = "desc", limit = 50, skip = 0 } = query ?? {};

  if (query?.degree?.length > 0) filters.push("program.degree = $degree");
  if (query?.school?.length > 0) filters.push("school.short = $school");
  if (query?.scope === "undergrad") filters.push("course.number < 5000");
  if (query?.scope === "grad") filters.push("course.number > 5000");
  if (query?.code?.length > 0) filters.push("course.code STARTS WITH $code");
  if (query?.department?.length > 0) filters.push("course.department = $department");
  if (!isNaN(query?.weight)) filters.push("course.credits = $weight");
  if (!isNaN(query?.number)) filters.push("course.number = $number");
  if (query?.name?.length > 0) filters.push("course.name STARTS WITH $name");
  if (query?.description?.length > 0) filters.push(`course.description =~ ".*${query.description}.*"`);

  const session = driver.session();
  const { records } = await session.run(
    `
    MATCH (school:School)-[:OFFERS]->(course:Course) 

    WITH collect(course) AS courses, COUNT (course) AS total
    UNWIND courses as course
    
    WITH [(s:School)-[:OFFERS]->(course) | {course:properties(course),school:s.name}][0] as courses, total
    
    RETURN COLLECT(courses)[$skip..$limit] AS courses,total
    `,
    {
      ...query,
      sortKey: `course.${sortKey}`,
      limit: neo4j.int(pageSize),
      skip: neo4j.int(pageNum * pageSize),
      sortDir,
    }
  );
  await session.close();
  await driver.close();

  return {
    total: records[0].get("total").low,
    courses: records[0].get("courses"),
  };
};
