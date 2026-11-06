import { useState } from "react";
import { ChevronDown, Route } from "lucide-react";

export default function Trace({ trace }: { trace: string[] }) {
  const [open, setOpen] = useState(false);
  if (trace.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 text-xs text-muted transition hover:text-ink"
      >
        <Route size={14} aria-hidden />
        <span>Agent steps ({trace.length})</span>
        <ChevronDown
          size={14}
          aria-hidden
          className={`transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>

      {open && (
        <ol className="mt-2 space-y-1.5 rounded-lg border border-line bg-black/20 p-3">
          {trace.map((step, i) => (
            <li key={i} className="flex gap-2.5 font-mono text-[11px] text-muted">
              <span className="text-brand-soft">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-ink/80">{step}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
