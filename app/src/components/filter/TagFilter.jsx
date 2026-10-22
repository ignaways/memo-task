import { useMemo, useState } from "react";
import { getTagColor } from "../../utils/tags";

const baseChip =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400";

export default function TagFilter({ tags, tagCounts, selectedTags, isAllSelected, onToggle, onSelectAll, total, shown }) {
  const [query, setQuery] = useState("");

  const visibleTags = useMemo(() => {
    const keyword = query.trim().toLowerCase().replace(/^#/, "");
    return keyword ? tags.filter((tag) => tag.includes(keyword)) : tags;
  }, [tags, query]);

  if (tags.length === 0) return null;

  return (
    <section aria-label="Filter tag" className="mt-8 rounded-2xl border border-slate-200 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Filter berdasarkan tag</h2>
          <p className="text-xs text-slate-500">
            Menampilkan {shown} dari {total} task
          </p>
        </div>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari tag..."
          aria-label="Cari tag"
          className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200 sm:w-56"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSelectAll}
          aria-pressed={isAllSelected}
          className={`${baseChip} ${
            isAllSelected
              ? "border-primary-800 bg-primary-800 text-white"
              : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
          }`}
        >
          Semua
          <span className={isAllSelected ? "text-primary-200" : "text-slate-400"}>{total}</span>
        </button>

        {visibleTags.map((tag) => {
          const active = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onToggle(tag)}
              aria-pressed={active}
              className={`${baseChip} ${
                active ? `${getTagColor(tag)} border-current` : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
              }`}
            >
              #{tag}
              <span className="opacity-60">{tagCounts[tag]}</span>
            </button>
          );
        })}

        {visibleTags.length === 0 && <p className="py-1 text-xs text-slate-400">Tag "{query}" tidak ditemukan.</p>}
      </div>
    </section>
  );
}
