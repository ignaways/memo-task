import { CATEGORY_COLORS } from "../../constants/categoryIcons";
import { getContrastText } from "../../utils/color";
import { CheckIcon } from "../ui/Icons";

const swatchClass =
  "relative flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400";

export default function CategoryColorSelect({ id, value, onChange }) {
  const isCustom = !CATEGORY_COLORS.some((color) => color.id === value);

  return (
    <div id={id} role="radiogroup" aria-label="Warna ikon" className="flex flex-wrap gap-2">
      {CATEGORY_COLORS.map(({ id: colorId, label }) => {
        const active = value === colorId;
        return (
          <button
            key={colorId}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => onChange(colorId)}
            className={`${swatchClass} ${active ? "ring-2 ring-stone-900" : "hover:scale-110"}`}
            style={{ backgroundColor: colorId, color: getContrastText(colorId) }}
          >
            {active && <CheckIcon size={14} />}
          </button>
        );
      })}

      <label
        title="Warna custom"
        className={`${swatchClass} cursor-pointer focus-within:ring-2 focus-within:ring-secondary-400 ${
          isCustom ? "ring-2 ring-stone-900" : "hover:scale-110"
        }`}
        style={
          isCustom
            ? { backgroundColor: value, color: getContrastText(value) }
            : { background: "conic-gradient(#ef4444, #f59e0b, #22c55e, #0ea5e9, #8b5cf6, #ec4899, #ef4444)" }
        }
      >
        {isCustom && <CheckIcon size={14} />}
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value.toLowerCase())}
          aria-label="Warna custom"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </label>
    </div>
  );
}
