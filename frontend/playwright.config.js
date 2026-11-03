import { defineConfig, devices } from "@playwright/test";

// E2E tests: asli browser mein app kholke click/type karte hain.
// Backend ko mock karte hain (tests/e2e/mocks.js) -> na Render chahiye, na Groq quota kharch hota hai.
// Chalao: npm run test:e2e

const PORT = 5174; // 5173 pe dev server chal raha ho toh takraaye nahi

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure", // fail hua toh trace file -> step by step dekh sakte ho kya hua
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    // Nakli backend URL: saari requests yahan jaati hain aur tests inhe page.route() se pakad lete hain
    env: { VITE_API_URL: "http://mock-api.test" },
  },
});
