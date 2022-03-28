
import handler from "../../../../pages/api/course/[id]";
import httpMocks from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";

test("Fetch course with Guelph Course ID", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({query: {id: "2"}});
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);

  const data = res._getJSONData();
  expect(res.statusCode).toBe(200);
  expect(data.number).toBe(1220);
  expect(data.name).toBe("Introductory Financial Accounting");
  expect(data.weight).toBe(0.5);
  expect(data.id).toBe("ACCT1220");
  expect(data.department).toBe("ACCT");
});

test("Fetch course with UofT Course ID", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({query: {id: "6261"}});
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);

  const data = res._getJSONData();
  expect(res.statusCode).toBe(200);
  expect(data.number).toBe(305);
  expect(data.name).toBe("Design and Analysis of Experiments");
  expect(data.weight).toBe(0.5);
  expect(data.id).toBe("STA305H1");
  expect(data.department).toBe("STA");
});

test("Fetch course with Invalid Course ID", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({query: {id: "Fake Course"}});
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);

  expect(res.statusCode).toBe(400);
});