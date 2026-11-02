import { useCallback, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "./LanguageContext";
import { getCurrentLanguage, getLocale, setCurrentLanguage, storeLanguage, translate } from "../i18n";

export default function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getCurrentLanguage);

  useEffect(() => {
    setCurrentLanguage(lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    setCurrentLanguage(next);
    storeLanguage(next);
    setLangState(next);
  }, []);

  const t = useCallback((key, vars) => translate(lang, key, vars), [lang]);

  const value = useMemo(() => ({ lang, locale: getLocale(lang), setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
