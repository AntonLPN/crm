import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { InitOptions } from 'i18next';
import { resources } from './locales';
import LanguageDetector from 'i18next-browser-languagedetector';

// Derive TypeScript types from the resource object
type TranslationKeys = typeof resources['en']['translation'];

const options: InitOptions = {
  resources: resources as unknown as Record<string, Record<string, any>>,
  fallbackLng: 'en',
  detection: {
    // Порядок проверки источников языка: сначала localStorage, затем язык браузера
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
    lookupLocalStorage: 'i18nextLng',
  },
  interpolation: { escapeValue: false }
};

// Initialize
void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(options);
//Сохраняем выбранный язык в локальное хранилище

// Augment react-i18next types so `t` is typed with our translation keys
declare module 'react-i18next' {
  // Provide our translation type for `t` and other helpers
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: TranslationKeys;
    };
  }
}

export { resources };
export default i18n;
