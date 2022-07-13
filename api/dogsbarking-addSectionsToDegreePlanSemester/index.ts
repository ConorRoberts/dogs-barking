import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from "aws-lambda";
import jwt, { JwtPayload } from "jsonwebtoken";
import neo4j from "neo4j-driver";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  semesterId: string;
}

interface Body {
  // Array of section ids
  sections: string[];
}

/**
 * @method POST
 * @description Adds a list of sections to a given degree plan semester
 */
export const handler = async (event: APIGatewayEvent): Promise<unknown> => {
  const secrets = new SecretsManager({});
  const { stage } = event.requestContext;

  // Get Neo4j credentials
  const { SecretString: neo4jCredentials } = await secrets.getSecretValue({
    SecretId: `${stage}/dogsbarking/neo4j`,
  });
  const { host, username, password } = JSON.parse(neo4jCredentials ?? "{}");
  const driver = neo4j.driver(`neo4j://${host}`, neo4j.auth.basic(username, password));

  try {
    console.log(event);

    const { sections }: Body = JSON.parse(event.body ?? "{}");
    const { semesterId } = event.pathParameters as PathParameters;
    const { authorization } = event.headers;

    if (!authorization) throw new Error("Unauthorized");
    const { sub } = jwt.decode(authorization.replace("Bearer ", "")) as JwtPayload;

    const session = driver.session();

    const { records } = await session.run(
      `
        MATCH (semester: DegreePlanSemester {id: $semesterId})

        UNWIND $sections AS section
        MATCH (c:Course)-->(s: Section {id: section})

        MERGE (semester)-[:CONTAINS]->(s)
        MERGE (semester)-[:CONTAINS]->(c)

        RETURN 
          properties(s) as section
    `,
      {
        userId: sub,
        semesterId,
        sections: sections,
      }
    );

    await session.close();

    return records.map((record) => record.get("section"));
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await driver.close();
  }
};
