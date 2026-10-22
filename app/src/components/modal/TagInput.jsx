import { useState } from "react";
import TagChip from "../ui/TagChip";
import { normalizeTag } from "../../utils/tags";

export default function TagInput({ id, tags, onChange, suggestions = [] }) {
  const [value, setValue] = useState("");

  const addTag = (raw) => {
    const tag = normalizeTag(raw);
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setValue("");
  };

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag));

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(value);
    }
    if (event.key === "Backspace" && !value && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const availableSuggestions = suggestions.filter((tag) => !tags.includes(tag) && tag.includes(normalizeTag(value)));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-300 px-2 py-1.5 transition focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200">
        {tags.map((tag) => (
          <TagChip key={tag} tag={tag} onRemove={removeTag} />
        ))}
        <input
          id={id}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => value && addTag(value)}
          placeholder={tags.length ? "" : "Ketik tag lalu tekan Enter"}
          className="min-w-24 flex-1 bg-transparent px-1 py-0.5 text-sm text-slate-900 outline-none"
        />
      </div>

      {availableSuggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {availableSuggestions.slice(0, 8).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="rounded-md border border-dashed border-slate-300 px-2 py-0.5 text-xs text-slate-500 hover:border-primary-400 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            >
              + {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
