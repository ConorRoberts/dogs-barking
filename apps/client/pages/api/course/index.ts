import { NextApiRequest, NextApiResponse } from "next";
import getNeo4jDriver from "@utils/getNeo4jDriver";

/**
 * @swagger
 * /api/db/course:
 *  get:
 *    summary: Get all courses
 *    tags: [Course]
 *    description: Returns all the courses in all schools
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
 *      401:
 *        description: Unauthorized
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method === "GET") {
    const pageSize = (req.query.pageSize as string) ?? "200";
    const pageNum = (req.query.pageNum as string) ?? "0";
    const driver = getNeo4jDriver();
    const db = driver.session();
    const queryData = await db.run(
      `
        MATCH (c: Course)
        call{
          WITH c
          MATCH (s: School)-[:OFFERS]->(c)
          return s.abbrev as school
        } 
        return c, school
        ORDER BY school, c.id
        SKIP(${+pageSize * +pageNum}) 
        LIMIT(${pageSize}) 
      `
    );
    
    const courses = [];
    for (const record of queryData.records) {
      courses.push(record.get(0).properties);
    }

    await db.close();
    return res.status(200).json({ data: courses });
  }
  res.status(401).json({});
};
export default handler;
