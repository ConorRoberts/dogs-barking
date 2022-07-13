import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import jwt, { JwtPayload } from "jsonwebtoken";
import neo4j from "neo4j-driver";
import { PlannerSemesterData } from "@dogs-barking/common/DegreePlan";
import { v4 } from "uuid";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  planId: string;
}

interface Body {
  // Array of section ids
  data: PlannerSemesterData;
}

/**
 * @method method POST
 * @description Creates a new semester in a degree plan
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<PlannerSemesterData>> => {
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

    const { planId } = event.pathParameters as PathParameters;
    const { authorization } = event.headers;
    const { data }: Body = JSON.parse(event.body ?? "{}");

    if (planId === undefined || typeof planId !== "string") throw new Error("Invalid id");

    if (!authorization) throw new Error("Unauthorized");
    const { sub } = jwt.decode(authorization.replace("Bearer ", "")) as JwtPayload;

    const session = driver.session();

    const { records } = await session.run(
      `
          MATCH (user: User {id: $userId})-[]->(dp:DegreePlan {id: $planId})

          CREATE (dp)-[:CONTAINS]->(s:DegreePlanSemester $data)

          RETURN properties(s) as semester
      `,
      {
        planId,
        userId: sub,
        data: {
          year: data?.year ?? new Date().getFullYear(),
          semester: data?.semester.toLowerCase() ?? "winter",
          id: v4(),
        },
      }
    );

    return {
      ...records[0].get("semester"),
      courses: [],
    };
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await driver.close();
  }
};
