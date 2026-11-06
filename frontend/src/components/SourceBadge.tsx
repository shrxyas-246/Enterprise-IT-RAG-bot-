import type { SourceUsed } from "../lib/api";

const STYLES: Record<string, { label: string; className: string }> = {
  private_kb: {
    label: "Private KB",
    className: "bg-brand/15 text-brand-soft border-brand/30",
  },
  web_search: {
    label: "Web search",
    className: "bg-sky-500/10 text-sky-300 border-sky-500/30",
  },
  direct: {
    label: "Direct answer",
    className: "bg-white/5 text-muted border-line",
  },
  insufficient_evidence: {
    label: "No reliable evidence",
    className: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  },
};

export default function SourceBadge({ source }: { source: SourceUsed }) {
  const style = STYLES[source] ?? {
    label: source.replace(/_/g, " "),
    className: "bg-white/5 text-muted border-line",
  };

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${style.className}`}
    >
      {style.label}
    </span>
  );
}
