import Spinner from "../ui/Spinner";
import ServerWakeHint from "../ui/ServerWakeHint";
import useTranslation from "../../hooks/useTranslation";

export default function FullPageLoader({ label }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-primary-800">
      <Spinner size={28} />
      <p className="text-sm font-medium text-stone-600">{label ?? t("common.loading")}</p>
      <ServerWakeHint active />
    </div>
  );
}
