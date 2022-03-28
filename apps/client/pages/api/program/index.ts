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
    const school = req.query?.school as string;
    const driver = getNeo4jDriver();
    const db = driver.session();
    const queryData = await db.run(
      `
      MATCH (program: Program)
      call{
        WITH program
        MATCH (s: School)-[:OFFERS]->(program)
        ${school?.length > 0 ? "WHERE s.abbrev = $school" : ""}
          return s.abbrev as school
        } 
        return program, school, id(program) as nodeId
        ORDER BY school, program.id
        SKIP(${+pageSize * +pageNum}) 
        LIMIT(${pageSize}) 
      `,
      { school }
    );
    await db.close();
    await driver.close();

    return res
      .status(200)
      .json(queryData.records.map((e) => ({ ...e.get("program").properties, nodeId: e.get("nodeId").low })));
  }

  return res.status(401).json({});
};
export default handler;
