import useDelayedFlag from "../../hooks/useDelayedFlag";
import useTranslation from "../../hooks/useTranslation";

export default function ServerWakeHint({ active, delay = 4000 }) {
  const { t } = useTranslation();
  const visible = useDelayedFlag(active, delay);
  if (!visible) return null;

  return (
    <p className="animate-fade-in mx-auto max-w-sm text-center text-xs leading-relaxed text-stone-500">
      {t("serverWake")}
    </p>
  );
}
