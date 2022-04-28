import Course from "@dogs-barking/common/types/Course";
import getNeo4jDriver from "./getNeo4jDriver";

/**
 * Grab course from DB and return it
 * @param courseCode
 */
const getCourse = async (id: string): Promise<Course | null> => {
  const driver = getNeo4jDriver();
  const session = driver.session();

  const { records } = await session.run(
    `
        MATCH path=(course:Course)-[:REQUIRES*]->(prereq)
        where course.id = $id 

        MATCH (school:School)-[:OFFERS]->(course)

        return 
            properties(course) as course,
            properties(school) as school,
            [n in nodes(path) | {data: properties(n), type: labels(n)[0]}] as requirements
            `,
    { id }
  );

  const requirements = {};

  records
    .map((e) => e.get("requirements"))
    .forEach((list: any[]) => {
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
          if (requirements[formatted.id] === undefined) {
            requirements[formatted.id] = formatted;
          }

          if (index > 1 && previous) {
            requirements[previous.id].requirements = [
              ...new Set([...requirements[previous.id].requirements, formatted.id]),
            ];
          }
        }

        previous = formatted;
      });
    });

  const fillTree = (id: string) => {
    const node = requirements[id];

    return {
      ...node,
      requirements: node.requirements.map((e) => fillTree(e)).filter((e) => e !== undefined && e !== null),
    };
  };

  await session.close();
  await driver.close();

  return {
    ...records[0].get("course"),
    school: records[0].get("school"),
    type: "Course",
    requirements: records
      .map((e) => fillTree(e.get("requirements")[1].data.id))
      .map((e, index, arr) => (arr.findIndex((e2) => e2?.id === e?.id) === index ? e : null))
      .filter((e) => e !== undefined && e !== null),
  };
};

export default getCourse;
