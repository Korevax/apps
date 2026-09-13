import {
   createContext,
   useContext,
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


function LanguageProvider({
   children,
}: LanguageProviderProps) {
   const [locale, setLocale] =
      useState<LocaleCode>(defaultLocale);


   const translation =
      useMemo(
         () => getTranslation(locale),
         [locale]
      );


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
      <LanguageContext.Provider value={value}>
         {children}
      </LanguageContext.Provider>
   );
}


function useLanguage(): LanguageContextValue {
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