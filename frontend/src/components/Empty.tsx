const SUGGESTIONS = [
  "What is our company's password reset policy?",
  "How do I fix VPN connection drops?",
  "What is the on-call escalation process?",
  "How do I request software access?",
];

export default function Empty({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <h2 className="text-xl font-semibold">How can I help?</h2>
      <p className="mt-1.5 max-w-md text-sm text-muted">
        Ask about IT policies, access, devices or troubleshooting. Answers cite
        the documents they came from.
      </p>
      <ul className="mt-7 grid w-full max-w-2xl gap-2.5 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => onPick(s)}
              className="w-full rounded-xl2 border border-line bg-panel px-4 py-3 text-left text-sm text-ink/90 transition hover:border-brand/50 hover:bg-elevated"
            >
              {s}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
