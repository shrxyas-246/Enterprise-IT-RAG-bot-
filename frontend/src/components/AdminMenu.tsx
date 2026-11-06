import { useEffect, useRef, useState } from "react";
import { ChevronDown, KeyRound } from "lucide-react";
import type { HealthResponse } from "../lib/api";

interface Props {
  health: HealthResponse | null;
  online: boolean;
  adminKey: string;
  onAdminKeyChange: (key: string) => void;
}

export default function AdminMenu({
  health,
  online,
  adminKey,
  onAdminKeyChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-full rounded-xl2 border border-line bg-elevated p-3 shadow-xl">
          <label
            htmlFor="admin-key"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted"
          >
            <KeyRound size={13} aria-hidden />
            Admin key (for uploads)
          </label>
          <input
            id="admin-key"
            type="password"
            value={adminKey}
            onChange={(e) => onAdminKeyChange(e.target.value)}
            placeholder="X-Admin-Key"
            className="w-full rounded-lg border border-line bg-canvas px-2.5 py-2 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
          />
          <dl className="mt-3 space-y-1 border-t border-line pt-2.5 text-[11px] text-muted">
            <div className="flex justify-between gap-2">
              <dt>Backend</dt>
              <dd className={online ? "text-emerald-400" : "text-red-400"}>
                {online ? "connected" : "offline"}
              </dd>
            </div>
            {health && (
              <>
                <div className="flex justify-between gap-2">
                  <dt>Model</dt>
                  <dd className="truncate text-ink/70">{health.model}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Index</dt>
                  <dd className="truncate text-ink/70">{health.index}</dd>
                </div>
              </>
            )}
          </dl>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition hover:bg-white/5"
      >
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-xs font-semibold text-brand-soft"
        >
          AI
        </span>
        <span className="text-sm">Admin</span>
        <span
          aria-label={online ? "Backend connected" : "Backend offline"}
          className={`ml-auto h-1.5 w-1.5 rounded-full ${
            online ? "bg-emerald-400" : "bg-red-400"
          }`}
        />
        <ChevronDown
          size={15}
          aria-hidden
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}
