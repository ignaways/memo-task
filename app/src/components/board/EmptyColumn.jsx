export default function EmptyColumn({ isFiltering }) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
      {isFiltering ? "Tidak ada task dengan tag terpilih" : "Geser task ke sini"}
    </div>
  );
}
