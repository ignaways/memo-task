import { LANGUAGES } from "../../i18n/translations";
import useTranslation from "../../hooks/useTranslation";

export default function LanguageSwitcher({ className = "" }) {
  const { lang, setLang, t } = useTranslation();

  return (
    <div
      role="radiogroup"
      aria-label={t("common.language")}
      className={`inline-flex rounded-lg border border-white/20 bg-primary-900/40 p-0.5 text-xs font-semibold ${className}`}
    >
      {LANGUAGES.map((item) => {
        const active = item.id === lang;
        return (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={active}
            title={item.name}
            onClick={() => setLang(item.id)}
            className={`rounded-md px-2.5 py-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
              active ? "bg-white text-primary-800" : "text-primary-200 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
