import createDegreePlanSemester from "@utils/createDegreePlanSemester";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "GET") {
      return res.status(200).json({});
    } else if (method === "POST") {
      const planId = req.query.id as string;
      const newSemester = await createDegreePlanSemester(planId);
      return res.status(201).json(newSemester);
    } else {
      return new Error("Method unsupported");
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

export default handler;
