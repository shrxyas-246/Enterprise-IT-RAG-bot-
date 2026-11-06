import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, Square } from "lucide-react";
import { SUPPORTED_EXTENSIONS } from "../lib/api";

interface Props {
  busy: boolean;
  onSend: (question: string) => void;
  onStop: () => void;
  onAttach: (file: File) => void;
}

export default function Composer({ busy, onSend, onStop, onAttach }: Props) {
  const [value, setValue] = useState("");
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [value]);

  function submit() {
    const question = value.trim();
    if (!question || busy) return;
    onSend(question);
    setValue("");
  }

  return (
    <div className="px-6 pb-6 pt-2">
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-xl2 border border-brand/50 bg-panel px-3 py-2.5 transition focus-within:border-brand">
        <input
          ref={fileRef}
          type="file"
          accept={SUPPORTED_EXTENSIONS.join(",")}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onAttach(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          aria-label="Upload a document to the knowledge base"
          title="Upload a document to the knowledge base (admin)"
          className="rounded-lg p-2 text-muted transition hover:bg-white/5 hover:text-ink"
        >
          <Paperclip size={18} aria-hidden />
        </button>

        <div className="h-6 w-px shrink-0 self-center bg-line" />

        <textarea
          ref={areaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Ask a question..."
          aria-label="Ask a question"
          className="max-h-[180px] flex-1 resize-none bg-transparent py-2 text-[15px] text-ink placeholder:text-muted focus:outline-none"
        />

        {busy ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className="rounded-lg bg-elevated p-2.5 text-ink transition hover:bg-line"
          >
            <Square size={17} aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!value.trim()}
            aria-label="Send question"
            className="rounded-lg bg-brand p-2.5 text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={17} aria-hidden />
          </button>
        )}
      </div>

      <p className="mx-auto mt-2.5 max-w-3xl text-center text-xs text-muted">
        Answers are grounded in your company knowledge base. Verify before
        changing production systems.
      </p>
    </div>
  );
}
