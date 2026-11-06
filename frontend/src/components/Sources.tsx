import { useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  FileText,
  Globe,
  Layers,
} from "lucide-react";
import type { Citation } from "../lib/api";

function iconFor(citation: Citation) {
  if (citation.type === "web") return <Globe size={15} aria-hidden />;
  if (citation.title.toLowerCase().endsWith(".pdf"))
    return <FileText size={15} className="text-brand-soft" aria-hidden />;
  return <FileText size={15} aria-hidden />;
}

// The backend sends KB citation titles as paths; on Windows they arrive with
// backslashes, so trim to the file name and drop repeats of the same document.
function displayName(citation: Citation): string {
  const raw = citation.title || citation.url || "Untitled source";
  if (citation.type === "web") return raw;
  return raw.split(/[\\/]/).pop() || raw;
}

function dedupe(citations: Citation[]): Array<Citation & { label: string }> {
  const seen = new Set<string>();
  const out: Array<Citation & { label: string }> = [];
  for (const citation of citations) {
    const label = displayName(citation);
    const key = `${citation.type}:${citation.url || label.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ ...citation, label });
  }
  return out;
}

export default function Sources({ citations }: { citations: Citation[] }) {
  const [open, setOpen] = useState(true);
  const items = dedupe(citations);
  if (items.length === 0) return null;

  return (
    <div className="mt-4 border-t border-line pt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 text-sm text-muted transition hover:text-ink"
      >
        <Layers size={15} aria-hidden />
        <span>Sources ({items.length})</span>
        <ChevronDown
          size={16}
          aria-hidden
          className={`ml-auto transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>

      {open && (
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {items.map((citation, i) => {
            const label = citation.label;
            const body = (
              <>
                <span className="shrink-0 text-muted">{iconFor(citation)}</span>
                <span className="truncate text-[13px]">{label}</span>
                {citation.url && (
                  <ExternalLink
                    size={14}
                    aria-hidden
                    className="ml-auto shrink-0 text-muted"
                  />
                )}
              </>
            );
            const className =
              "flex items-center gap-2.5 rounded-lg border border-line bg-elevated px-3 py-2.5 transition hover:border-brand/40";
            return (
              <li key={`${label}-${i}`}>
                {citation.url ? (
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={className}
                    title={label}
                  >
                    {body}
                  </a>
                ) : (
                  <div className={className} title={label}>
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
