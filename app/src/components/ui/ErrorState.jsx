import Button from "./Button";

export default function ErrorState({ title = "Gagal memuat data", message, onRetry }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center">
      <p className="font-semibold text-rose-800">{title}</p>
      {message && <p className="mt-1 max-w-md text-sm text-rose-700">{message}</p>}
      {onRetry && (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          Coba lagi
        </Button>
      )}
    </div>
  );
}
