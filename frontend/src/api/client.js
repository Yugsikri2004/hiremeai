// API layer: backend se baat karne ka saara code sirf is file mein.
// Kyun alag file? -> components ko fetch/URL ki tension nahi; backend ka URL badle toh sirf yahan badlo.
// Note: yahan koi API key NAHI hai. Groq key sirf backend (.env) mein rehti hai.

// .env mein VITE_API_URL (deploy ke baad Render ka URL), warna local backend
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

// Apna error type: message ke saath HTTP status bhi (429 = rate limit, 0 = server tak pahunche hi nahi)
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Backend ka error message nikaalo ({"detail": "..."}), na mile toh ek simple message
async function readError(res) {
  try {
    const data = await res.json();
    if (typeof data.detail === "string") return data.detail;
  } catch {
    // JSON nahi tha, neeche wala default message chalega
  }
  if (res.status === 429) return "Too many questions in a short time. Please wait a minute and try again.";
  return `Something went wrong on the server (error ${res.status}).`;
}

// fetch fail = server band / internet nahi -> user ko samajh aane wala message
function networkError(err) {
  if (err.name === "AbortError") throw err;
  throw new ApiError("Can't reach HiremeAI right now. The server may be waking up — please try again in a few seconds.", 0);
}

// GET /profile -> sidebar ka data (skills, experience, projects, contact)
export async function fetchProfile(signal) {
  let res;
  try {
    res = await fetch(`${API_URL}/profile`, { signal });
  } catch (err) {
    networkError(err);
  }
  if (!res.ok) throw new ApiError(await readError(res), res.status);
  return res.json();
}

// POST /chat -> answer stream hota hai; har chunk aate hi onChunk(text) call hota hai
// messages = [{role: "user" | "assistant", content: "..."}] (poori history = memory)
export async function streamChat(messages, { onChunk, signal }) {
  let res;
  try {
    res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal,
    });
  } catch (err) {
    networkError(err);
  }
  if (!res.ok) throw new ApiError(await readError(res), res.status);

  // Stream padhna: reader se ek ek chunk (bytes) -> TextDecoder se text
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}

// POST /match -> job description do, candidate ka fit milta hai (score + matching/learning/missing skills)
export async function matchJob(jobDescription, signal) {
  let res;
  try {
    res = await fetch(`${API_URL}/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_description: jobDescription }),
      signal,
    });
  } catch (err) {
    networkError(err);
  }
  if (!res.ok) throw new ApiError(await readError(res), res.status);
  return res.json();
}

// Resume ke links: view = browser mein khulega, download = file save hogi
export const resumeUrl = (download = false) => `${API_URL}/resume${download ? "?download=true" : ""}`;
