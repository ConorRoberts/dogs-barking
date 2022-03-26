import handler from "../../../../../pages/api/program/[id]/index";
import httpMocks from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";

test("Test ID with major, minor, and area", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({query: {id: 6980}});
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);
  
  const program = res._getJSONData().program;
  const major = res._getJSONData().major;
  const minor = res._getJSONData().minor;
  const area = res._getJSONData().area;

  expect(res.statusCode).toBe(200);
  expect(program.degree).toBe("B.A.");
  expect(program.name).toBe("Philosophy");
  expect(program.id).toBe("PHIL");

  expect(major.length).toBe(11);
  expect(minor.length).toBe(6);
  expect(area.length).toBe(6);

});

test("Test ID with only major", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({query: {id: 7075}});
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);
  
  const program = res._getJSONData().program;
  const major = res._getJSONData().major;
  const minor = res._getJSONData().minor;
  const area = res._getJSONData().area;

  expect(res.statusCode).toBe(200);
  expect(program.degree).toBe("B.Comm.");
  expect(program.name).toBe("Management");
  expect(program.id).toBe("MGMT");

  expect(major.length).toBe(27);
  expect(minor.length).toBe(0);
  expect(area.length).toBe(0);
});

test("Test with fake ID", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({query: {id: -1}});
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);
  
  const program = res._getJSONData().program;
  const courses = res._getJSONData().courses;

  expect(res.statusCode).toBe(200);
  expect(program).toStrictEqual({});
  expect(courses.length).toBe(0);
});

