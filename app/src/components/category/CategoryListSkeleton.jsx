export default function CategoryListSkeleton({ count = 2 }) {
  return (
    <ul className="space-y-4" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="animate-pulse rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-md shadow-slate-200/70">
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="mt-2 h-3.5 w-64 max-w-full rounded bg-slate-100" />
        </li>
      ))}
    </ul>
  );
}
