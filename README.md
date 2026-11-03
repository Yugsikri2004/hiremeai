# HiremeAI 🤖

**Your career, one conversation away.**

A personal AI career assistant: recruiters chat with an AI that answers questions about Yug Sikri
using **only** his real resume and profile — no invented experience.

## Tech stack
| Part | Tech |
|---|---|
| Backend | Python, FastAPI, Groq (`openai/gpt-oss-120b`), Pydantic, streaming responses |
| Frontend | React (Vite), plain CSS (dark theme), react-markdown |

## Folder structure
```
hiremeai/
├── backend/
│   ├── main.py              ← FastAPI app (/, /profile, /resume, /chat)
│   ├── Yug.pdf              ← resume (replace this file to update the resume)
│   └── data/
│       ├── resume.json      ← auto-generated from Yug.pdf (cache)
│       ├── extra_info.md    ← info beyond the resume (goals, availability, ...)
│       └── profile_card.json← sidebar info (headline, location, LinkedIn, GitHub)
└── frontend/
    └── src/
        ├── api/client.js    ← all backend calls (no API keys here)
        ├── hooks/           ← useChat (chat logic), useProfile (profile + status)
        ├── components/      ← Sidebar, ChatHeader, WelcomeScreen, MessageList, ChatInput, ResumeModal
        └── data/questions.js← suggested + follow-up questions
```

## Run locally
Needs `GROQ_API_KEY` in a `.env` file (backend folder or a parent folder).

Backend (from `hiremeai/`):
```bash
uv run uvicorn main:app --app-dir backend --reload
```

Frontend (from `hiremeai/frontend/`):
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Updating the content
- **New resume:** replace `backend/Yug.pdf` and restart the backend — it re-parses automatically.
- **Extra info / headline / links:** edit the files in `backend/data/` and restart the backend.

## Security
- Groq API key stays in the backend `.env` only (never in frontend code).
- Input validation (message length, history size, roles) with Pydantic.
- Basic rate limit: 15 chat requests per minute per IP.
- No public upload endpoint — the resume can only be changed by replacing the file on the server.

## Still to do
- Deploy backend (Render) and frontend (Vercel); set `VITE_API_URL` (frontend) and `FRONTEND_URL` (backend).
- Add GitHub link in `backend/data/profile_card.json` when ready.
- Screenshots for this README.
