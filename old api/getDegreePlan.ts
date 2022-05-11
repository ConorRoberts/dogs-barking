import DegreePlanData from "@typedefs/DegreePlan";
import getNeo4jDriver from "./getNeo4jDriver";

const getDegreePlan = async (id: string): Promise<DegreePlanData> => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  const { records } = await session.run(
    ` 
        MATCH (plan:DegreePlan)
        RETURN properties(plan) as plan,[(plan)-[:CONTAINS]->(semester:DegreePlanSemester) | {
          semester: properties(semester),
          courses: [(semester)-[:CONTAINS]->(course:Course) | properties(course)]
        }] as semesters
    `,
    {
      id,
    }
  );

  return {
    ...records[0].get("plan"),
    semesters: records[0].get("semesters").map((e) => ({ ...e.semester, courses: e.courses })),
  };
};

export default getDegreePlan;
