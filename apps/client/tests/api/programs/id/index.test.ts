import handler from "../../../../pages/api/program/[id]/index";
import httpMocks from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";

test("Test ID with major, minor, and area", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({ query: { id: "6980" } });
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);

  const program = res._getJSONData();

  expect(res.statusCode).toBe(200);
  expect(program.degree).toBe("B.A.");
  expect(program.name).toBe("Philosophy");
  expect(program.id).toBe("PHIL");
});

test("Test ID with only major", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({ query: { id: "7075" } });
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);

  const program = res._getJSONData();

  expect(res.statusCode).toBe(200);
  expect(program.degree).toBe("B.Comm.");
  expect(program.name).toBe("Management");
  expect(program.id).toBe("MGMT");
});

test("Test with fake ID", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({ query: { id: "-1" } });
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);

  expect(res.statusCode).toBe(400);
});
