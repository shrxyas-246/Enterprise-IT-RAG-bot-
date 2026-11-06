# Frontend — Enterprise RAG Assistant

React 18 + Vite + TypeScript + Tailwind. Talks to the FastAPI backend in `../app`.

## Run

Two terminals, from the repo root:

```bash
# 1. backend  (http://127.0.0.1:8000)
pip install -r requirements.txt
uvicorn app.main:app --reload

# 2. frontend (http://127.0.0.1:5173)
cd frontend
npm install
npm run dev
```

Open http://127.0.0.1:5173.

In dev, Vite proxies `/api/*` to `http://127.0.0.1:8000`, so there is no CORS
hop and no base URL to configure. For a deployed build where the API lives on a
different origin, set `VITE_API_BASE`:

```bash
VITE_API_BASE=https://api.example.com npm run build
```

The backend also allows CORS from `localhost:5173` / `127.0.0.1:5173` directly.

## Endpoints used

| Endpoint | Used by |
|---|---|
| `GET /api/health` | connection dot in the Admin menu, polled every 30 s |
| `POST /api/chat` | the composer — `{question}` → `{answer, source_used, citations, trace}` |
| `POST /api/ingest` | the paperclip — multipart `file` + `X-Admin-Key` header |

Uploads require the admin key from `ADMIN_API_KEY` in `.env`. Enter it once via
the **Admin** menu at the bottom of the sidebar; it is kept in `localStorage`.
Accepted file types: `.pdf`, `.txt`, `.md`, `.docx`.

## What the UI shows

- **Source badge** on every answer, from `source_used` — Private KB, Web search,
  Direct answer, or No reliable evidence.
- **Sources** panel built from `citations`; web citations link out, KB citations
  show the file name.
- **Agent steps** (collapsed) built from `trace`, so the routing / grading /
  rewrite path the graph took is visible.
- Chat history is per-browser, in `localStorage` — the backend stores only the
  audit log in SQLite.

## Build

```bash
npm run build   # tsc -b && vite build → dist/
npm run preview
```
