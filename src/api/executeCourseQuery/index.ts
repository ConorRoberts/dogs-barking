import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResultV2 } from "aws-lambda";

interface Query extends APIGatewayProxyEventQueryStringParameters {
  school: string;
  department: string;
  number: string;
  weight: string;
  name: string;
  description: string;
  code: string;
}

/**
 * @method GET
 * @description Executes a complex course query against the full course list
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<object>> => {
  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME as string, process.env.NEO4J_PASSWORD as string)
  );

  try {
    console.log(event);

    const query = event.queryStringParameters as Query;
    const filters = [];

    const { pageNum = 0, pageSize = 50, sortKey = "code", sortDir = "desc" } = query ?? {};

    if (!["asc", "desc"].includes(sortDir)) throw new Error("Invalid sort direction (sortDir)");

    if (query?.school?.length > 0) filters.push("s.short = $school");
    if (query?.code?.length > 0) filters.push("c.code STARTS WITH $code");
    if (query?.department?.length > 0) filters.push("c.department = $department");
    if (!isNaN(Number(query?.weight))) filters.push("c.credits = $weight");
    if (!isNaN(Number(query?.number))) filters.push("c.number = $number");
    if (query?.name?.length > 0) filters.push("c.name STARTS WITH $name");
    if (query?.description?.length > 0) filters.push(`c.description CONTAINS $description`);

    const session = driver.session();
    const { records, summary } = await session.run(
      `
        CALL{
          MATCH (c:Course) 
          
          RETURN
            c as course
          
          ORDER by c.code
        }
        
        ${filters.length > 0 ? "WHERE " : ""}${filters.join(" AND ")}

        WITH course
        
        RETURN
            collect(course)[$skip..$limit],
            count(course) as total
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

    return {
      total: records[0].get("total").low,
      courses: records.map((record) => record.get("course")),
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await driver.close();
  }
};
