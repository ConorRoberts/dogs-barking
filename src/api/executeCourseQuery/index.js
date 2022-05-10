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

    let str = "WHERE";

    if (query.degree?.length > 0) str += " program.degree = $degree AND";
    if (query.school?.length > 0) str += " school.short = $school AND";
    if (query.scope === "undergrad") str += " course.number < 5000 AND";
    if (query.scope === "grad") str += " course.number > 5000 AND";
    if (query.code?.length > 0) str += " course.code STARTS WITH $code AND";
    if (query.department?.length > 0) str += " course.department = $department AND";
    if (!isNaN(query.weight)) str += " course.credits = $weight AND";
    if (!isNaN(query.number)) str += " course.number = $number AND";
    if (query.name?.length > 0) str += " course.name STARTS WITH $name AND";
    if (query.description?.length > 0) str += " course.description =~ \".*${query.description}.*\"";

    // Remove trailing 'WHERE' or 'AND' if any
    const index = str.lastIndexOf(" ");
    const lastWord = str.substring(index + 1, str.length);

    if (lastWord === "WHERE" || lastWord === "AND")
        str = str.substring(0, index);

    const data = await session.run(
        `
      MATCH (school:School)
      -[:OFFERS]->
      ${query.degree?.length > 0 ? "(program: Program)-[:MAJOR_REQUIRES]->" : ""}
      (course: Course)
      ${query.prerequisites?.length > 0
            ? `-[:HAS_PREREQUISITE]->(pc: Course) WHERE pc.id IN $prerequisites`
            : ""
        }

      ${str}

      with collect(course) as courses, count (course) as total
      unwind courses as course
      return properties(course) as course, total.low as total
      ${query.sortKey?.length > 0 && ["asc", "desc"].includes(query.sortDir)
            ? `ORDER BY $sortKey $sortDir`
            : ""
        }

      SKIP($skip)
      LIMIT($limit)
    `,
        { ...query, sortKey: `course.${query.sortKey}`, limit: Number(query.pageSize), skip: Number(query.pageNum) * Number(query.pageSize) }
    );
    await db.close();
    await driver.close();

    return data.records.map((e) => ({ ...e.get("course"), total: e.get("total") }));
};