const neo4j = require("neo4j-driver");

/**
 * @method GET
 * @description Gets program with the given ID
 */
exports.handler = async (event) => {
  console.log(event);

  // const body = JSON.parse(event.body ?? "{}");
  // const query = event.queryStringParameters;
  const { programId } = event.pathParameters;
  // const headers = event.headers;

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();

  const { records } = await session.run(
    `
        MATCH(program:Program {id: $programId})
        OPTIONAL MATCH path=(program)-[:REQUIRES*]->(prereq)

        MATCH (school:School)-[:OFFERS]->(program)
        OPTIONAL MATCH (program)-[:HAS_RATING]->(rating:Rating)

        return 
            properties(program) as program,
            properties(school) as school,
            [n in nodes(path) | {data: properties(n), label: labels(n)[0]}] as requirements
      `,
    { programId }
  );

  await session.close();
  await driver.close();

  // This is to store the requirement tree. Object format is fastest for retrieval and duplicate prevention.
  const requirements = {};

  if (records[0]?.get("requirements") !== null) {
    records
      .map((e) => e.get("requirements"))
      .forEach((list) => {
        let previous;
        list.forEach((e, index) => {
          const formatted = {
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

  const fillTree = (id) => {
    const node = requirements[id];

    if (!node) return null;

    return {
      ...node,
      requirements: node?.requirements?.map((e) => fillTree(e)).filter((e) => e !== undefined && e !== null) ?? [],
    };
  };

  return {
    ...records[0].get("program"),
    school: records[0].get("school"),
    label: "Program",
    requirements: records
      .map((e) => fillTree(e.get("requirements")?.length > 1 ? e.get("requirements")[1]?.data?.id : null))
      .map((e, index, arr) => (arr.findIndex((e2) => e2?.id === e?.id) === index ? e : null))
      .filter((e) => e !== undefined && e !== null),
  };
};
