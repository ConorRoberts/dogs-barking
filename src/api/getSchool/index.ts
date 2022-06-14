import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import School from "@dogs-barking/common/School";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  schoolId: string;
}

/**
 * @method GET
 * @description Get returns a school with the given ID from Neo4j
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<School>> => {
  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME as string, process.env.NEO4J_PASSWORD as string)
  );

  try {
    console.log(event);

    const { schoolId } = event.pathParameters as PathParameters;

    const session = driver.session();
    const { records } = await session.run(
      `
    MATCH (school:School {id: $schoolId}) 
  
    RETURN properties(school) as school
    `,
      { schoolId }
    );
    await session.close();
    await driver.close();

    return records[0].get("school");
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await driver.close();
  }
};
