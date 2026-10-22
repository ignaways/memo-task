import { useState } from "react";
import { ChecklistIcon } from "../ui/Icons";

const PREVIEW_LIMIT = 3;

export default function TaskChecklist({ items, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  const done = items.filter((item) => item.done).length;
  const percent = Math.round((done / items.length) * 100);
  const visibleItems = expanded ? items : items.slice(0, PREVIEW_LIMIT);
  const hiddenCount = items.length - PREVIEW_LIMIT;

  return (
    <div className="mt-3 rounded-lg bg-slate-50 p-2.5">
      <div className="flex items-center justify-between text-xs font-medium text-slate-600">
        <span className="inline-flex items-center gap-1">
          <ChecklistIcon />
          Checklist
        </span>
        <span className={done === items.length ? "text-emerald-600" : ""}>
          {done}/{items.length}
        </span>
      </div>

      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${percent}%` }} />
      </div>

      <ul className="mt-2 space-y-1">
        {visibleItems.map((item) => (
          <li key={item.id}>
            <label className="flex cursor-pointer items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => onToggle(item.id)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-primary-700"
              />
              <span className={item.done ? "text-slate-400 line-through" : "text-slate-700"}>{item.text}</span>
            </label>
          </li>
        ))}
      </ul>

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1.5 rounded text-xs font-medium text-primary-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          {expanded ? "Sembunyikan" : `Lihat ${hiddenCount} lainnya`}
        </button>
      )}
    </div>
  );
}
