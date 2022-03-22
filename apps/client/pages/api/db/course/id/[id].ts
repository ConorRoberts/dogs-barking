import { NextApiRequest, NextApiResponse } from "next";
import getNeo4jDriver from "@utils/getNeo4jDriver";
import { COMBINED } from "@config/regex";

/**
 * @swagger
 * /api/db/course/id/{id}:
 *  get:
 *    summary: Find course by ID
 *    parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: ID of course
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

    if (!COMBINED.test(id)) return res.status(500).json({ message: "Invalid Course ID" });

    const driver = getNeo4jDriver();
    const db = driver.session();
    const query = await db.run(
      `
        MATCH (c: Course {id: $id})
        return c
      `,
      { id }
    );
    await db.close();

    return res.status(200).json({ data: query.records[0].get(0).properties });
  }
  return res.status(401).json({});
};
export default handler;
