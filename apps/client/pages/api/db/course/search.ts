import { NextApiRequest, NextApiResponse } from "next";
import { Query } from "@dogs-barking/common/types/Input";
import DBSearchString from "@utils/DBSearchString";
import getNeo4jDriver from "@utils/getNeo4jDriver";

/**
 * @swagger
 * /api/db/course/search:
 *  get:
 *    summary: Get all courses based on specific search criteria
 *    parameters:
 *    - name: query
 *      in: body
 *      required: true
 *      description: search criteria object
 *      schema:
 *        type: object
 *        properties:
 *          query:
 *            $ref: '#/components/schemas/CourseSearch'
 *    tags: [Course]
 *    description: Returns all the courses for search criteria
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
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method === "GET") {
    const pageSize = (req.query.pageSize as string) ?? "200";
    const pageNum = (req.query.pageNum as string) ?? "0";
    const queryParams: Query = JSON.parse(req.query.filters as string);
    console.log(queryParams);
    const driver = getNeo4jDriver();
    const db = driver.session();
    let searchStr = DBSearchString(queryParams);
    searchStr += ` SKIP(${+pageSize * +pageNum}) LIMIT(${pageSize})`;
    //console.log(searchStr);
    const queryData = await db.run(searchStr);
    const courses = [];
    for (const record of queryData.records) {
      courses.push(record.get(0).properties);
    }
    //console.log(courses);
    await db.close();
    return res.status(200).json(courses);
  }
  res.status(401).json({});
};
export default handler;
