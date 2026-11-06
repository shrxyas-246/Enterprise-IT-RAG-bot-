// Mirrors the Pydantic models in app/api/router.py

export type SourceUsed =
  | "private_kb"
  | "web_search"
  | "direct"
  | "insufficient_evidence"
  | string;

export interface Citation {
  title: string;
  url: string;
  type: "private_kb" | "web" | string;
}

export interface ChatResponse {
  answer: string;
  source_used: SourceUsed;
  citations: Citation[];
  trace: string[];
}

export interface IngestResponse {
  filename: string;
  documents: number;
  chunks: number;
}

export interface HealthResponse {
  status: string;
  app_name: string;
  env: string;
  model: string;
  index: string;
}

const BASE = import.meta.env.VITE_API_BASE ?? "";

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.detail === "string") return data.detail;
    if (Array.isArray(data?.detail)) {
      return data.detail.map((d: { msg?: string }) => d.msg ?? "").join("; ");
    }
    return `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

export async function sendChat(
  question: string,
  signal?: AbortSignal,
): Promise<ChatResponse> {
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
    signal,
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function ingestFile(
  file: File,
  adminKey: string,
): Promise<IngestResponse> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/api/ingest`, {
    method: "POST",
    headers: { "X-Admin-Key": adminKey },
    body: form,
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${BASE}/api/health`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export const SUPPORTED_EXTENSIONS = [".pdf", ".txt", ".md", ".docx"];
