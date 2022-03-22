import searchCourses from "@utils/searchCourses";
import { NextApiRequest, NextApiResponse } from "next";

// Query system from cli adapted to the full stack application
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === "GET") {
    const courseId = req.query.courseId as string;
    const pageSize = req.query.pageSize as string;
    const pageNum = req.query.pageNum as string;

    return res.status(200).json(await searchCourses({ courseId, pageSize, pageNum }));
  }

  return res.status(401).json({});
};

export default handler;
