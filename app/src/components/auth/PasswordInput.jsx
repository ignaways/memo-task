import { useState } from "react";
import { inputClass } from "../ui/FormField";

export default function PasswordInput({ className = "", ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input type={visible ? "text" : "password"} className={`${inputClass} pr-20 ${className}`} {...props} />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-pressed={visible}
        className="absolute inset-y-0 right-2 my-auto h-7 rounded px-2 text-xs font-medium text-stone-500 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400"
      >
        {visible ? "Sembunyikan" : "Lihat"}
      </button>
    </div>
  );
}
