import { Link } from "react-router-dom";
import { PlayIcon } from "../ui/Icons";

export default function CategoryCard({ category, taskCount }) {
  return (
    <Link
      to={`/categories/${category.id}`}
      className="group flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-md shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="text-lg font-bold text-slate-900">{category.name}</h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {taskCount} Task tersedia
          </span>
        </div>
        {category.description && <p className="mt-0.5 truncate text-sm text-slate-500">{category.description}</p>}
      </div>
      <PlayIcon className="shrink-0 text-slate-900 transition group-hover:translate-x-0.5 group-hover:text-primary-700" />
    </Link>
  );
}
