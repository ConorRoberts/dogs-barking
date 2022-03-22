import handler from "../../../../pages/api/db/course/school";
import httpMocks from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";

test("Fetch all UofG courses", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({query: {school: "UofG"}});
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);
  
  const data = res._getJSONData().data;
  expect(res.statusCode).toBe(200);
  expect(data.length).toBe(200);
});

test("Fetch all UofT courses", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({query: {school: "UofT"}});
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);
  
  const data = res._getJSONData().data;
  expect(res.statusCode).toBe(200);
  expect(data.length).toBe(200);
});

test("Fetch with fake school", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({query: {school: "Fake"}});
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);
  
  const data = res._getJSONData().data;
  expect(res.statusCode).toBe(200);
  expect(data.length).toBe(0);
});