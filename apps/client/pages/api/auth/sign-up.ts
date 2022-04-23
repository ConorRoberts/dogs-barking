import createUser from "@utils/createUser";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @POST Create a new user
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  try {
    if (method === "GET") {
      return res.status(200).json({});
    } else if (method === "POST") {
      await createUser(req.body);
      return res.status(201).json({});
    } else {
      return new Error("Method unsupported");
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

export default handler;