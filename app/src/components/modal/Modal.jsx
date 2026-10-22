import { useEffect } from "react";
import { CloseIcon } from "../ui/Icons";
import IconButton from "../ui/IconButton";

const SIZES = {
  md: "max-w-md",
  lg: "max-w-lg",
};

export default function Modal({ open, onClose, title, subtitle, size = "md", children }) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="animate-fade-in fixed inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className={`animate-pop-in relative w-full ${SIZES[size]} rounded-2xl bg-white p-6 shadow-2xl`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
                {title}
              </h2>
              {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>
            <IconButton onClick={onClose} aria-label="Tutup">
              <CloseIcon size={18} />
            </IconButton>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
