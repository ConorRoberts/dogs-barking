import Course from "@dogs-barking/common/types/Course";
import handler from "@pages/api/course/search";
import { NextApiRequest, NextApiResponse } from "next";
import { UOFG_COURSE, UOFT_COURSE } from "@config/regex";
import httpMocks from "node-mocks-http";

test("Search for UofG Courses", async() => {
  const req = httpMocks.createRequest<NextApiRequest>({query: {school: "UOFG"}});
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);

  const data = res._getJSONData();
  expect(res.statusCode).toBe(200);
  expect(data.every((course: Course) => UOFG_COURSE.test(course.id))).toBeTruthy();
});

test("Search for UofT Courses", async() => {
  const req = httpMocks.createRequest<NextApiRequest>({query: {school: "UOFT"}});
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);

  const data = res._getJSONData();
  expect(res.statusCode).toBe(200);
  expect(data.every((course: Course) => UOFT_COURSE.test(course.id))).toBeTruthy();
});

test("Search for 0.5 Weight", async() => {
  const req = httpMocks.createRequest<NextApiRequest>({query: {weight: 0.5}});
  const res = httpMocks.createResponse<NextApiResponse>();
  await handler(req, res);

  const data = res._getJSONData();
  expect(res.statusCode).toBe(200);
  expect(data.every((course: Course) => course.weight === 0.5)).toBeTruthy();
});
