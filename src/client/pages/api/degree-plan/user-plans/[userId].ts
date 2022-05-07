import runNeo4j from "@utils/runNeo4j";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "GET") {
      const userId = req.query.userId as string;
      if (userId === undefined || typeof userId !== "string") throw new Error("Invalid userId");

      const data = await runNeo4j(
        `
        MATCH (user:User {id: $userId})-[:HAS]->(plan:DegreePlan)

        RETURN properties(plan) as plan,[(plan)-[:CONTAINS]->(semester:DegreePlanSemester) | semester.id] as semesters
        `,
        { userId: req.query.userId as string }
      );

      return res.status(200).json(data.map((e) => ({ ...e.get("plan"), semesters: e.get("semesters") })));
    } else if (method === "POST") {
      return res.status(201).json({});
    } else {
      return new Error("Method unsupported");
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

export default handler;
