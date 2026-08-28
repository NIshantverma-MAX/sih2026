import { useAppStore } from '../lib/store';
import { t as translate } from '../locales';

export function useTranslation() {
  const { language } = useAppStore();
  
  return {
    t: (key: string) => translate(key, language),
    language
  };
}
