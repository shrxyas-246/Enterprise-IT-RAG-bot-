import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Layers, User } from "lucide-react";
import type { Message as ChatMessage } from "../lib/chats";
import { formatTime } from "../lib/chats";
import Sources from "./Sources";
import SourceBadge from "./SourceBadge";
import Trace from "./Trace";

function Avatar({ role }: { role: "user" | "assistant" }) {
  const isUser = role === "user";
  return (
    <div
      aria-hidden
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
        isUser ? "bg-elevated text-muted" : "bg-brand/20 text-brand-soft"
      }`}
    >
      {isUser ? <User size={17} /> : <Layers size={17} />}
    </div>
  );
}

export default function Message({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <article className="flex animate-rise gap-4 px-2">
      <Avatar role={message.role} />
      <div
        className={`min-w-0 flex-1 rounded-xl2 border px-5 py-4 ${
          isUser
            ? "border-line bg-panel"
            : message.error
              ? "border-red-500/30 bg-red-500/5"
              : "border-line bg-panel"
        }`}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-medium text-muted">
            {isUser ? "You" : "Assistant"}
          </span>
          {!isUser && message.sourceUsed && (
            <SourceBadge source={message.sourceUsed} />
          )}
          <time className="ml-auto text-xs text-muted">
            {formatTime(message.at)}
          </time>
        </div>

        <div className="prose-chat">
          <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
        </div>

        {!isUser && message.citations && (
          <Sources citations={message.citations} />
        )}
        {!isUser && message.trace && <Trace trace={message.trace} />}
      </div>
    </article>
  );
}
