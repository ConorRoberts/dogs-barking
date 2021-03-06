import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from "aws-lambda";
import neo4j from "neo4j-driver";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import { createClient } from "redis";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  programId: string;
}

/**
 * @method GET
 * @description Gets program with the given ID
 */
export const handler = async (event: APIGatewayEvent) => {
  console.log(event);

  // const body = JSON.parse(event.body ?? "{}");
  // const query = event.queryStringParameters;
  const { programId } = event.pathParameters as PathParameters;
  // const headers = event.headers;

  const { stage } = event.requestContext;
  const secrets = new SecretsManager({});

  // Get Neo4j credentials
  const { SecretString: neo4jCredentials } = await secrets.getSecretValue({
    SecretId: `${stage}/dogsbarking/neo4j`,
  });
  const { host, username, password } = JSON.parse(neo4jCredentials ?? "{}");
  const driver = neo4j.driver(`neo4j://${host}`, neo4j.auth.basic(username, password));

  let session = driver.session();

  const { records } = await session.run(
    `
        MATCH(program:Program {id: $programId})
        OPTIONAL MATCH major=(program)-[:REQUIRES|MAJOR_REQUIRES*]->(prereq)

        MATCH (school:School)-[:OFFERS]->(program)

        return 
            properties(program) as program,
            properties(school) as school,
            [n in nodes(major) | {data: properties(n), label: labels(n)[0]}] as major
      `,
    { programId }
  );
  await session.close();

  session = driver.session();
  const { records: minorRecords } = await session.run(
    `
      MATCH(program:Program {id: $programId})
      OPTIONAL MATCH minor=(program)-[:REQUIRES|MINOR_REQUIRES*]->(prereq)

      RETURN
        [n in nodes(minor) | {data: properties(n), label: labels(n)[0]}] as minor
    `,
    { programId }
  );
  await session.close();

  await driver.close();

  console.log(records);

  // This is to store the requirement tree. Object format is fastest for retrieval and duplicate prevention.
  const major = {};

  if (records[0]?.get("major") !== null) {
    records
      .map((e) => e.get("major"))
      .forEach((list) => {
        let previous;
        list.forEach((e, index) => {
          const formatted = {
            ...e.data,
            label: e.label,
            requirements: [],
          };

          if (formatted.updatedAt !== undefined) {
            formatted.updatedAt = formatted.updatedAt.low;
          }

          if (formatted.target !== undefined) {
            formatted.target = formatted.target.low;
          }

          // If this is the first element, skip it
          if (index !== 0) {
            // Are we missing this entry in our list?
            if (major[formatted.id] === undefined) major[formatted.id] = formatted;

            if (index > 1 && previous)
              major[previous.id].requirements = [...new Set([...major[previous.id].requirements, formatted.id])];
          }

          previous = formatted;
        });
      });
  }

  const minor = {};
  if (minorRecords[0]?.get("minor") !== null) {
    minorRecords
      .map((e) => e.get("minor"))
      .forEach((list) => {
        let previous;
        list.forEach((e, index) => {
          const formatted = {
            ...e.data,
            label: e.label,
            requirements: [],
          };

          if (formatted.target !== undefined) {
            formatted.target = formatted.target.low;
          }
          if (formatted.updatedAt !== undefined) {
            formatted.updatedAt = formatted.updatedAt.low;
          }

          // If this is the first element, skip it
          if (index !== 0) {
            // Are we missing this entry in our list?
            if (minor[formatted.id] === undefined) minor[formatted.id] = formatted;

            if (index > 1 && previous)
              minor[previous.id].requirements = [...new Set([...minor[previous.id].requirements, formatted.id])];
          }

          previous = formatted;
        });
      });
  }

  console.log(major);
  console.log(minor);

  const fillMajorTree = (id) => {
    const node = major[id];

    if (!node) return null;

    return {
      ...node,
      requirements: node?.requirements?.map((e) => fillMajorTree(e)).filter((e) => e !== undefined && e !== null) ?? [],
    };
  };

  const fillMinorTree = (id) => {
    const node = minor[id];

    if (!node) return null;

    return {
      ...node,
      requirements: node?.requirements?.map((e) => fillMinorTree(e)).filter((e) => e !== undefined && e !== null) ?? [],
    };
  };

  const data = {
    ...records[0].get("program"),
    school: records[0].get("school"),
    label: "Program",
    major: records
      .map((e) => fillMajorTree(e.get("major")?.length > 1 ? e.get("major")[1]?.data?.id : null))
      .map((e, index, arr) => (arr.findIndex((e2) => e2?.id === e?.id) === index ? e : null))
      .filter((e) => e !== undefined && e !== null),
    minor: minorRecords
      .map((e) => fillMinorTree(e.get("minor")?.length > 1 ? e.get("minor")[1]?.data?.id : null))
      .map((e, index, arr) => (arr.findIndex((e2) => e2?.id === e?.id) === index ? e : null))
      .filter((e) => e !== undefined && e !== null),
  };

  try {
    const { SecretString: redisCredentials } = await secrets.getSecretValue({ SecretId: `development/dogs-barking/redis` });
    const { host: redisHost } = JSON.parse(redisCredentials ?? "{}");
    const redis = createClient({ url: `redis://${redisHost}` });
    await redis.connect();

    await redis.set(programId, JSON.stringify(data));
    const redisData = await redis.get(programId);
    console.log(redisData);
    await redis.quit();
  } catch (error) {
    console.error(error);
  }

  return data;
};
