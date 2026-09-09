"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, type Dictionary, type Locale } from "./dictionary";

const STORAGE_KEY = "survivor-locale";

type LocaleContextValue = {
  locale: Locale;
  t: Dictionary;
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Always render `en` on the server so hydration matches; the stored or
  // browser preference is applied in the effect below.
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "es") {
      setLocale(stored);
    } else if (navigator.language.toLowerCase().startsWith("es")) {
      setLocale("es");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const toggleLocale = useCallback(() => {
    setLocale((current) => {
      const next: Locale = current === "en" ? "es" : "en";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <LocaleContext.Provider
      value={{ locale, t: dictionaries[locale], toggleLocale }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be used inside a LocaleProvider");
  return value;
}
