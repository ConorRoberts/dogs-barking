import runNeo4j from "@utils/runNeo4j";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @GET Retrieve the degree plan associated with the user
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "GET") {
      const semesterId = req.query.semesterId as string;

      const [data] = await runNeo4j(
        `
          MATCH (semester: DegreePlanSemester {id: $semesterId})

          RETURN properties(semester) as semester
      `,
        { semesterId }
      );

      return res.status(201).json(data.get("semester"));
    } else {
      return new Error("Method unsupported");
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export default handler;
