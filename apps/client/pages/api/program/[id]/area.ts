import { NextApiRequest, NextApiResponse } from "next";
import getNeo4jDriver from "@utils/getNeo4jDriver";

// returns every program from neo4j database
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method === "GET") {
    const programId = req.query.programId as string;
    const pageSize = (req.query.pageSize as string) ?? "200";
    const pageNum = (req.query.pageNum as string) ?? "0";
    const driver = getNeo4jDriver();
    const db = driver.session();
    const querydata = await db.run(
      `
        match (p:Program) 
        -[:AREA_REQUIRES]->(c:Course) 
        where id(p) = $programId
        return p,c
        SKIP(${+pageSize * +pageNum}) 
        LIMIT(${pageSize}) 
      `,
      { programId: +programId }
    );

    const programs = [];
    for (const record of querydata.records) {
      programs.push({ course: record.get("c").properties });
    }
    await db.close();
    await driver.close();
    return res.status(200).json({ area: programs });
  }
  res.status(401).json({});
};
export default handler;
