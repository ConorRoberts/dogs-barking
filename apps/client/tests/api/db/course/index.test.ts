import handler from "../../../../pages/api/db/course/index";
import httpMocks from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";

test("Fetch all course data", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({});
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);
  const data = res._getJSONData().data;
  expect(res.statusCode).toBe(200);
  expect(data.length).toBe(200);
});