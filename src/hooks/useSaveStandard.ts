import { useCallback } from 'react';
import toast from 'react-hot-toast';
import type { Standard } from '../types';
import { useAppStore } from '../lib/store';
import { useTranslation } from './useTranslation';
import { generateId } from '../utils/helpers';

/**
 * Bookmarking a standard, in one place.
 *
 * The Standards list, the details page and the action bar all offer the same bookmark, so
 * the toggle, the toast copy and the `SavedItem` shape live here rather than being written
 * three times. Persistence stays with the existing Zustand `savedItems` slice — no second
 * storage mechanism is introduced.
 */
export function useSaveStandard() {
  const { savedItems, addSavedItem, removeSavedItem } = useAppStore();
  const { t } = useTranslation();

  const isSaved = useCallback(
    (standardId: string) =>
      savedItems.some((item) => item.type === 'standard' && item.itemId === standardId),
    [savedItems]
  );

  const toggleSaved = useCallback(
    (standard: Standard) => {
      if (savedItems.some((item) => item.type === 'standard' && item.itemId === standard.id)) {
        removeSavedItem(standard.id);
        toast.success(t('standards.save.removedToast'));
        return false;
      }

      addSavedItem({
        id: generateId(),
        type: 'standard',
        itemId: standard.id,
        title: `${standard.standardNumber} — ${standard.title}`,
        subtitle: standard.category,
        savedDate: new Date().toISOString()
      });
      toast.success(t('standards.save.savedToast'));
      return true;
    },
    [savedItems, addSavedItem, removeSavedItem, t]
  );

  return { isSaved, toggleSaved };
}
