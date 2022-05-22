const neo4j = require("neo4j-driver");

/**
 * @method GET
 * @description Gets the sections for the given course id
 */
exports.handler = async (event) => {
  console.log(event);

  const { courseId } = event.pathParameters;

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();
  const { records } = await session.run(
    `
    MATCH (course: Course {id: $courseId})-[:HAS]->(section: Section)

    MATCH (section)-[:INSTRUCTED_BY]->(instructor: Instructor)
    OPTIONAL MATCH (section)-[:HAS]->(lab: Lab)
    OPTIONAL MATCH (section)-[:HAS]->(lecture: Lecture)
    OPTIONAL MATCH (section)-[:HAS]->(seminar: Seminar)
    OPTIONAL MATCH (section)-[:HAS]->(tutorial: Tutorial)
    OPTIONAL MATCH (section)-[:HAS]->(exam: Exam)

    return 
      properties(section) as section, 
      properties(instructor) as instructor,
      properties(lecture) as lecture,
      properties(lab) as lab,
      properties(seminar) as seminar,
      properties(tutorial) as tutorial,
      properties(exam) as exam
  `,
    { courseId }
  );

  await session.close();
  await driver.close();

  return records.map((e) => e.get("section"));
};
