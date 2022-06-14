import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import Program from "@dogs-barking/common/Program";
import School from "@dogs-barking/common/School";

/**
 * @method GET
 * @description Gets all schools from our DB
 */

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<School[]>> => {
  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME as string, process.env.NEO4J_PASSWORD as string)
  );

  try {
    console.log(event);

    const session = driver.session();

    const data = await session.run(
      `
    MATCH (school:School)
    RETURN
      properties(school) as school,
      [
        (school)-[:OFFERS]->(program:Program) | 
        {
          program: properties(program),
          hasMajor: size([(program)-[:MAJOR_REQUIRES]->(e) | e]) > 0,
          hasMinor: size([(program)-[:MINOR_REQUIRES]->(e) | e]) > 0
        }
      ] as programs
    `
    );

    await session.close();

    return data.records.map((record) => ({
      programs: record
        .get("programs")
        .map(({ program, ...e }: { program: Program }) => ({ ...program, ...e }))
        .sort((a: Program, b: Program) => a.name.localeCompare(b.name)),
      ...record.get("school"),
    }));
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await driver.close();
  }
};
