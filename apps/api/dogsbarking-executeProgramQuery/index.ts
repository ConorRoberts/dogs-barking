import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import { getNeo4jDriver } from "@dogs-barking/common";

interface Query extends APIGatewayProxyEventQueryStringParameters {
  programCode: string;
  name: string;
  school: string;
  sortKey: string;
  sortDir: string;
}

/**
 * @method GET
 * @description Executes a complex program query against the full program list
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<object>> => {
  console.log(event);

  const { stage } = event.requestContext;
  const driver = await getNeo4jDriver(stage);

  try {

    const query = event.queryStringParameters as Query;
    const filters = [];

    const { pageNum = 0, pageSize = 50, sortDir = "desc" } = query ?? {};

    if (!["asc", "desc"].includes(sortDir)) throw new Error("Invalid sort direction (sortDir)");

    if (query.school?.length > 0) filters.push("school.abbrev = $school");
    if (query.programCode?.length > 0) filters.push("program.id STARTS WITH $programCode");
    if (query.name?.length > 0) filters.push(`program.name STARTS WITH $name`);

    const session = driver.session();

    const { records } = await session.run(
      `
        CALL{
          MATCH (school: School)-[:OFFERS]->(program: Program)
    
          ${filters.length > 0 ? "WHERE " : ""}${filters.join(" AND ")}

          RETURN
            program
        }
        
        WITH program
        
        RETURN
            collect(properties(program))[$skip..$limit] as programs,
            count(program) as total
      `,
      {
        ...query,
        limit: neo4j.int(Number(pageNum) * Number(pageSize) + Number(pageSize)),
        skip: neo4j.int(Number(pageNum) * Number(pageSize)),
      }
    );

    await session.close();

    return {
      total: records[0].get("total").low,
      programs: records[0].get("programs"),
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await driver.close();
  }
};
