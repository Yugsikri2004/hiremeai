// JD Matcher E2E: HR job description paste karta hai -> score card
import { expect, test } from "@playwright/test";
import { mockBackend } from "./mocks";

const JD = "We are hiring a QA Automation Engineer with Selenium, Playwright, API testing and Appium experience.";

const dialog = (page) => page.getByRole("dialog", { name: "Job description match" });

test("welcome button opens the matcher and shows score with skill groups", async ({ page }) => {
  let sentBody;
  await mockBackend(page, { match: (body) => ((sentBody = body), {}) });
  await page.goto("/");
  await page.getByRole("button", { name: /Hiring for a role/ }).click();

  const d = dialog(page);
  await expect(d).toBeVisible();
  await d.getByPlaceholder("Paste the job description here…").fill(JD);
  await d.getByRole("button", { name: "Analyse match" }).click();

  await expect(d.getByLabel("Match score 78 out of 100")).toBeVisible();
  await expect(d.getByText("Good match")).toBeVisible();
  await expect(d.getByText("Selenium")).toBeVisible();
  await expect(d.getByText("LLM testing")).toBeVisible();
  await expect(d.getByText("Appium")).toBeVisible();
  expect(sentBody).toEqual({ job_description: JD });
});

test("analyse is disabled until the JD has 50 characters", async ({ page }) => {
  await mockBackend(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Match a job description" }).click();
  const d = dialog(page);
  const analyse = d.getByRole("button", { name: "Analyse match" });

  await expect(analyse).toBeDisabled();
  await d.getByPlaceholder("Paste the job description here…").fill("QA job");
  await expect(d.getByText("At least 50 characters")).toBeVisible();
  await expect(analyse).toBeDisabled();
});

test("server error is shown and user can try again", async ({ page }) => {
  let fail = true;
  await mockBackend(page, {
    match: () => (fail ? { status: 502, json: { detail: "Couldn't analyse this job description right now." } } : {}),
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Match a job description" }).click();
  const d = dialog(page);
  await d.getByPlaceholder("Paste the job description here…").fill(JD);
  await d.getByRole("button", { name: "Analyse match" }).click();
  await expect(d.getByRole("alert")).toContainText("Couldn't analyse");

  fail = false;
  await d.getByRole("button", { name: "Analyse match" }).click();
  await expect(d.getByLabel("Match score 78 out of 100")).toBeVisible();
});

test("Try another job resets the form, Esc closes the popup", async ({ page }) => {
  await mockBackend(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Match a job description" }).click();
  const d = dialog(page);
  await d.getByPlaceholder("Paste the job description here…").fill(JD);
  await d.getByRole("button", { name: "Analyse match" }).click();
  await d.getByRole("button", { name: "Try another job" }).click();
  await expect(d.getByPlaceholder("Paste the job description here…")).toHaveValue("");

  await page.keyboard.press("Escape");
  await expect(d).toHaveCount(0);
});

test("matcher buttons are disabled when backend is offline", async ({ page }) => {
  await mockBackend(page, { profile: "down" });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Match a job description" })).toBeDisabled();
  await expect(page.getByRole("button", { name: /Hiring for a role/ })).toBeDisabled();
});
