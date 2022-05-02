import getNeo4jDriver from "./getNeo4jDriver";

const getDegreePlan = async (id: string) => {
  const driver = getNeo4jDriver();

  const session = driver.session();

  const { records } = await session.run(
    ` 
        MATCH (plan:DegreePlan)
        RETURN properties(plan) as plan,[(plan)-[:CONTAINS]->(semester:DegreePlanSemester) | semester.id] as semesters
    `,
    {
      id,
    }
  );

  return { ...records[0].get("plan"), semesters: records[0].get("semesters") };
};

export default getDegreePlan;
