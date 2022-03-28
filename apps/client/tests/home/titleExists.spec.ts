import { test, expect } from "@playwright/test";

test("Check that page renders and title appears", async ({ page }) => {
  await page.goto("/");
  const title = page.locator("h1");
  await expect(title).toHaveText("Dogs Barking Inc.");
});

