import useTranslation from "../../hooks/useTranslation";

export default function Spinner({ size = 20, className = "" }) {
  const { t } = useTranslation();
  return (
    <span
      role="status"
      aria-label={t("common.loadingShort")}
      style={{ width: size, height: size }}
      className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`}
    />
  );
}
