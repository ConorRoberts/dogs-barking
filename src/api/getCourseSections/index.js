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

  return records.map((e) => ({
    section: {
      ...e.get("section"),
      startTime: `${e.get("section").startTime.hour.low}:${e.get("section").startTime.minute.low}`,
      endTime: `${e.get("section").endTime.hour.low}:${e.get("section").endTime.minute.low}`,
    },
    instructor: e.get("instructor"),
    lectures: e.get("lectures"),
    labs: e.get("labs"),
    seminars: e.get("seminars"),
    exams: e.get("exams"),
    tutorial: e.get("tutorials"),
  }));
};
