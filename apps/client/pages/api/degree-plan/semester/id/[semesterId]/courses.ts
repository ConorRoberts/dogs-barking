import getNeo4jDriver from "@utils/getNeo4jDriver";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "GET") {
      return res.status(200).json({});
    } else if (method === "POST") {
      const semesterId = req.query.semesterId as string;

      // Array of course ids
      const courses = req.body.courses as string[];

      const driver = getNeo4jDriver();
      const session = driver.session();

      await session.run(
        `
          MATCH (semester:DegreePlanSemester { id: $semesterId })

          UNWIND $courses as course
          MERGE (semester)-[:CONTAINS]->(c:Course {id: course})
        `,
        { semesterId, courses }
      );

      await session.close();
      await driver.close();

      return res.status(201).json({});
    } else {
      return new Error("Method unsupported");
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export default handler;
