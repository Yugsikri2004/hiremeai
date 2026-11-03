// Nakli backend: page.route() se /profile, /chat, /resume ki requests pakad ke tay kiya hua jawab dete hain
export const API = "http://mock-api.test";

export const PROFILE = {
  name: "Yug Sikri",
  headline: "QA Automation Engineer · Learning AI Testing & Development",
  location: "Nilokheri, Haryana, India · Open to relocation",
  summary: "QA Automation Engineer with 1.5 years of experience.",
  total_exp_years: 1.5,
  skills: ["Selenium WebDriver", "Playwright", "Postman"],
  experiences: [
    { company: "73 Strings", role: "QA Automation Engineer", duration: "May 2026 - Aug 2026", description: "UI automation", skills_used: [] },
  ],
  projects: ["HiremeAI – AI career assistant; technologies used: React, FastAPI"],
  education: ["B.E. Computer Science, Chitkara University"],
  certifications: [],
  contact: {
    email: "yugsikri10@gmail.com",
    phone: null,
    linkedin: "https://www.linkedin.com/in/yug-sikri09",
    github: "https://github.com/Yugsikri2004",
  },
};

export const MATCH_RESULT = {
  match_score: 78,
  verdict: "Good match",
  summary: "Yug meets most of the core requirements.",
  matching_skills: ["Selenium", "Playwright"],
  learning_skills: ["LLM testing"],
  missing_skills: ["Appium"],
};

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" };

// options.profile: "ok" | "down" ; options.chat: function(body) -> { status, text } ; options.match: function(body) -> { status, json }
export async function mockBackend(page, options = {}) {
  const chatRequests = []; // test check kar sake frontend ne kya bheja (memory/history)

  await page.route(`${API}/profile`, (route) =>
    options.profile === "down"
      ? route.abort("connectionrefused")
      : route.fulfill({ json: PROFILE, headers: CORS })
  );

  await page.route(`${API}/chat`, async (route) => {
    if (route.request().method() === "OPTIONS") return route.fulfill({ status: 204, headers: CORS });
    const body = route.request().postDataJSON();
    chatRequests.push(body);
    const { status = 200, text = "Yug is a **QA Automation Engineer**." } = options.chat ? options.chat(body) : {};
    const isError = status >= 400;
    return route.fulfill({
      status,
      headers: CORS,
      contentType: isError ? "application/json" : "text/plain",
      body: isError ? JSON.stringify({ detail: text }) : text,
    });
  });

  await page.route(`${API}/match`, async (route) => {
    if (route.request().method() === "OPTIONS") return route.fulfill({ status: 204, headers: CORS });
    const { status = 200, json = MATCH_RESULT } = options.match ? options.match(route.request().postDataJSON()) : {};
    return route.fulfill({ status, headers: CORS, json });
  });

  await page.route(`${API}/resume**`, (route) =>
    route.fulfill({ contentType: "application/pdf", body: "%PDF-1.4 fake", headers: CORS })
  );

  return { chatRequests };
}
