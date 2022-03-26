import { NextApiRequest, NextApiResponse } from "next";
import Course from "@dogs-barking/common/types/Course";
import queryCourses from "@utils/queryCourses";

/**
 * @swagger
 * /api/db/course/search:
 *  get:
 *    summary: Get all courses based on specific search criteria
 *    parameters:
 *    - name: query
 *      in: body
 *      required: true
 *      description: search criteria object
 *      schema:
 *        type: object
 *        properties:
 *          query:
 *            $ref: '#/components/schemas/CourseSearch'
 *    tags: [Course]
 *    description: Returns all the courses for search criteria
 *    responses:
 *      200:
 *        description: Successful operation
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Course'
 *
 *      401:
 *        description: Unauthorized
 */
const handler = async (req: NextApiRequest, res: NextApiResponse<Course[]>) => {
  const { method } = req;
  try {
    if (method === "GET") {
      const filters = JSON.parse(req.query.filters as string);
      const pageSize = parseInt((req.query.pageSize as string) ?? "50");
      const pageNum = parseInt((req.query.pageNum as string) ?? "0");
      const department = filters.department as string;
      const name = filters.name as string;
      const courseId = filters.id as string;
      const weight = parseFloat((filters.weight as string) ?? null);
      const number = parseFloat((filters.number as string) ?? null);
      const degree = filters.degree as string;
      const school = filters.school as string;
      const sortKey = filters.sortKey as string;
      const sortDir = filters.sortDir as "asc" | "desc";
      const description = filters.description as string;
      const prerequisites = filters.prerequisites as string[];

      return res.status(200).json(
        await queryCourses({
          pageSize,
          pageNum,
          department,
          name,
          courseId,
          weight,
          number,
          degree,
          school,
          sortKey,
          sortDir,
          description,
          prerequisites,
        })
      );
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json([]);
  }
};
export default handler;
