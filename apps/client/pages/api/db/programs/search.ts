import { NextApiRequest, NextApiResponse } from "next";
import neo4j from "neo4j-driver";

// returns every course stored in data.json
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method === "GET") {

  }
  res.status(401).json({});
};
export default handler;