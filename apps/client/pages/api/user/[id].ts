import getUser from "@utils/getUser";
import updateUser from "@utils/updateUser";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "GET") {
      const id = req.query.id as string;
      return res.status(200).json(await getUser(id));
    } else if (method === "POST") {
      const id = req.query.id as string;
      return res.status(201).json(await updateUser(id, req.body));
    } else {
      return new Error("Method unsupported");
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

export default handler;
