import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Language, SavedItem, AppNotification, UserSettings } from '../types';
import { notifications as mockNotifications } from '../data/notifications';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  authHydrated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setAuthHydrated: (hydrated: boolean) => void;
  
  language: Language;
  setLanguage: (lang: Language) => void;
  
  savedItems: SavedItem[];
  addSavedItem: (item: SavedItem) => void;
  removeSavedItem: (id: string) => void;
  isSaved: (itemId: string) => boolean;
  
  notifications: AppNotification[];
  markAsRead: (id: string) => void;
  
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const defaultSettings: UserSettings = {
  language: 'en',
  emailNotifications: true,
  pushNotifications: false,
  theme: 'light',
  dataSharing: false,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      authHydrated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        localStorage.removeItem('bis_user');
        set({ user: null, isAuthenticated: false });
      },
      setAuthHydrated: (authHydrated) => set({ authHydrated }),
      
      language: 'en',
      setLanguage: (language) => set({ language }),
      
      savedItems: [],
      addSavedItem: (item) => set((state) => ({ savedItems: [...state.savedItems, item] })),
      removeSavedItem: (id) => set((state) => ({ savedItems: state.savedItems.filter(i => i.id !== id) })),
      isSaved: (itemId) => get().savedItems.some(i => i.itemId === itemId),
      
      notifications: mockNotifications,
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      
      settings: defaultSettings,
      updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
      
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: 'bis-smartguide-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        language: state.language,
        savedItems: state.savedItems,
        settings: state.settings
      }),
    }
  )
);

// Alias for backwards compatibility
export const useAppStore = useStore;
