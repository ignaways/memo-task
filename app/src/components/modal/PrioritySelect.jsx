import PriorityIcon from "../ui/PriorityIcon";
import { PRIORITIES } from "../../constants/priorities";

export default function PrioritySelect({ id, value, onChange }) {
  return (
    <div id={id} role="radiogroup" aria-label="Priority" className="grid grid-cols-3 gap-2">
      {PRIORITIES.map((priority) => {
        const active = value === priority.id;
        return (
          <button
            key={priority.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(priority.id)}
            className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
              active
                ? "border-primary-700 bg-primary-50 text-primary-800"
                : "border-slate-300 text-slate-600 hover:border-slate-400"
            }`}
          >
            <PriorityIcon priority={priority.id} />
            {priority.label}
          </button>
        );
      })}
    </div>
  );
}
