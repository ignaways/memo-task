import { useCallback, useMemo, useRef, useState } from "react";
import { ToastContext } from "./ToastContext";
import { CloseIcon } from "../components/ui/Icons";

const DURATION = 4500;

const VARIANTS = {
  error: "border-rose-200 bg-white text-rose-700",
  success: "border-emerald-200 bg-white text-emerald-700",
  info: "border-primary-200 bg-white text-primary-800",
};

const DOTS = {
  error: "bg-rose-500",
  success: "bg-emerald-500",
  info: "bg-primary-500",
};

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (message, variant = "info") => {
      counter.current += 1;
      const id = counter.current;
      setToasts((prev) => [...prev.slice(-2), { id, message, variant }]);
      setTimeout(() => dismiss(id), DURATION);
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      show,
      error: (message) => show(message, "error"),
      success: (message) => show(message, "success"),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`animate-pop-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${VARIANTS[toast.variant]}`}
          >
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${DOTS[toast.variant]}`} />
            <p className="flex-1 text-slate-700">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Tutup notifikasi"
              className="rounded p-0.5 text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            >
              <CloseIcon />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
