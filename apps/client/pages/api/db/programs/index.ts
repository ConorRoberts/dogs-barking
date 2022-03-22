import { NextApiRequest, NextApiResponse } from "next";
import getNeo4jDriver from "@utils/getNeo4jDriver";

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
  if (method === "GET") {
    const pageSize = (req.query.pageSize as string) ?? "200";
    const pageNum = (req.query.pageNum as string) ?? "0";
    const driver = getNeo4jDriver();
    const db = driver.session();
    const queryData = await db.run(
      `
        MATCH (p: Program)
        call{
            WITH p
            MATCH (s: School)-[:OFFERS]->(p)
            return s.abbrev as school
        } 
        return p, school, id(p) as nodeId
        ORDER BY school, p.id
        SKIP(${+pageSize * +pageNum}) 
        LIMIT(${pageSize}) 
      `
    );
    await db.close();
    await driver.close();

    return res
      .status(200)
      .json({ data: queryData.records.map((e) => ({ ...e.get("p").properties, nodeId: e.get("nodeId").low })) });
  }

  return res.status(401).json({});
};
export default handler;