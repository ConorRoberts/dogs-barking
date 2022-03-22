import getCourse from "@utils/getCourse";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "GET") {
      const { query } = req;

      const id = query.id as string;

      if (!id) throw new Error("No course code provided");

      const course = await getCourse(id);

      return res.status(200).json(course);
    } else if (method === "POST") {
      // courses/id/update
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(405).json({});
};

export default handler;
