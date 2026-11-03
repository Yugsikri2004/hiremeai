// HiremeAI E2E tests: recruiter jo karega wahi flow (welcome -> sawaal -> answer -> follow-up -> resume)
import { expect, test } from "@playwright/test";
import { mockBackend } from "./mocks";

const input = (page) => page.getByPlaceholder("Ask about skills, projects…");
const sendButton = (page) => page.getByRole("button", { name: "Send message" });
// Mobile pe status ka text chhupa hota hai (sirf dot) -> class se check karte hain, dono pe chalega
const statusPill = (page) => page.locator(".status-pill");

// Mobile pe sidebar ek drawer hai -> pehle kholna padta hai
async function openSidebar(page, isMobile) {
  if (isMobile) await page.getByRole("button", { name: "Open candidate profile" }).click();
  return page.getByRole("complementary", { name: "Candidate profile" });
}

test.describe("welcome + status", () => {
  test("shows online status and all 7 suggested questions", async ({ page }) => {
    await mockBackend(page);
    await page.goto("/");
    await expect(statusPill(page)).toHaveClass(/status-online/);
    await expect(page.getByText("Tell me about yourself.")).toBeVisible();
    await expect(page.getByText("Why should we hire you?")).toBeVisible();
  });

  test("shows offline banner when backend is down, and recovers on retry", async ({ page }) => {
    await mockBackend(page, { profile: "down" });
    await page.goto("/");
    await expect(statusPill(page)).toHaveClass(/status-offline/);
    await expect(page.getByRole("status").filter({ hasText: "Can't reach HiremeAI" })).toBeVisible();

    // backend wapas aa gaya -> Retry se online
    await page.unroute("http://mock-api.test/profile");
    await mockBackend(page);
    await page.getByRole("status").getByRole("button", { name: "Retry" }).click();
    await expect(statusPill(page)).toHaveClass(/status-online/);
  });
});

test.describe("chat", () => {
  test("suggestion card sends the question and renders the markdown answer", async ({ page }) => {
    await mockBackend(page);
    await page.goto("/");
    await page.getByText("Tell me about yourself.").click();

    const log = page.getByRole("log", { name: "Conversation" });
    await expect(log.getByText("Tell me about yourself.")).toBeVisible();
    // **bold** markdown -> <strong>
    await expect(log.locator("strong", { hasText: "QA Automation Engineer" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy response" })).toBeVisible();
  });

  test("typing + Enter sends; empty input cannot be sent", async ({ page }) => {
    await mockBackend(page);
    await page.goto("/");
    await expect(sendButton(page)).toBeDisabled();
    await input(page).fill("   ");
    await expect(sendButton(page)).toBeDisabled();

    await input(page).fill("What automation tools do you know?");
    await input(page).press("Enter");
    await expect(page.getByRole("log").getByText("What automation tools do you know?")).toBeVisible();
    await expect(input(page)).toHaveValue("");
  });

  test("sends earlier messages as history (memory)", async ({ page }) => {
    const { chatRequests } = await mockBackend(page);
    await page.goto("/");
    await input(page).fill("Tell me about your experience");
    await input(page).press("Enter");
    await expect(page.getByRole("button", { name: "Copy response" })).toBeVisible();

    await input(page).fill("What did you do in the first one?");
    await input(page).press("Enter");
    await expect.poll(() => chatRequests.length).toBe(2);

    const roles = chatRequests[1].messages.map((m) => m.role);
    expect(roles).toEqual(["user", "assistant", "user"]);
    expect(chatRequests[1].messages[0].content).toBe("Tell me about your experience");
  });

  test("shows follow-up questions after an answer", async ({ page }) => {
    await mockBackend(page);
    await page.goto("/");
    await page.getByText("Tell me about yourself.").click();
    const followUps = page.getByLabel("Suggested follow-up questions");
    await expect(followUps.getByRole("button").first()).toBeVisible();
    // jo sawaal pooch chuke, wo follow-up mein dobara nahi aata
    await expect(followUps.getByText("Tell me about yourself.")).toHaveCount(0);
  });

  test("server error shows error card; Retry resends without duplicating the question", async ({ page }) => {
    let fail = true;
    await mockBackend(page, {
      chat: () => (fail ? { status: 429, text: "Too many questions in a short time." } : {}),
    });
    await page.goto("/");
    await input(page).fill("When can you join?");
    await input(page).press("Enter");

    const alert = page.getByRole("alert");
    await expect(alert).toContainText("Too many questions");
    await expect(page.getByRole("log").getByText("When can you join?")).toHaveCount(1);

    fail = false;
    await alert.getByRole("button", { name: "Retry" }).click();
    await expect(page.getByRole("alert")).toHaveCount(0);
    await expect(page.getByRole("log").getByText("When can you join?", { exact: true })).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Copy response" })).toBeVisible();
  });

  test("New chat clears the conversation", async ({ page }) => {
    await mockBackend(page);
    await page.goto("/");
    await page.getByText("What are your technical skills?").click();
    await expect(page.getByRole("button", { name: "Copy response" })).toBeVisible();

    await page.getByRole("button", { name: /New chat|Clear conversation/ }).click();
    await expect(page.getByText("Try asking")).toBeVisible();
    await expect(page.getByRole("log")).toHaveCount(0);
  });

  test("question longer than 1000 characters is cut before sending", async ({ page }) => {
    const { chatRequests } = await mockBackend(page);
    await page.goto("/");
    await input(page).fill("a".repeat(1200));
    await input(page).press("Enter");
    await expect.poll(() => chatRequests.length).toBe(1);
    expect(chatRequests[0].messages.at(-1).content.length).toBeLessThanOrEqual(1000);
  });
});

test.describe("profile sidebar", () => {
  test("shows name, skills and GitHub link in Contact tab", async ({ page, isMobile }) => {
    await mockBackend(page);
    await page.goto("/");
    const sidebar = await openSidebar(page, isMobile);
    await expect(sidebar.getByText("Yug Sikri").first()).toBeVisible();
    await expect(sidebar.getByText("Playwright")).toBeVisible();

    await sidebar.getByRole("tab", { name: "Contact" }).click();
    await expect(sidebar.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/Yugsikri2004");
  });

  test("View Resume opens the preview and Esc closes it", async ({ page, isMobile }) => {
    await mockBackend(page);
    await page.goto("/");
    const sidebar = await openSidebar(page, isMobile);
    await sidebar.getByRole("button", { name: "View Resume" }).click();

    const dialog = page.getByRole("dialog", { name: "Resume preview" });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("iframe")).toHaveAttribute("src", "http://mock-api.test/resume");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });
});
