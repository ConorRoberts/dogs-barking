import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResultV2 } from "aws-lambda";


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
  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME as string, process.env.NEO4J_PASSWORD as string)
  );

  try {
    console.log(event);

    const query = event.queryStringParameters as Query;

    let str = "WHERE";
    if (query.school?.length > 0) str += " school.abbrev = $school AND";
    if (query.programCode?.length > 0) str += " program.id STARTS WITH $programCode AND";
    if (query.name?.length > 0) str += ` program.name STARTS WITH $name`;

    // Remove trailing 'WHERE' or 'AND' if any
    const index = str.lastIndexOf(" ");
    const lastWord = str.substring(index + 1, str.length);
    if (lastWord === "WHERE" || lastWord === "AND") {
      str = str.substring(0, index);
    }

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
      {
        ...query,
        sortKey: `program.${query.sortKey}`,
        limit: Number(query.pageSize),
        skip: Number(query.pageNum) * Number(query.pageSize),
      }
    );

    await session.close();
    await driver.close();

    return records.map((e) => ({ ...e.get("program"), total: e.get("total") }));
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await driver.close();
  }
};
