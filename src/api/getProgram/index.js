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
        OPTIONAL MATCH major=(program)-[:REQUIRES|MAJOR_REQUIRES*]->(prereq)
        OPTIONAL MATCH minor=(program)-[:REQUIRES|MINOR_REQUIRES*]->(prereq)

        MATCH (school:School)-[:OFFERS]->(program)

        return 
            properties(program) as program,
            properties(school) as school,
            [n in nodes(major) | {data: properties(n), label: labels(n)[0]}] as major,
            [n in nodes(minor) | {data: properties(n), label: labels(n)[0]}] as minor
      `,
    { programId }
  );

  await session.close();
  await driver.close();

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
            major: [],
          };

          // If this is the first element, skip it
          if (index !== 0) {
            // Are we missing this entry in our list?
            if (major[formatted.id] === undefined) major[formatted.id] = formatted;

            if (index > 1 && previous)
              major[previous.id].requirements = [...new Set([...major[previous.id].major, formatted.id])];
          }

          previous = formatted;
        });
      });
  }

  const minor = {};
  if (records[0]?.get("minor") !== null) {
    records
      .map((e) => e.get("minor"))
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
            if (minor[formatted.id] === undefined) minor[formatted.id] = formatted;

            if (index > 1 && previous)
              minor[previous.id].requirements = [...new Set([...minor[previous.id].minor, formatted.id])];
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

  return {
    ...records[0].get("program"),
    school: records[0].get("school"),
    label: "Program",
    major: records
      .map((e) => fillMajorTree(e.get("major")?.length > 1 ? e.get("major")[1]?.data?.id : null))
      .map((e, index, arr) => (arr.findIndex((e2) => e2?.id === e?.id) === index ? e : null))
      .filter((e) => e !== undefined && e !== null),
    minor: records
      .map((e) => fillMinorTree(e.get("minor")?.length > 1 ? e.get("minor")[1]?.data?.id : null))
      .map((e, index, arr) => (arr.findIndex((e2) => e2?.id === e?.id) === index ? e : null))
      .filter((e) => e !== undefined && e !== null),
  };
};
