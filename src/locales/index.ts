import { en } from './en';
import { hi } from './hi';
import type { Language } from '../types';

const translations = { en, hi };

export function t(key: string, language: Language = 'en'): string {
  const keys = key.split('.');
  let value: any = translations[language];
  for (const k of keys) {
    if (value === undefined || value === null) break;
    value = value[k];
  }
  
  if (value) return value;
  
  // Fallback to English
  value = translations.en;
  for (const k of keys) {
    if (value === undefined || value === null) break;
    value = value[k];
  }
  
  return value || key;
}

export { en, hi };
