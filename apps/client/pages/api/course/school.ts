import getCourses from "@utils/getCourses";
import { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @param req
 * @param res
 * @returns
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method === "GET") {
    const { query } = req;

    const school = query.school as string;

    const courses = await getCourses({ school, page: 0 });

    return res.status(200).json(courses);
  }
  return res.status(401).json({});
};

export default handler;
