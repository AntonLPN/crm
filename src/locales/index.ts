import { ru } from './ru';
import { en } from './en';
import { uk } from './uk';

export const resources = {
  ru: { translation: ru },
  en: { translation: en },
  uk: { translation: uk },
} as const;

export type TranslationResources = typeof resources;
