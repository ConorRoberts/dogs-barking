import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { z } from "zod";
import { getNeo4jDriver, programSchema, schoolSchema } from "@dogs-barking/common";

const requirementSchema = z.array(
  z.array(
    z.object({
      data: z.record(z.string(), z.any()),
      label: z.string(),
    })
  )
);

const recordsSchema = z.object({
  school: schoolSchema,
  major: requirementSchema,
  minor: requirementSchema,
  program: programSchema.extend({ updatedAt: z.object({ low: z.number(), high: z.number() }) }),
});

/**
 * @method GET
 * @description Gets program with the given ID
 */
export const handler: APIGatewayProxyHandlerV2<unknown> = async (event) => {
  console.log(event);
  const { stage } = event.requestContext;
  const driver = await getNeo4jDriver(stage);
  try {
    const { programId } = z.object({ programId: z.string() }).parse(event.pathParameters);

    const session = driver.session();

    const { records } = await session.run(
      `
        MATCH(program:Program {id: $programId})
        MATCH (school:School)-[:OFFERS]->(program)

        OPTIONAL MATCH major=(program)-[:REQUIRES|MAJOR_REQUIRES*]->(prereq)
        OPTIONAL MATCH minor=(program)-[:REQUIRES|MINOR_REQUIRES*]->(prereq)

        return 
            properties(program) as program,
            properties(school) as school,
            collect([n in nodes(major) | {data: properties(n), label: labels(n)[0]}]) as major,
            collect([n in nodes(minor) | {data: properties(n), label: labels(n)[0]}]) as minor
      `,
      { programId }
    );
    await session.close();

    const { major, minor, program, school } = recordsSchema.parse(records[0].toObject());

    console.info(major);
    console.info(minor);
    console.info(program);
    console.info(school);

    // This isn't the full type for all nodes we expect to use, however this represents all of the
    // properties we intend to use to create our response object
    type GenericNode = { id: string; requirements: string[]; label: string; updatedAt: number };

    // The list of unique nodes contained in the requirements of our program
    const nodeList = new Map<string, GenericNode>();

    for (const programType of ["major", "minor"]) {
      const tmp: Record<string, any[][]> = { major, minor };
      for (const list of tmp[programType]) {
        // The previous element when iterating over the list
        // We track this so that we can assign child requirements to their parent
        let previous: GenericNode | undefined;

        list.forEach((e, index) => {
          // Format the current element to adhere to our schema
          const currentNode: GenericNode = {
            ...e.data,
            id: e.data.id === programId ? `${programId}-${programType}` : e.data.id,
            updatedAt: e.data.updatedAt?.low,
            label: e.label,
            requirements: [],
          };

          // Are we missing this entry in our list?
          // If so, create it
          if (!nodeList.has(currentNode.id)) {
            nodeList.set(currentNode.id, currentNode);
          }

          // If we're at least past the first node, and we do have a previous element, add the current element to the previous element's requirements
          // Why do this? Because the first element is always going to be the program
          // Each of these lists represents a path, and the course will always be our starting point of the path
          if (index > 0 && previous && nodeList.has(previous.id)) {
            const previousElementInList = nodeList.get(previous.id);
            if (previousElementInList) {
              // Add the node's ID to the previous element's requirements
              previousElementInList.requirements = [
                ...new Set([...previousElementInList.requirements, currentNode.id]),
              ];
            }
          }

          previous = currentNode;
        });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        program: {
          ...program,
          school,
          label: "Program",
          major: nodeList.get(`${programId}-major`)?.requirements ?? [],
          minor: nodeList.get(`${programId}-minor`)?.requirements ?? [],
        },
        nodes: Object.fromEntries(nodeList),
      }),
    };
  } catch (error) {
    console.error(error);

    return error;
  } finally {
    await driver.close();
  }
};
