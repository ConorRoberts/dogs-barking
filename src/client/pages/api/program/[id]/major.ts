import { NextApiRequest, NextApiResponse } from "next";
import getNeo4jDriver from "@utils/getNeo4jDriver";

// returns courses for a major
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  if (method === "GET") {
    const id = req.query.id as string;

    // validate all program ids from uoft and uofg
    const driver = getNeo4jDriver();
    const db = driver.session();
    
    const queryData = await db.run(
      `
        match (p:Program) 
        -[:MAJOR_REQUIRES]->(c:Course)
        where id(p) = ${id}
        return p,c
      `
    );

    await db.close();
    await driver.close();

    return res.status(200).json({ major: queryData.records.map((e) => ({ course: e.get("c").properties })) });
  }

  res.status(401).json({});
};
export default handler;
