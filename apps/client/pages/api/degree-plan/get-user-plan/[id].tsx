import getUserDegreePlan from "@utils/getUserDegreePlan";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "GET") {
      const id = req.query.id as string;
      const plan = await getUserDegreePlan(id);
      return res.status(200).json(plan);
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
