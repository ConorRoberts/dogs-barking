import getRating from "@utils/getRating";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "GET") {
      return res.status(200).json(await getRating(req.query.nodeId as string));
    } else if (method === "POST") {
      return res.status(201).json({});
    } else {
      return res.status(404).json("Method unsupported");
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

export default handler;
