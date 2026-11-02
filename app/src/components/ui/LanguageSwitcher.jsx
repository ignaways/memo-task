import { LANGUAGES } from "../../i18n/translations";
import useTranslation from "../../hooks/useTranslation";

export default function LanguageSwitcher({ className = "" }) {
  const { lang, setLang, t } = useTranslation();

  return (
    <div
      role="radiogroup"
      aria-label={t("common.language")}
      className={`inline-flex rounded-lg border border-stone-200 bg-white p-0.5 text-xs font-semibold ${className}`}
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
            className={`rounded-md px-2.5 py-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400 ${
              active ? "bg-primary-800 text-white" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
