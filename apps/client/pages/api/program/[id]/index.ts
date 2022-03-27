import { NextApiRequest, NextApiResponse } from "next";
import getProgram from "@utils/getProgram";

/**
 * @swagger
 * /api/db/programs/{id}:
 *  get:
 *    summary: Find major, minor, and area course based on a specific program
 *    parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: Node ID of program
 *      schema:
 *        type: integer
 *    tags: [Program]
 *    description: Returns the major, minor and are course information based on the program
 *    responses:
 *      200:
 *        description: Successful operation
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                program:
 *                  $ref: '#/components/schemas/Program'
 *                major:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/CourseWithNodeId'
 *                minor:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/CourseWithNodeId'
 *                area:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/CourseWithNodeId'
 *      401:
 *        description: Unauthorized
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  try {
    if (method === "GET") {
      const id = req.query.id as string;

      return res.status(200).json(await getProgram(id));
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
export default handler;
