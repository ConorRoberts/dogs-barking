import neo4j from "neo4j-driver";
import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  courseId: string;
}

/**
 * @method GET
 * @description Gets the sections for the given course id
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<any[]>> => {
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
    console.log(event);

    const { courseId } = event.pathParameters as PathParameters;

    const session = driver.session();
    const { records } = await session.run(
      `
      MATCH (course: Course {id: $courseId})-[:HAS]->(section: Section)

      MATCH (section)-[:INSTRUCTED_BY]->(instructor: Instructor)

      return 
        properties(section) as section, 
        properties(instructor) as instructor,
        [(section)-[:HAS]->(lab: Lab) | properties(lab)] as labs,
        [(section)-[:HAS]->(lecture: Lecture) | properties(lecture)] as lectures,
        [(section)-[:HAS]->(seminar: Seminar) | properties(seminar)] as seminars,
        [(section)-[:HAS]->(tutorial: Tutorial) | properties(tutorial)] as tutorials,
        [(section)-[:HAS]->(exam: Exam) | properties(exam)] as exams
      `,
      { courseId }
    );

    await session.close();
    await driver.close();

    return records.map((e: any) => ({
      ...e.get("section"),
      instructor: e.get("instructor"),
      lectures: e.get("lectures").map((e: any) => ({
        ...e,
        startTime: `${e.startTime.hour.low % 12}:${e.startTime.minute.low.toString().padStart(2, "0")} ${
          e.startTime.hour.low % 12 > 0 ? "PM" : "AM"
        }`,
        endTime: `${e.endTime.hour.low % 12}:${e.endTime.minute.low.toString().padStart(2, "0")} ${
          e.endTime.hour.low % 12 > 0 ? "PM" : "AM"
        }`,
      })),
      labs: e.get("labs").map((e: any) => ({
        ...e,
        startTime: `${e.startTime.hour.low % 12}:${e.startTime.minute.low.toString().padStart(2, "0")} ${
          e.startTime.hour.low % 12 > 0 ? "PM" : "AM"
        }`,
        endTime: `${e.endTime.hour.low % 12}:${e.endTime.minute.low.toString().padStart(2, "0")} ${
          e.endTime.hour.low % 12 > 0 ? "PM" : "AM"
        }`,
      })),
      seminars: e.get("seminars").map((e: any) => ({
        ...e,
        startTime: `${e.startTime.hour.low % 12}:${e.startTime.minute.low.toString().padStart(2, "0")} ${
          e.startTime.hour.low % 12 > 0 ? "PM" : "AM"
        }`,
        endTime: `${e.endTime.hour.low % 12}:${e.endTime.minute.low.toString().padStart(2, "0")} ${
          e.endTime.hour.low % 12 > 0 ? "PM" : "AM"
        }`,
      })),
      exams: e.get("exams").map((e: any) => ({
        ...e,
        startTime: `${e.startTime.hour.low % 12}:${e.startTime.minute.low.toString().padStart(2, "0")} ${
          e.startTime.hour.low % 12 > 0 ? "PM" : "AM"
        }`,
        endTime: `${e.endTime.hour.low % 12}:${e.endTime.minute.low.toString().padStart(2, "0")} ${
          e.endTime.hour.low % 12 > 0 ? "PM" : "AM"
        }`,
      })),
      tutorials: e.get("tutorials").map((e: any) => ({
        ...e,
        startTime: `${e.startTime.hour.low % 12}:${e.startTime.minute.low.toString().padStart(2, "0")} ${
          e.startTime.hour.low % 12 > 0 ? "PM" : "AM"
        }`,
        endTime: `${e.endTime.hour.low % 12}:${e.endTime.minute.low.toString().padStart(2, "0")} ${
          e.endTime.hour.low % 12 > 0 ? "PM" : "AM"
        }`,
      })),
    }));
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await driver.close();
  }
};
