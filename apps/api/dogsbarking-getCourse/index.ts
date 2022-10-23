import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { courseSchema, getNeo4jDriver } from "@dogs-barking/common";
import { z } from "zod";

/**
 * @method GET
 * @description Gets the course with the given id
 */
export const handler: APIGatewayProxyHandlerV2<object> = async (event) => {
  console.log(event);
  const { stage } = event.requestContext;
  const driver = await getNeo4jDriver(stage);

  try {
    const { courseId } = z.object({ courseId: z.string() }).parse(event.pathParameters);

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
            toFloatOrNull(avg(rating.difficulty)) as difficulty,
            toFloatOrNull(avg(rating.timeSpent)) as timeSpent,
            toFloatOrNull(avg(rating.usefulness)) as usefulness,
            toIntegerOrNull(count(rating)) as ratingCount
      `,
      { courseId }
    );

    await session.close();

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

    // This isn't the full type for all nodes we expect to use, however this represents all of the
    // properties we intend to use to create our response object
    type GenericNode = { id: string; requirements: string[]; label: string };

    // The list of unique nodes contained in the requirements of our course
    const nodeList = new Map<string, GenericNode>();

    for (const list of requirements) {
      // The previous element when iterating over the list
      // We track this so that we can assign child requirements to their parent
      let previous: GenericNode | undefined;

      list.forEach((e, index) => {
        // Format the current element to adhere to our schema
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
          if (nodeList.has(currentNode.id)) {
            nodeList.set(currentNode.id, currentNode);
          }

          // If we're at least past the first course, and we do have a previous element, add the current element to the previous element's requirements
          if (index > 1 && previous && nodeList.has(previous.id)) {
            const previousElementInList = nodeList.get(previous.id);
            if (previousElementInList) {
              // Add the node's ID to the previous element's requirements
              previousElementInList.requirements = [
                ...new Set([...previousElementInList.requirements, currentNode.id]),
              ];
            }
          }
        }

        previous = currentNode;
      });
    }

    return {
      nodes: Object.fromEntries(nodeList),
      course: {
        ...course,
        school,
        label: "Course",
        requirements: nodeList.get(courseId)?.requirements ?? [],
        rating: {
          difficulty: difficulty ?? 0,
          usefulness: usefulness ?? 0,
          timeSpent: timeSpent ?? 0,
          count: ratingCount ?? 0,
        },
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await driver.close();
  }
};
