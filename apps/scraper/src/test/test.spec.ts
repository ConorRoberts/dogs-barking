import { test, expect } from "@playwright/test";
const requisiteFormat = (id: string, text: string): any => null;

test("Test prerequisite parsing", () => {
  expect(
    requisiteFormat("CIS2520", "7.50 credits, including DAGR*1070 - Must be completed prior to taking this course.")
  ).toStrictEqual({
    OR_BLOCKS: [],
    AND_BLOCKS: [],
    PREREQUISITES: ["DAGR1070"],
    CREDIT_REQUIREMENTS: [{ target: 7.5, type: "any" }],
  });

  expect(
    requisiteFormat(
      "CIS2520",
      "(ACCT*3330 or BUS*3330), (ACCT*3340 or BUS*3340) - Must be completed prior to taking this course."
    )
  ).toStrictEqual({
    OR_BLOCKS: [
      { type: "course", courses: ["ACCT3330", "BUS3330"], target: 1 },
      { type: "course", courses: ["ACCT3340", "BUS3340"], target: 1 },
    ],
    AND_BLOCKS: [],
    PREREQUISITES: [],
  });

  expect(
    requisiteFormat(
      "CIS2520",
      "14.00 credits including [(PSYC*2040 or PSYC*3290) ), 1.00  credits in Psychology at the 3000 level]   - Must be completed prior to taking this course."
    )
  ).toStrictEqual({
    OR_BLOCKS: [{ type: "course", courses: ["PSYC4500", "PSYC4510"], target: 1 }],
    AND_BLOCKS: [],
    PREREQUISITES: ["PSYC4500", "PSYC4510"],
    CREDIT_REQUIREMENTS: [{ target: 7.5, type: "any" }],
  });
  expect(
    requisiteFormat(
      "CIS2520",
      "15.00 credits and 75% grade point average   - Must be completed prior to taking this course."
    )
  ).toStrictEqual({
    OR_BLOCKS: [{ type: "course", courses: ["PSYC4500", "PSYC4510"], target: 1 }],
    AND_BLOCKS: [],
    PREREQUISITES: ["PSYC4500", "PSYC4510"],
    CREDIT_REQUIREMENTS: [{ target: 7.5, type: "any" }],
  });
  expect(
    requisiteFormat(
      "CIS2520",
      "14.00 credits including [PSYC*2310, PSYC*3250, (PSYC*2040  or PSYC*3290) ), 0.50 credits in Psychology at the 3000  level]   - Must be completed prior to taking this course."
    )
  ).toStrictEqual({
    OR_BLOCKS: [{ type: "course", courses: ["PSYC4500", "PSYC4510"], target: 1 }],
    AND_BLOCKS: [],
    PREREQUISITES: ["PSYC4500", "PSYC4510"],
    CREDIT_REQUIREMENTS: [{ target: 7.5, type: "any" }],
  });
  expect(
    requisiteFormat(
      "CIS2520",
      "14.00 credits including [PSYC*3250, (1 of PSYC*2070,  PSYC*3070, PSYC*3080, PSYC*3490), (PSYC*2040 or PSYC*3290)  ), 0.50 credits in Psychology at the 3000 level]   - Must be completed prior to taking this course."
    )
  ).toStrictEqual({
    OR_BLOCKS: [{ type: "course", courses: ["PSYC4500", "PSYC4510"], target: 1 }],
    AND_BLOCKS: [],
    PREREQUISITES: ["PSYC4500", "PSYC4510"],
    CREDIT_REQUIREMENTS: [{ target: 7.5, type: "any" }],
  });
  expect(
    requisiteFormat(
      "CIS2750",
      "CIS*2520, (CIS*2430 or ENGG*1420)   - Must be completed prior to taking this course."
    )
  ).toStrictEqual({
    OR_BLOCKS: [{ type: "course", courses: ["CIS2430", "CIS1420"], target: 1 }],
    AND_BLOCKS: [],
    PREREQUISITES: ["CIS2520"],
    CREDIT_REQUIREMENTS: [{ target: 7.5, type: "any" }],
  });
});
