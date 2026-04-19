import mr from "./translations/mr";
import hi from "./translations/hi";
import en from "./translations/en";
import { Language } from "@/store/useStore";

const translations = { mr, hi, en };

export function useTranslation(language: Language) {
  return translations[language];
}

export type Translations = typeof mr;
