import { DEFAULT_LANGUAGE, LANGUAGES, TRANSLATIONS } from "./translations";

const STORAGE_KEY = "memo-board.lang";

const isSupported = (lang) => LANGUAGES.some((item) => item.id === lang);

const lookup = (dictionary, key) => key.split(".").reduce((node, part) => node?.[part], dictionary);

const interpolate = (text, vars) =>
  vars ? text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match)) : text;

export const translate = (lang, key, vars) => {
  const value = lookup(TRANSLATIONS[lang], key) ?? lookup(TRANSLATIONS[DEFAULT_LANGUAGE], key);
  return typeof value === "string" ? interpolate(value, vars) : key;
};

export const getLocale = (lang) => LANGUAGES.find((item) => item.id === lang)?.locale ?? "id-ID";

export const detectLanguage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isSupported(stored)) return stored;
  } catch {
    // localStorage tidak tersedia, lanjut ke deteksi browser.
  }
  const browser = typeof navigator !== "undefined" ? navigator.language?.slice(0, 2).toLowerCase() : "";
  return isSupported(browser) ? browser : DEFAULT_LANGUAGE;
};

export const storeLanguage = (lang) => {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    return;
  }
};

// Bahasa aktif untuk kode di luar React (mis. apiClient).
let currentLanguage = detectLanguage();

export const setCurrentLanguage = (lang) => {
  currentLanguage = lang;
};

export const getCurrentLanguage = () => currentLanguage;

export const t = (key, vars) => translate(currentLanguage, key, vars);
