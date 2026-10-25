import { useState } from "react";
import { CATEGORY_ICONS, isPresetIcon, isSingleEmoji } from "../../constants/categoryIcons";
import { inputClass } from "../ui/FormField";

const optionClass = (active) =>
  `flex aspect-square items-center justify-center rounded-lg border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400 ${
    active
      ? "border-stone-900 bg-stone-900 text-white"
      : "border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900"
  }`;

export default function CategoryIconSelect({ id, value, onChange }) {
  const [draft, setDraft] = useState(null);
  const isCustom = !isPresetIcon(value);
  const emoji = draft ?? (isCustom ? value : "");
  const emojiError = emoji && !isSingleEmoji(emoji) ? "Masukkan satu emoji saja." : "";

  const handleEmojiChange = (event) => {
    const next = event.target.value.trim();
    setDraft(next);
    if (isSingleEmoji(next)) onChange(next);
  };

  return (
    <div className="space-y-3">
      <div
        id={id}
        role="radiogroup"
        aria-label="Ikon kategori"
        className="grid max-h-44 grid-cols-6 gap-1.5 overflow-y-auto rounded-lg border border-stone-200 p-2 sm:grid-cols-8"
      >
        {CATEGORY_ICONS.map(({ id: iconId, label, Icon }) => {
          const active = value === iconId;
          return (
            <button
              key={iconId}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={label}
              title={label}
              onClick={() => onChange(iconId)}
              className={optionClass(active)}
            >
              <Icon size={18} />
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <span className={`h-10 w-10 shrink-0 text-xl ${optionClass(isCustom && Boolean(emoji))}`} aria-hidden="true">
          {emoji && !emojiError ? emoji : "😀"}
        </span>
        <div className="min-w-0 flex-1">
          <input
            value={emoji}
            onChange={handleEmojiChange}
            onFocus={() => emoji && !emojiError && onChange(emoji)}
            placeholder="Atau ketik / tempel emoji custom"
            aria-label="Emoji custom"
            aria-invalid={Boolean(emojiError)}
            className={`${inputClass} ${emojiError ? "border-rose-400" : ""}`}
          />
          {emojiError && <p className="mt-1 text-xs text-rose-600">{emojiError}</p>}
        </div>
      </div>
    </div>
  );
}
