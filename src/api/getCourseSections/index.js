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
    ...e.get("section"),

    instructor: e.get("instructor"),
    lectures: e.get("lectures").map((e) => ({
      ...e,
      startTime: `${e.startTime.hour.low % 12}:${e.startTime.minute.low.toString().padStart(2, "0")} ${
        e.startTime.hour.low % 12 > 0 ? "PM" : "AM"
      }`,
      endTime: `${e.endTime.hour.low % 12}:${e.endTime.minute.low.toString().padStart(2, "0")} ${
        e.endTime.hour.low % 12 > 0 ? "PM" : "AM"
      }`,
    })),
    labs: e.get("labs").map((e) => ({
      ...e,
      startTime: `${e.startTime.hour.low % 12}:${e.startTime.minute.low.toString().padStart(2, "0")} ${
        e.startTime.hour.low % 12 > 0 ? "PM" : "AM"
      }`,
      endTime: `${e.endTime.hour.low % 12}:${e.endTime.minute.low.toString().padStart(2, "0")} ${
        e.endTime.hour.low % 12 > 0 ? "PM" : "AM"
      }`,
    })),
    seminars: e.get("seminars").map((e) => ({
      ...e,
      startTime: `${e.startTime.hour.low % 12}:${e.startTime.minute.low.toString().padStart(2, "0")} ${
        e.startTime.hour.low % 12 > 0 ? "PM" : "AM"
      }`,
      endTime: `${e.endTime.hour.low % 12}:${e.endTime.minute.low.toString().padStart(2, "0")} ${
        e.endTime.hour.low % 12 > 0 ? "PM" : "AM"
      }`,
    })),
    exams: e.get("exams").map((e) => ({
      ...e,
      startTime: `${e.startTime.hour.low % 12}:${e.startTime.minute.low.toString().padStart(2, "0")} ${
        e.startTime.hour.low % 12 > 0 ? "PM" : "AM"
      }`,
      endTime: `${e.endTime.hour.low % 12}:${e.endTime.minute.low.toString().padStart(2, "0")} ${
        e.endTime.hour.low % 12 > 0 ? "PM" : "AM"
      }`,
    })),
    tutorials: e.get("tutorials").map((e) => ({
      ...e,
      startTime: `${e.startTime.hour.low % 12}:${e.startTime.minute.low.toString().padStart(2, "0")} ${
        e.startTime.hour.low % 12 > 0 ? "PM" : "AM"
      }`,
      endTime: `${e.endTime.hour.low % 12}:${e.endTime.minute.low.toString().padStart(2, "0")} ${
        e.endTime.hour.low % 12 > 0 ? "PM" : "AM"
      }`,
    })),
  }));
};
