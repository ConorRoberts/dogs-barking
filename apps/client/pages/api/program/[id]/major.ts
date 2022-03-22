import { NextApiRequest, NextApiResponse } from "next";
import getNeo4jDriver from "@utils/getNeo4jDriver";

// returns courses for a major
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method === "GET") {
    const id = req.query.id as string;
    const pageSize = (req.query.pageSize as string) ?? "200";
    const pageNum = (req.query.pageNum as string) ?? "0";

    // validate all program ids from uoft and uofg
    const driver = getNeo4jDriver();
    const db = driver.session();
    
    const queryData = await db.run(
      `
        match (p:Program {id: "${id}"}) 
        -[:MAJOR_REQUIRES]->(c:Course) 
        return p,c
        SKIP(${+pageSize * +pageNum}) 
        LIMIT(${pageSize}) 
      `
    );

    await db.close();
    await driver.close();

    return res.status(200).json({ major: queryData.records.map((e) => ({ course: e.get("c").properties })) });
  }

  res.status(401).json({});
};
export default handler;
