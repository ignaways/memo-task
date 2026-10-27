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
            className={`rounded-lg border px-2 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400 ${
              active ? priority.activeClass : `border-stone-300 ${priority.idleClass}`
            }`}
          >
            {priority.label}
          </button>
        );
      })}
    </div>
  );
}
