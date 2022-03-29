import { NextApiRequest, NextApiResponse } from "next";
import queryPrograms from "@utils/queryPrograms";

/**
 * @swagger
 * /api/db/programs:
 *  get:
 *    summary: Get all programs
 *    tags: [Program]
 *    description: Returns all the programs in all schools
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
 *                    $ref: '#/components/schemas/Program'
 *      401:
 *        description: Unauthorized
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "GET") {
      const programId = req.query.id as string ?? "";
      const name = req.query.name as string ?? "";
      const school = req.query.school as string ?? "";
      const pageSize = parseInt((req.query.pageSize as string) ?? "50");
      const pageNum = parseInt((req.query.pageNum as string) ?? "0");
      const sortDir = req.query.sortDir as "asc" | "desc" ?? "asc";
      const sortKey = (req.query.sortKey as string === "courseCode") ? "id" : req.query.sortKey as string;
      return res.status(200).json(await queryPrograms({
        programId,
        name,
        school,
        pageSize,
        pageNum,
        sortDir,
        sortKey,
      }));
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
