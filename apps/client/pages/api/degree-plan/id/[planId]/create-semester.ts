import runNeo4j from "@utils/runNeo4j";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "GET") {
      return res.status(200).json({});
    } else if (method === "POST") {
      const planId = req.query.planId as string;

      const [data] = await runNeo4j(
        `
          MATCH (dp:DegreePlan {id: $planId})
          CREATE (dp)-[:CONTAINS]->(s:DegreePlanSemester {id: $semesterId, year: $year, semester: $semester})
          RETURN properties(s) as semester
      `,
        { planId, semesterId: v4(), year: new Date().getFullYear(), semester: "winter" }
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
