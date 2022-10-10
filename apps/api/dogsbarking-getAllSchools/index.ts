import neo4j from "neo4j-driver";
import { APIGatewayEvent } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

/**
 * @method GET
 * @description Gets all schools from our DB
 */

export const handler = async (event: APIGatewayEvent): Promise<unknown> => {
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
        .map(({ program, ...e }: { program: object }) => ({ ...program, ...e }))
        .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name)),
      ...record.get("school"),
    }));
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await driver.close();
  }
};
