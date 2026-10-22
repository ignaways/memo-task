import useDelayedFlag from "../../hooks/useDelayedFlag";

export default function ServerWakeHint({ active, delay = 4000 }) {
  const visible = useDelayedFlag(active, delay);
  if (!visible) return null;

  return (
    <p className="animate-fade-in mx-auto max-w-sm text-center text-xs leading-relaxed text-slate-500">
      Server sedang aktif kembali dari mode tidur. Permintaan pertama bisa memakan waktu hingga satu menit.
    </p>
  );
}
