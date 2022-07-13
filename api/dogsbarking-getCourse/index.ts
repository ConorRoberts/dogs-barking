import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import Course from "@dogs-barking/common/Course";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

/**
 * @method GET
 * @description Gets the course with the given id
 */
interface PathParameters extends APIGatewayProxyEventPathParameters {
  courseId: string;
}

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2> => {
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

    const { courseId } = event.pathParameters as PathParameters;

    if (courseId === undefined || typeof courseId !== "string") throw new Error("Invalid courseId");

    const session = driver.session();

    const { records } = await session.run(
      `
        MATCH (course:Course {id: $courseId})
        OPTIONAL MATCH path=(course)-[:REQUIRES*]->(prereq)

        MATCH (school:School)-[:OFFERS]->(course)
        OPTIONAL MATCH (:User)-[rating:RATED]->(course)

        return 
            properties(course) as course,
            properties(school) as school,
            [n in nodes(path) | {data: properties(n), label: labels(n)[0]}] as requirements,
            avg(rating.difficulty) as difficulty,
            avg(rating.timeSpent) as timeSpent,
            avg(rating.usefulness) as usefulness,
            count(rating) as ratingCount
      `,
      { courseId }
    );

    console.log(records[0].get("course"));

    await session.close();
    await driver.close();

    // This is to store the requirement tree. Object format is fastest for retrieval and duplicate prevention.
    const requirements: any = {};

    if (records[0]?.get("requirements") !== null) {
      records
        .map((e) => e.get("requirements"))
        .forEach((list: any[]) => {
          let previous: Course | undefined;
          list.forEach((e, index) => {
            const formatted: Course = {
              ...e.data,
              label: e.label,
              requirements: [],
            };

            // If this is the first element, skip it
            if (index !== 0) {
              // Are we missing this entry in our list?
              if (requirements[formatted.id] === undefined) requirements[formatted.id] = formatted;

              if (index > 1 && previous)
                requirements[previous.id].requirements = [
                  ...new Set([...requirements[previous.id].requirements, formatted.id]),
                ];
            }

            previous = formatted;
          });
        });
    }

    console.log(requirements);

    const fillTree = (id: string) => {
      const node = requirements[id];

      if (!node) return null;

      return {
        ...node,
        requirements:
          node?.requirements
            ?.map((e: string) => fillTree(e))
            .filter((e: Course | null) => e !== undefined && e !== null) ?? [],
      };
    };

    return {
      ...records[0].get("course"),
      school: records[0].get("school"),
      label: "Course",
      requirements: records
        .map((e) => fillTree(e.get("requirements")?.length > 1 ? e.get("requirements")[1]?.data?.id : null))
        .map((e, index, arr) => (arr.findIndex((e2) => e2?.id === e?.id) === index ? e : null))
        .filter((e) => e !== undefined && e !== null),
      rating: {
        difficulty: records[0].get("difficulty") ?? 0,
        usefulness: records[0].get("usefulness") ?? 0,
        timeSpent: records[0].get("timeSpent") ?? 0,
        count: records[0].get("ratingCount")?.low ?? 0,
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await driver.close();
  }
};
