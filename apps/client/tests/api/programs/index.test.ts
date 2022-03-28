import handler from "../../../pages/api/program/index";
import httpMocks from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";

test("Fetch all programs", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({});
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);
  const data = res._getJSONData();
  expect(res.statusCode).toBe(200);
  expect(data.length).toBe(50);
});