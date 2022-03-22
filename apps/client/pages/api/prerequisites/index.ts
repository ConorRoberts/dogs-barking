import { NextApiRequest, NextApiResponse } from "next";
import getPrerequisites from "@utils/getPrerequisites";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "GET") {
      const { query } = req;

      const id = query.id as string;

      const courses = await getPrerequisites(id);
      return res.status(200).json(courses);
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
