import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import School from "@dogs-barking/common/School";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  schoolId: string;
}

/**
 * @method GET
 * @description Get returns a school with the given ID from Neo4j
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<School>> => {
  const { stage } = event.requestContext;
  const { schoolId } = event.pathParameters as PathParameters;
  const secrets = new SecretsManager({});

  // Get Neo4j credentials
  const { SecretString: neo4jCredentials } = await secrets.getSecretValue({
    SecretId: `${stage}/dogsbarking/neo4j`,
  });
  const { host, username, password } = JSON.parse(neo4jCredentials ?? "{}");
  const driver = neo4j.driver(`neo4j://${host}`, neo4j.auth.basic(username, password));
  try {
    console.log(event);

    const session = driver.session();
    const { records } = await session.run(
      `
      MATCH (school:School {id: $schoolId}) 
      
      RETURN properties(school) as school
      `,
      { schoolId }
    );
    const { records: stats } = await session.run(
      `
      MATCH (school:School {id: $schoolId})
      RETURN
        coalesce(school.city, school.location, "") as city,
        size([(school)-[:OFFERS]->(course:Course) | course]) as courseCount,
        coalesce(school.enrolled, school.studentCount, school.students, school.enrollment, school.student_count, 0) as studentCount
      `,
      { schoolId }
    );
    await session.close();
    await driver.close();

    const school = records[0].get("school") as School;
    const city = (stats[0].get("city") as string | undefined) ?? "";
    const toNumber = (value: unknown) => Number((value as { low?: number })?.low ?? value) || 0;

    return {
      ...school,
      city,
      courseCount: toNumber(stats[0].get("courseCount")),
      studentCount: toNumber(stats[0].get("studentCount")),
    } as School;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await driver.close();
  }
};
