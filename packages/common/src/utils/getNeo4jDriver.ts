import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import neo4j from "neo4j-driver";

const getNeo4jDriver = async (stage: string) => {
  const secrets = new SecretsManager({ region: "us-east-1" });

  const { SecretString: neo4jCredentials } = await secrets.getSecretValue({
    SecretId: `${stage}/dogsbarking/neo4j`,
  });

  if (!neo4jCredentials) {
    throw new Error("Could not get Neo4j credentials from Secrets Manager");
  }

  const { host, username, password } = JSON.parse(neo4jCredentials);

  const driver = neo4j.driver(`neo4j://${host}`, neo4j.auth.basic(username, password));

  return driver;
};

export default getNeo4jDriver;
