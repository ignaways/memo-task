import Spinner from "../ui/Spinner";
import ServerWakeHint from "../ui/ServerWakeHint";

export default function FullPageLoader({ label = "Memuat..." }) {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-primary-800">
      <Spinner size={28} />
      <p className="text-sm font-medium text-stone-600">{label}</p>
      <ServerWakeHint active />
    </div>
  );
}
