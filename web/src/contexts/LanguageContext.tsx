import {
   createContext,
   useContext,
   useEffect,
   useMemo,
   useState,
   type ReactNode,
} from "react";

import {
   defaultLocale,
   getTranslation,
   type LocaleCode,
   type Translation,
} from "../services/i18n";

import {
   languages,
} from "../config/languages";

interface LanguageContextValue {
   locale: LocaleCode;
   translation: Translation;
   setLocale: (locale: LocaleCode) => void;
}


interface LanguageProviderProps {
   children: ReactNode;
}


const LanguageContext =
   createContext<LanguageContextValue | null>(null);


const LANGUAGE_STORAGE_KEY =
   "korevax:locale";


function isLocaleCode(
   value: string | null
): value is LocaleCode {
   if (!value) {
      return false;
   }

   return languages.some(
      (language) =>
         language.code === value
   );
}


function getInitialLocale(): LocaleCode {

   try {
      const storedLocale =
         localStorage.getItem(
            LANGUAGE_STORAGE_KEY
         );

      if (
         isLocaleCode(storedLocale)
      ) {
         return storedLocale;
      }
   } catch {
   }


   return defaultLocale;
}


function LanguageProvider({
   children,
}: LanguageProviderProps) {

   const [locale, setLocale] =
      useState<LocaleCode>(
         getInitialLocale
      );


   const translation =
      useMemo(
         () => getTranslation(locale),
         [locale]
      );


   useEffect(() => {

      try {
         localStorage.setItem(
            LANGUAGE_STORAGE_KEY,
            locale
         );
      } catch {
      }

   }, [locale]);


   const value =
      useMemo<LanguageContextValue>(
         () => ({
            locale,
            translation,
            setLocale,
         }),
         [locale, translation]
      );


   return (
      <LanguageContext.Provider
         value={value}
      >
         {children}
      </LanguageContext.Provider>
   );
}


function useLanguage():
   LanguageContextValue {

   const context =
      useContext(LanguageContext);


   if (!context) {
      throw new Error(
         "useLanguage deve ser utilizado dentro de um LanguageProvider."
      );
   }


   return context;
}


export {
   LanguageProvider,
   useLanguage,
};