import { NextApiRequest, NextApiResponse } from "next";

//TODO: Write functions to get all programs belonging to a specific school "/programs/school"
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
    
  if (method === "GET") {

  }

  return res.status(401).json({});
};