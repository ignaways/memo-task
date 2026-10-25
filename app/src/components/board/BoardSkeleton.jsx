const CARDS = [3, 2, 1];

export default function BoardSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 items-start gap-4 md:grid-cols-3" aria-hidden="true">
      {CARDS.map((count, column) => (
        <div key={column} className="animate-pulse rounded-2xl bg-stone-100 p-3">
          <div className="mb-4 h-4 w-24 rounded bg-stone-200" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: count }, (_, index) => (
              <div key={index} className="rounded-xl bg-white p-4">
                <div className="h-3 w-16 rounded bg-stone-200" />
                <div className="mt-3 h-4 w-3/4 rounded bg-stone-200" />
                <div className="mt-2 h-3 w-full rounded bg-stone-100" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
