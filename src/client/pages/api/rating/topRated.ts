import getTopRated from "@utils/getTopRated";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "GET") {
      const school = req.query?.school as string;
      const count = req.query?.count as string;
      const ratingType = req.query?.ratingType as string;
      const department = req.query?.department as string;
      const level = req.query?.level as string;
      const sortType = req.query?.sortType as string;
      return res.status(200).json(await getTopRated(school, count, ratingType, department, level, sortType));
    }  else {
      return res.status(404).json("Method unsupported");
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

export default handler;
