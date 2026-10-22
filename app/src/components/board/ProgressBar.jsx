export default function ProgressBar({ done, total, percent }) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span>
          {done} dari {total} task selesai
        </span>
        <span>{percent}%</span>
      </div>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
