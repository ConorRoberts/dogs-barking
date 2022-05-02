import runNeo4j from "@utils/runNeo4j";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";

/**
 * @POST Creates a degree plan for the given user
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "POST") {
      const userId = req.query.userId as string;

      if (userId === undefined || typeof userId !== "string") throw new Error("Invalid userId");

      const data = await runNeo4j(
        `
        MERGE (user:User {id: $userId})-[:HAS_DEGREE_PLAN]->(plan:DegreePlan {
            id: $planId
        })

        RETURN properties(plan) as plan
        `,
        { userId: req.query.userId as string, planId: v4() }
      );

      return res.status(201).json(data.map((e) => e.get("plan")));
    } else {
      return new Error("Method unsupported");
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export default handler;
