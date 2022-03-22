import getProgram from "@utils/getProgram";
import { NextApiRequest, NextApiResponse } from "next";

//TODO: Write functions to get all programs belonging to a specific school "/programs/school"
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  try {
    if (method === "GET") {
      const { query } = req;
      const id = query.id as string;

      if (!id) throw new Error("Missing program ID (id)");

      const program = await getProgram(id);

      return res.status(200).json(program);
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }

  return res.status(401).json({});
};

export default handler;
