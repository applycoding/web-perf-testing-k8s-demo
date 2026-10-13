import { expect, test } from "@playwright/test";
import { evaluateExperiment, HERO_EXPERIMENT, VISITOR_COOKIE } from "../src/lib/flags";
import { HERO_COPY } from "../src/lib/hero";

function visitorFor(variant: "control" | "treatment"): string {
  for (let index = 0; index < 400; index += 1) {
    const id = `e2e-${variant}-${index}`;
    const assigned = evaluateExperiment(HERO_EXPERIMENT, { targetingKey: id });
    if (assigned.variant === variant) return id;
  }
  throw new Error(`No visitor id for ${variant}`);
}

test("assigns a stable hero variant from the visitor cookie", async ({ context, page }) => {
  const visitorId = visitorFor("treatment");
  await context.addCookies([
    {
      name: VISITOR_COOKIE,
      value: visitorId,
      url: "http://127.0.0.1:3000",
    },
  ]);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(HERO_COPY.treatment.title);
  await expect(page.locator("[data-variant='treatment']")).toBeVisible();
});

test("browses a category and filters the catalog", async ({ page }) => {
  await page.goto("/catalog");
  await page.getByRole("navigation", { name: "Categories" }).getByRole("link", { name: "Camp" }).click();
  await expect(page).toHaveURL(/\/catalog\/camp$/);
  await expect(page.getByRole("heading", { level: 1, name: "Camp" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Trail Lantern" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cedar Field Jacket" })).toHaveCount(0);

  await page.getByLabel("Search this catalog").fill("mug");
  await expect(page.getByRole("heading", { name: "Enamel Camp Mug" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Trail Lantern" })).toHaveCount(0);
  await expect(page.getByText("1 product")).toBeVisible();
});

test("adds a product to the pack dialog", async ({ page }) => {
  await page.goto("/products/enamel-mug");
  await expect(page.getByRole("heading", { level: 1, name: "Enamel Camp Mug" })).toBeVisible();
  await page.getByRole("button", { name: "Add to pack" }).click();
  const dialog = page.getByRole("dialog", { name: "Your pack" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Enamel Camp Mug × 1")).toBeVisible();
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Pack, 1 item" })).toBeVisible();
});

test("accepts vitals and flag lookups", async ({ request }) => {
  const rejected = await request.post("/api/vitals", {
    data: { name: "FID", value: 12, id: "nope" },
  });
  expect(rejected.status()).toBe(400);

  const accepted = await request.post("/api/vitals", {
    data: { name: "LCP", value: 1400, id: "e2e-lcp" },
  });
  expect(accepted.ok()).toBeTruthy();

  const summary = await request.get("/api/vitals");
  const body = (await summary.json()) as {
    summary: { name: string; count: number }[];
  };
  const lcp = body.summary.find((row) => row.name === "LCP");
  expect(lcp?.count).toBeGreaterThan(0);

  const visitorId = visitorFor("control");
  const flags = await request.get(`/api/flags?visitor=${visitorId}`);
  expect(flags.ok()).toBeTruthy();
  const payload = (await flags.json()) as {
    flags: { "hero-headline": { variant: string } };
  };
  expect(payload.flags["hero-headline"].variant).toBe("control");
});
