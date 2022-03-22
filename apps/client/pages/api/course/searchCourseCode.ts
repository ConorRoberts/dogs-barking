import getCourses from "@utils/getCourses";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "GET") {
      const { query } = req;
      const courseCode = query.courseCode as string;

      const courses = await getCourses();
      return res
        .status(200)
        .json(courses.filter((e) => e.id.toLowerCase().startsWith(courseCode.toLowerCase())));
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
