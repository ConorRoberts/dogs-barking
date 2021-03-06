import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

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
  const { stage } = event.requestContext;
  const secrets = new SecretsManager({});

  // Get Neo4j credentials
  const { SecretString: neo4jCredentials } = await secrets.getSecretValue({
    SecretId: `${stage}/dogsbarking/neo4j`,
  });
  const { host, username, password } = JSON.parse(neo4jCredentials ?? "{}");
  const driver = neo4j.driver(`neo4j://${host}`, neo4j.auth.basic(username, password));

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
          
          ${filters.length > 0 ? "WHERE " : ""}${filters.join(" AND ")}

          RETURN
            c as course
          
          ORDER by c.code
        }
        
        WITH course
        
        RETURN
            collect(properties(course))[$skip..$limit] as courses,
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
      courses: records[0].get("courses"),
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await driver.close();
  }
};
