import { test, expect } from "@playwright/test";

test("Check that graph exists and it's for CIS2750", async ({ page }) => {
  await page.goto("/");
  const nodeText = page.locator("[data-id='284'] p");
  await expect(nodeText).toHaveText("CIS2750");
});
