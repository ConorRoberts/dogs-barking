import getDegreePlan from "@utils/getDegreePlan";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "GET") {
      const planId = req.query.planId as string;
      return res.status(200).json(await getDegreePlan(planId));
    } else if (method === "POST") {
      return res.status(201).json({});
    } else {
      return new Error("Method unsupported");
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export default handler;
