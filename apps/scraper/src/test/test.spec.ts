import { test, expect } from "@playwright/test";
import requisiteFormat from "../requisiteFormat";

test("Test prerequisite parsing", () => {
  expect(
    requisiteFormat("7.50 credits, including DAGR*1070 - Must be completed prior to taking this course.")
  ).toStrictEqual([
    "DAGR1070",
    {
      credits: 7.5,
    },
  ]);

  expect(
    requisiteFormat("(ACCT*3330 or BUS*3330), (ACCT*3340 or BUS*3340) - Must be completed prior to taking this course.")
  ).toStrictEqual(["ACCT3330", "ACCT3340", "BUS3330", "BUS3340"]);
});
