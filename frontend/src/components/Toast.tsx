import { useEffect } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";

export interface ToastData {
  id: string;
  kind: "success" | "error";
  text: string;
}

export default function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastData;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const success = toast.kind === "success";
  return (
    <div
      role="status"
      className={`flex animate-rise items-start gap-2.5 rounded-xl2 border px-4 py-3 text-sm shadow-xl ${
        success
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
          : "border-red-500/30 bg-red-500/10 text-red-200"
      }`}
    >
      {success ? (
        <CheckCircle2 size={17} className="mt-0.5 shrink-0" aria-hidden />
      ) : (
        <XCircle size={17} className="mt-0.5 shrink-0" aria-hidden />
      )}
      <p className="flex-1">{toast.text}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 opacity-70 transition hover:opacity-100"
      >
        <X size={15} aria-hidden />
      </button>
    </div>
  );
}
