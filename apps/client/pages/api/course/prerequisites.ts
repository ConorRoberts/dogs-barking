import getUniquePrerequisites from "@utils/getUniquePrerequisites";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "GET") {
      const id = req.query?.id as string;
      if (!id) throw new Error("Missing node id (id: string)");
      return res.status(200).json(await getUniquePrerequisites(id));
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
