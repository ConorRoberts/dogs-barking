import { NextApiRequest, NextApiResponse } from "next";
import neo4j from "neo4j-driver";

/**
 * @swagger
 * /api/db/programs/school:
 *  get:
 *    summary: Get all courses in school
 *    parameters:
 *    - name: school
 *      in: query
 *      required: true
 *      description: Name of school
 *      schema:
 *        type: string
 *    tags: [Program]
 *    description: Returns all the programs for the specified school
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
 *                    
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Invalid School
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method === "GET") {
    const pageSize = req.query.pageSize as string ?? "200";
    const pageNum = req.query.pageNum as string ?? "0";
    const school = req.query.school as string ?? "";
    if(school === "") return res.status(500).json({message:"Invalid School, UofG/UofT Are valid"});
    const driver = neo4j.driver("neo4j://100.24.23.121/", neo4j.auth.basic("neo4j", "th3yd0b3b4rk1ng"));
    const db = driver.session();
    const queryData = await db.run(
      `
            MATCH (s: School {abbrev:$abbrev})-[:OFFERS]->(p: Program)
            return p
            ORDER BY p.id
            SKIP(${+pageSize * +pageNum}) 
            LIMIT(${pageSize}) `, {abbrev: school.toUpperCase()});
    const courses = [];
    for(const record of queryData.records) {
      courses.push(record.get(0).properties);
    }
    //console.log(courses);
    await db.close();
    return res.status(200).json({data: courses});
  }
  res.status(401).json({});
};
export default handler;