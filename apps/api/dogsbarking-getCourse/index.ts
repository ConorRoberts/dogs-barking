import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import { courseSchema, getNeo4jDriver } from "@dogs-barking/common";
import { z } from "zod";
import Course from "@dogs-barking/common/Course";

/**
 * @method GET
 * @description Gets the course with the given id
 */
interface PathParameters extends APIGatewayProxyEventPathParameters {
  courseId: string;
}

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2> => {
  const { stage } = event.requestContext;
  const driver = await getNeo4jDriver(stage);

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
            collect([n in nodes(path) | 
              {
                data: properties(n),
                label: labels(n)[0]
              }
            ]) as requirements,
            toFloataOrNull(avg(rating.difficulty)) as difficulty,
            toFloataOrNull(avg(rating.timeSpent)) as timeSpent,
            toFloataOrNull(avg(rating.usefulness)) as usefulness,
            toIntegerOrNull(count(rating)) as ratingCount
      `,
      { courseId }
    );

    await session.close();
    await driver.close();

    const {
      school,
      difficulty,
      timeSpent,
      usefulness,
      ratingCount,
      requirements = [],
      course,
    } = z
      .object({
        difficulty: z.number(),
        timeSpent: z.number(),
        usefulness: z.number(),
        ratingCount: z.number(),
        school: z.record(z.string(), z.string()),
        requirements: z.array(z.array(z.object({ data: z.record(z.string(), z.string()), label: z.string() }))),
        course: courseSchema,
      })
      .parse({
        difficulty: records[0].get("difficulty"),
        timeSpent: records[0].get("timeSpent"),
        usefulness: records[0].get("usefulness"),
        ratingCount: records[0].get("ratingCount"),
        school: records[0].get("school"),
        requirements: records[0].get("requirements"),
        course: records[0].get("course"),
      });

    type GenericNode = { id: string; requirements: string[]; label: string };
    const courseList = new Map<string, GenericNode>();

    for (const list of requirements) {
      // The previous element when iterating over the list
      let previous: GenericNode | undefined;

      list.forEach((e, index) => {
        // Format the current element how we want to
        const currentNode: GenericNode = {
          ...e.data,
          id: e.data.id,
          label: e.label,
          requirements: [],
        };

        // If this is the first element, skip it
        // Why do this? Because the first element is always going to be the course
        // Each of these lists represents a path, and the course will always be our starting point of the path
        if (index !== 0) {
          // Are we missing this entry in our list?
          // If so, create it
          if (courseList.has(currentNode.id)) {
            courseList.set(currentNode.id, currentNode);
          }

          // If we're at least past the first course, and we do have a previous element, add the current element to the previous element's requirements
          if (index > 1 && previous && courseList.has(previous.id)) {
            const previousElementInList = courseList.get(previous.id);
            if (previousElementInList) {
              previousElementInList.requirements = [
                ...new Set([...previousElementInList.requirements, currentNode.id]),
              ];
            }
          }
        }

        previous = currentNode;
      });
    }

    // const fillTree = (id: string) => {
    //   const node = requirements[id];

    //   if (!node) return null;

    //   return {
    //     ...node,
    //     requirements:
    //       node?.requirements
    //         ?.map((e: string) => fillTree(e))
    //         .filter((e: Course | null) => e !== undefined && e !== null) ?? [],
    //   };
    // };

    return {
      ...course,
      school,
      label: "Course",
      requirements: records
        .map((e) => fillTree(e.get("requirements")?.length > 1 ? e.get("requirements")[1]?.data?.id : null))
        .map((e, index, arr) => (arr.findIndex((e2) => e2?.id === e?.id) === index ? e : null))
        .filter((e) => e !== undefined && e !== null),
      rating: {
        difficulty: difficulty ?? 0,
        usefulness: usefulness ?? 0,
        timeSpent: timeSpent ?? 0,
        count: ratingCount ?? 0,
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await driver.close();
  }
};
