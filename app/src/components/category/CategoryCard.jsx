import { Link } from "react-router-dom";
import CategoryIconTile from "./CategoryIconTile";
import IconButton from "../ui/IconButton";
import { PencilIcon, TrashIcon } from "../ui/Icons";

export default function CategoryCard({ category, taskCount, onEdit, onDelete }) {
  const href = `/categories/${category.id}`;

  return (
    <article className="relative flex h-full flex-col rounded-xl border border-stone-100 bg-white p-5 shadow-md shadow-stone-200/70 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <CategoryIconTile icon={category.icon} color={category.color} />
        <div className="relative z-10 -mr-1 -mt-1 flex gap-0.5">
          <IconButton tone="primary" onClick={() => onEdit(category)} aria-label={`Edit kategori ${category.name}`} className="p-1.5">
            <PencilIcon size={16} />
          </IconButton>
          <IconButton tone="danger" onClick={() => onDelete(category)} aria-label={`Hapus kategori ${category.name}`} className="p-1.5">
            <TrashIcon size={16} />
          </IconButton>
        </div>
      </div>

      <h2 className="mt-3 truncate text-lg font-bold text-stone-950">
        {/* Link membentang ke seluruh card supaya area card tetap bisa diklik. */}
        <Link
          to={href}
          className="after:absolute after:inset-0 after:rounded-xl focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-secondary-400"
        >
          {category.name}
        </Link>
      </h2>
      {category.description && <p className="mt-0.5 line-clamp-2 text-sm text-stone-500">{category.description}</p>}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-900">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {taskCount} Task tersedia
        </span>
        <Link
          to={href}
          tabIndex={-1}
          className="relative z-10 rounded-lg bg-stone-950 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-secondary-500 hover:text-stone-950 focus:outline-none"
        >
          Open
        </Link>
      </div>
    </article>
  );
}
