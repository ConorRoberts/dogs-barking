import { NextApiRequest, NextApiResponse } from "next";
import getNeo4jDriver from "@utils/getNeo4jDriver";

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
      const pageSize = (req.query.pageSize as string) ?? "200";
      const pageNum = (req.query.pageNum as string) ?? "0";

      // validate all program ids from uoft and uofg
      const driver = getNeo4jDriver();

      const db = driver.session();

      // run all required queries
      const querydata = await db.run(
        `
            match (p:Program) 
            -[:MAJOR_REQUIRES|:MINOR_REQUIRES|:AREA_REQUIRES]->(c:Course)
            where id(p) = $nodeId 
            return p, c
            SKIP(${+pageSize * +pageNum}) 
            LIMIT(${pageSize}) 
            `,
        { nodeId: +id }
      );

      if (querydata.records.length == 0) {
        // send empty object if nothing is found
        return res.status(200).json({ program: {}, courses: [] });
      }

      const majorData = await db.run(
        `
        match (p:Program) 
        -[:MAJOR_REQUIRES]->(c:Course) 
        where id(p) = $nodeId
        return c, id(c) as nodeId
        SKIP(${+pageSize * +pageNum}) 
        LIMIT(${pageSize}) 
      `,
        { nodeId: +id }
      );
      // console.log(majorData);
      const minorData = await db.run(
        `
        match (p:Program) 
        -[:MINOR_REQUIRES]->(c:Course)
        where id(p) = $nodeId
        return c,id(c) as nodeId
        SKIP(${+pageSize * +pageNum}) 
        LIMIT(${pageSize}) 
      `,
        { nodeId: +id }
      );
      const areaData = await db.run(
        `
        match (p:Program) 
        -[:AREA_REQUIRES]->(c:Course)
        where id(p) = $nodeId 
        return c, id(c) as nodeId
        SKIP(${+pageSize * +pageNum}) 
        LIMIT(${pageSize}) 
      `,
        { nodeId: +id }
        
      );

      await db.close();
      await driver.close();

      return res.status(200).json({
        program: querydata.records[0].get("p").properties,
        major: majorData.records.map((e) => ({ ...e.get("c").properties, nodeId: e.get("nodeId").low })),
        minor: minorData.records.map((e) => ({ ...e.get("c").properties, nodeId: e.get("nodeId").low })),
        area: areaData.records.map((e) => ({ ...e.get("c").properties, nodeId: e.get("nodeId").low })),
      });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
export default handler;
