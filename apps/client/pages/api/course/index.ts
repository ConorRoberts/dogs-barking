import getCourses from "@utils/getCourses";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method === "GET") {
    const { query } = req;
    const courses = await getCourses({ pageSize: 50, ...query, page: parseInt((query.page as string) ?? "0") });
    return res.status(200).json(courses);
  }
  return res.status(401).json({});
};

export default handler;
