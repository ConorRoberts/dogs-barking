const neo4j = require("neo4j-driver");

/**
* @method GET
* @description Gets the course with the given id
*/
exports.handler = async (
  event
) => {
  console.log(event);

  const { courseId } = event.pathParameters;
  // const headers = event.headers;

  if (courseId === undefined || typeof courseId !== "string") throw new Error("Invalid courseId");

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();

  const { records } = await session.run(
    `
        MATCH (course:Course {id: $courseId})
        OPTIONAL MATCH path=(course)-[:REQUIRES*]->(prereq)

        MATCH (school:School)-[:OFFERS]->(course)
        OPTIONAL MATCH (course)-[:HAS_RATING]->(rating:Rating)

        return 
            properties(course) as course,
            properties(school) as school,
            [n in nodes(path) | {data: properties(n), type: labels(n)[0]}] as requirements,
            avg(rating.difficulty) as difficulty,
            avg(rating.timeSpent) as timeSpent,
            avg(rating.usefulness) as usefulness,
            count(rating) as ratingCount
            `,
    { courseId }
  );

  console.log(records);
  console.log(records[0].get("course"));

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
            type: e.type,
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

  const fillTree = (id) => {
    const node = requirements[id];

    if (!node) return null;

    return {
      ...node,
      requirements: node?.requirements?.map((e) => fillTree(e)).filter((e) => e !== undefined && e !== null) ?? [],
    };
  };

  return {
    ...records[0].get("course"),
    school: records[0].get("school"),
    type: "Course",
    requirements: [...new Set(fillTree(courseId)?.requirements ?? [])]
      .filter((e) => e !== undefined && e !== null),
    rating: {
      difficulty: records[0].get("difficulty") ?? 0,
      usefulness: records[0].get("usefulness") ?? 0,
      timeSpent: records[0].get("timeSpent") ?? 0,
      count: records[0].get("ratingCount")?.low ?? 0,
    }
  };
};