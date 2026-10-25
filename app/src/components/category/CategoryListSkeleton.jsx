export default function CategoryListSkeleton({ count = 3 }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="animate-pulse rounded-xl border border-stone-100 bg-white p-5 shadow-md shadow-stone-200/70">
          <div className="h-11 w-11 rounded-lg bg-stone-200" />
          <div className="mt-3 h-5 w-36 rounded bg-stone-200" />
          <div className="mt-2 h-3.5 w-full rounded bg-stone-100" />
          <div className="mt-5 flex items-center justify-between">
            <div className="h-4 w-28 rounded bg-stone-100" />
            <div className="h-8 w-16 rounded-lg bg-stone-200" />
          </div>
        </li>
      ))}
    </ul>
  );
}
