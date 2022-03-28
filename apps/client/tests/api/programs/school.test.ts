import handler from "../../../pages/api/program/school";
import httpMocks from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";

test("Fetch with fake school", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({ query: { school: "Fake" } });
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);

  expect(res.statusCode).toBe(200);
});
