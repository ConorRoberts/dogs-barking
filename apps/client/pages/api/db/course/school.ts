import { NextApiRequest, NextApiResponse } from "next";
import getNeo4jDriver from "@utils/getNeo4jDriver";

/**
 * @swagger
 * /api/db/course/school:
 *  get:
 *    summary: Get all courses in school
 *    parameters:
 *    - name: school
 *      in: query
 *      required: true
 *      description: Name of school
 *      schema:
 *        type: string
 *    tags: [Course]
 *    description: Returns all the courses for the specified school
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
 *      500:
 *        description: Invalid School
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method === "GET") {
    const pageSize = (req.query.pageSize as string) ?? "200";
    const pageNum = (req.query.pageNum as string) ?? "0";
    const school = (req.query.school as string) ?? "";

    if (school === "") return res.status(500).json({ message: "Invalid School, UofG/UofT Are valid" });

    const driver = getNeo4jDriver();
    const db = driver.session();

    const queryData = await db.run(
      `
        MATCH (s: School {abbrev:$abbrev})-[:OFFERS]->(c: Course)
        return c
        ORDER BY c.id
        SKIP(${+pageSize * +pageNum}) 
        LIMIT(${pageSize})
      `,
      { abbrev: school.toUpperCase() }
    );

    await db.close();
    await driver.close();

    return res.status(200).json({ data: queryData.records.map((e) => e.get(0).properties) });
  }

  return res.status(401).json({});
};
export default handler;
