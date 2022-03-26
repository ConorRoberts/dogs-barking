import { NextApiRequest, NextApiResponse } from "next";
import getCourse from "@utils/getCourse";

/**
 * @swagger
 * /api/db/course/id/{id}:
 *  get:
 *    summary: Find course by ID
 *    parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: Node ID of course
 *      schema:
 *        type: string
 *    tags: [Course]
 *    description: Returns the course information for the specified course
 *    responses:
 *      200:
 *        description: Successful operation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Course'
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Invalid Course ID
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method === "GET") {
    const id = req.query.id as string;

    return res.status(200).json(await getCourse(id));
  }
  return res.status(401).json({});
};
export default handler;
