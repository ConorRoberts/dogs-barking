import { NextApiRequest, NextApiResponse } from "next";
import neo4j from "neo4j-driver";

// returns courses for a minor
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method === "GET") {
    const id = req.query.id as string;
    const pageSize = (req.query.pageSize as string) ?? "200";
    const pageNum = (req.query.pageNum as string) ?? "0";
    // validate all program ids from uoft and uofg
    // if(!combined_regex.test(id)) res.status(500).json({message:"Invalid Program ID"})
    const driver = neo4j.driver("neo4j://100.24.23.121/", neo4j.auth.basic("neo4j", "th3yd0b3b4rk1ng"));
    const db = driver.session();
    const querydata = await db.run(
      `
            match (p:Program) 
            -[:MINOR_REQUIRES]->(c:Course)
            where id(p) = ${id}
            return p,c
            `,
      {}
    );

    const programs = [];
    for (const record of querydata.records) {
      programs.push({ course: record.get("c").properties });
    }
    await db.close();
    await driver.close();
    return res.status(200).json({ minor: programs });
  }
  res.status(401).json({});
};
export default handler;
