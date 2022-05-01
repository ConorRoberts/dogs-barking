import Course from "@typedefs/Course";
import getNodeColour from "@utils/getNodeColour";

test("8000 level course", () => {
  const test_course:Course = {
    id:"",
    department:"",
    number:8000,
    name:"",
    description:"",
    weight:0,
  };
  const color = getNodeColour(test_course);
  expect(color).toEqual("bg-indigo-600");
});

test("7000 level course", () => {
  const test_course:Course = {
    id:"",
    department:"",
    number:7000,
    name:"",
    description:"",
    weight:0,
  };
  const color = getNodeColour(test_course);
  expect(color).toEqual("bg-orange-900");
});

test("6000 level course", () => {
  const test_course:Course = {
    id:"",
    department:"",
    number:6000,
    name:"",
    description:"",
    weight:0,
  };
  const color = getNodeColour(test_course);
  expect(color).toEqual("bg-emerald-600");
});

test("5000 level course", () => {
  const test_course:Course = {
    id:"",
    department:"",
    number:5000,
    name:"",
    description:"",
    weight:0,
  };
  const color = getNodeColour(test_course);
  expect(color).toEqual("bg-cyan-600");
});

test("4000 level course", () => {
  const test_course:Course = {
    id:"",
    department:"",
    number:4000,
    name:"",
    description:"",
    weight:0,
  };
  const color = getNodeColour(test_course);
  expect(color).toEqual("bg-green-600");
});

test("3000 level course", () => {
  const test_course:Course = {
    id:"",
    department:"",
    number:3000,
    name:"",
    description:"",
    weight:0,
  };
  const color = getNodeColour(test_course);
  expect(color).toEqual("bg-yellow-600");
});

test("2000 level course", () => {
  const test_course:Course = {
    id:"",
    department:"",
    number:2000,
    name:"",
    description:"",
    weight:0,
  };
  const color = getNodeColour(test_course);
  expect(color).toEqual("bg-blue-600");
});

test("1000 level course", () => {
  const test_course:Course = {
    id:"",
    department:"",
    number:1000,
    name:"",
    description:"",
    weight:0,
  };
  const color = getNodeColour(test_course);
  expect(color).toEqual("bg-gray-600");
});

test("0 level course", () => {
  const test_course:Course = {
    id:"",
    department:"",
    number:0,
    name:"",
    description:"",
    weight:0,
  };
  const color = getNodeColour(test_course);
  expect(color).toEqual("bg-gray-600");
});

export {};