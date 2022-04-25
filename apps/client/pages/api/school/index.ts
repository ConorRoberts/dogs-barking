import getSchools from "@utils/getSchools";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "GET") {
      const schools = await getSchools();
      return res.status(200).json(schools);
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
