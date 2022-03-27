import handler from "../../../pages/api/course";
import httpMocks from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";
import { UOFG_COURSE, UOFT_COURSE } from "@config/regex";
import Course from "@dogs-barking/common/types/Course";

test("Fetch all UofG courses", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({ query: { school: "UOFG" } });
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);

  const data = res._getJSONData();
  expect(res.statusCode).toBe(200);
  expect(data.every((course: Course) => UOFG_COURSE.test(course.id))).toBeTruthy();
});

test("Fetch all UofT courses", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({ query: { school: "UOFT" } });
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);

  const data = res._getJSONData();
  expect(res.statusCode).toBe(200);
  expect(data.every((course: Course) => UOFT_COURSE.test(course.id))).toBeTruthy();
});

test("Fetch with fake school", async () => {
  const req = httpMocks.createRequest<NextApiRequest>({ query: { school: "Fake" } });
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);

  const data = res._getJSONData();
  expect(res.statusCode).toBe(200);
  expect(data.length).toBe(0);
});
