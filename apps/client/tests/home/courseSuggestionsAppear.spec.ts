import { test, expect } from "@playwright/test";

test("Course search autocomplete provides valid suggestions", async ({ page }) => {
  await page.goto("/");

  const searchInput = page.locator("input[placeholder='Course code']");

  await searchInput.type("CIS2750");

  await page.waitForTimeout(100);

  const suggestion = page.locator("div.absolute.top-full > div[href *= '/course/'] p:nth-child(1)");

  await expect(suggestion).toHaveText("CIS2750");
});
