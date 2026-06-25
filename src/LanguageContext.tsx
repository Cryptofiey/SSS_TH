import React from "react";
import { Language, TRANSLATIONS } from "./translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (section: keyof typeof TRANSLATIONS, key: string) => string;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Language>(() => {
    const cached = localStorage.getItem("th_lang");
    return (cached as Language) || "ru";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("th_lang", newLang);
  };

  const t = (section: keyof typeof TRANSLATIONS, key: string): string => {
    const sec = TRANSLATIONS[section] as any;
    if (sec && sec[key]) {
      return sec[key][lang] || sec[key]["en"] || "";
    }
    return "";
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
