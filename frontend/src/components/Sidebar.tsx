import { Layers, MessageSquare, Plus, Trash2 } from "lucide-react";
import type { Chat } from "../lib/chats";

interface Props {
  chats: Chat[];
  activeId: string;
  onNew: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  footer: React.ReactNode;
}

export default function Sidebar({
  chats,
  activeId,
  onNew,
  onSelect,
  onDelete,
  footer,
}: Props) {
  return (
    <aside className="flex h-full w-[264px] shrink-0 flex-col border-r border-line bg-surface">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/15 text-brand-soft">
          <Layers size={20} aria-hidden />
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold">Enterprise RAG</div>
          <div className="text-xs text-muted">Agentic Assistant</div>
        </div>
      </div>

      <div className="px-4">
        <button
          type="button"
          onClick={onNew}
          className="flex w-full items-center justify-center gap-2 rounded-xl2 bg-brand px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-soft"
        >
          <Plus size={18} aria-hidden />
          New Chat
        </button>
      </div>

      <div className="px-5 pb-2 pt-6 text-xs font-medium text-muted">
        Recent Chats
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-3" aria-label="Recent chats">
        {chats.length === 0 && (
          <p className="px-2 py-2 text-xs text-muted">No conversations yet.</p>
        )}
        <ul className="space-y-0.5">
          {chats.map((chat) => {
            const active = chat.id === activeId;
            return (
              <li key={chat.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onSelect(chat.id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center gap-2.5 rounded-lg py-2.5 pl-3 pr-9 text-left text-sm transition ${
                    active
                      ? "bg-brand/20 text-ink"
                      : "text-muted hover:bg-white/5 hover:text-ink"
                  }`}
                >
                  <MessageSquare size={16} className="shrink-0" aria-hidden />
                  <span className="truncate">{chat.title}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(chat.id)}
                  aria-label={`Delete chat ${chat.title}`}
                  className="absolute right-1.5 top-1/2 hidden -translate-y-1/2 rounded-md p-1.5 text-muted transition hover:bg-white/10 hover:text-ink focus-visible:block group-hover:block"
                >
                  <Trash2 size={14} aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line p-3">{footer}</div>
    </aside>
  );
}
