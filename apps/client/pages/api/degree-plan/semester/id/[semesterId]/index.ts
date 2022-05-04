import runNeo4j from "@utils/runNeo4j";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @GET Retrieve the degree plan associated with the user
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method } = req;
    const semesterId = req.query.semesterId as string;

    if (method === "GET") {
      const [data] = await runNeo4j(
        `
          MATCH (semester: DegreePlanSemester {id: $semesterId})

          RETURN properties(semester) as semester, [(semester)-[:CONTAINS]->(course: Course) | properties(course)] as courses
      `,
        { semesterId }
      );

      return res.status(200).json({ ...data.get("semester"), courses: data.get("courses") });
    } else if (method === "DELETE") {
      await runNeo4j(
        `
          MATCH (semester: DegreePlanSemester {id: $semesterId})
          DETACH DELETE semester
      `,
        { semesterId }
      );

      return res.status(200).json({});
    } else {
      return new Error("Method unsupported");
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export default handler;
