import { Layers } from "lucide-react";

export default function Thinking() {
  return (
    <article className="flex animate-rise gap-4 px-2" aria-live="polite">
      <div
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand-soft"
      >
        <Layers size={17} />
      </div>
      <div className="rounded-xl2 border border-line bg-panel px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 animate-blink rounded-full bg-brand-soft"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            ))}
          </span>
          <span className="text-sm text-muted">
            Routing, retrieving and grading evidence…
          </span>
        </div>
      </div>
    </article>
  );
}
