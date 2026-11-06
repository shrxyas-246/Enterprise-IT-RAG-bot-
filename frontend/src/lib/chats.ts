import type { Citation, SourceUsed } from "./api";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: number;
  sourceUsed?: SourceUsed;
  citations?: Citation[];
  trace?: string[];
  error?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

const KEY = "enterprise-rag.chats.v1";

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyChat(): Chat {
  return { id: newId(), title: "New Chat", messages: [], updatedAt: Date.now() };
}

export function titleFrom(question: string): string {
  const clean = question.trim().replace(/\s+/g, " ");
  if (clean.length <= 38) return clean;
  return `${clean.slice(0, 38).trimEnd()}…`;
}

export function loadChats(): Chat[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Chat[]) : [];
  } catch {
    return [];
  }
}

export function saveChats(chats: Chat[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(chats.slice(0, 50)));
  } catch {
    /* storage unavailable — history is a convenience only */
  }
}

export function formatTime(at: number): string {
  return new Date(at).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}
