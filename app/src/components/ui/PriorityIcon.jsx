import { getPriority } from "../../constants/priorities";

const LEVELS = [1, 2, 3];

export default function PriorityIcon({ priority }) {
  const { level, color } = getPriority(priority);

  return (
    <span className="inline-flex h-3.5 items-end gap-0.5" aria-hidden="true">
      {LEVELS.map((bar) => (
        <span
          key={bar}
          className={`w-1 rounded-sm ${bar <= level ? color : "bg-slate-200"}`}
          style={{ height: `${3 + bar * 3.5}px` }}
        />
      ))}
    </span>
  );
}
