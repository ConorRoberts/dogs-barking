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
      if (Object.keys(req.query).length === 0) {
        throw new Error("No query provided");
      }

      const department = req.query.department as string;
      const name = req.query.name as string;
      const courseId = req.query.id as string;
      const weight = parseFloat((req.query.weight as string) ?? null);
      const number = parseFloat((req.query.number as string) ?? null);
      const pageNum = parseInt((req.query.pageNum as string) ?? "0");
      const pageSize = parseInt((req.query.pageSize as string) ?? "50");
      const degree = req.query.degree as string;
      const school = req.query.school as string;
      const scope = req.query.scope as string;
      const sortKey = req.query.sortKey as string;
      const sortDir = req.query.sortDir as "asc" | "desc";
      const description = req.query.description as string;
      const prerequisites = req.query.prerequisites as string[];

      return res.status(200).json(
        await queryCourses({
          pageNum,
          pageSize,
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
          scope: scope as "all" | "undergrad" | "grad",
        })
      );
    }
  } catch (error) {
    return res.status(400).json([]);
  }
};
export default handler;
