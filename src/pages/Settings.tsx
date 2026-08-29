import React, { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { PageHeader, Card, Button, Input, Select } from '../components/ui';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';

export default function Settings() {
  const { user, settings, updateSettings, language, setLanguage } = useStore();
  const { t } = useTranslation();
  
  // Local state for form
  const [localSettings, setLocalSettings] = useState({
    language: language,
    emailAlerts: settings.emailNotifications ?? false,
    pushAlerts: settings.pushNotifications ?? false,
    theme: settings.theme || 'light',
    dataSharing: settings.dataSharing ?? false
  });

  // Check if there are unsaved changes
  const hasChanges = 
    localSettings.language !== language ||
    localSettings.emailAlerts !== (settings.emailNotifications ?? false) ||
    localSettings.pushAlerts !== (settings.pushNotifications ?? false) ||
    localSettings.theme !== (settings.theme || 'light') ||
    localSettings.dataSharing !== (settings.dataSharing ?? false);

  useEffect(() => {
    // Live preview for theme
    const isDark = localSettings.theme === 'dark' || (localSettings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    
    // Live preview for language
    if (localSettings.language !== language) {
      setLanguage(localSettings.language as any);
    }
    
    return () => {
      // Revert previews on unmount (if not saved, settings object remains unchanged)
      // We grab the actual saved settings freshly from the store
      const currentSavedSettings = useStore.getState().settings;
      const savedTheme = currentSavedSettings.theme || 'light';
      const savedIsDark = savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', savedIsDark);
      
      const savedLang = currentSavedSettings.language || 'en';
      useStore.getState().setLanguage(savedLang as any);
    };
  }, [localSettings.theme, localSettings.language, language, setLanguage]);

  const handleSave = () => {
    setLanguage(localSettings.language as any);
    updateSettings({
      language: localSettings.language as any,
      emailNotifications: localSettings.emailAlerts,
      pushNotifications: localSettings.pushAlerts,
      theme: localSettings.theme as any,
      dataSharing: localSettings.dataSharing
    });
    toast.success(t('settings.toast.saved') || 'Settings saved successfully.');
  };

  const handleReset = () => {
    setLocalSettings({
      language: 'en',
      emailAlerts: false,
      pushAlerts: false,
      theme: 'light',
      dataSharing: false
    });
    toast(t('settings.toast.reset') || 'Settings reset to defaults.', { icon: '🔄' });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <PageHeader 
        title={t('settings.title') || 'Settings'} 
        subtitle={t('settings.subtitle') || 'Manage your account preferences and app settings'} 
      />

      <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-slate-700 pb-2">
          {t('settings.profile.title') || 'Profile Information'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('settings.profile.name') || 'Name'}</label>
            <Input value={user?.name || ''} readOnly className="bg-gray-50 dark:bg-slate-700 dark:text-white dark:border-slate-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('settings.profile.email') || 'Email'}</label>
            <Input value={user?.email || ''} readOnly className="bg-gray-50 dark:bg-slate-700 dark:text-white dark:border-slate-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('settings.profile.role') || 'Role'}</label>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
              {user?.role || t('common.guest') || 'Guest'}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-slate-700 pb-2">
          {t('settings.prefs.title') || 'Preferences'}
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('settings.prefs.language') || 'Language'}</label>
            <Select 
              value={localSettings.language}
              onChange={(e) => setLocalSettings({...localSettings, language: e.target.value as any})}
              options={[
                { value: 'en', label: 'English' },
                { value: 'hi', label: 'Hindi (हिंदी)' }
              ]}
              className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('settings.prefs.theme') || 'Theme'}</label>
            <Select 
              value={localSettings.theme}
              onChange={(e) => setLocalSettings({...localSettings, theme: e.target.value as any})}
              options={[
                { value: 'light', label: t('settings.prefs.themeLight') || 'Light' },
                { value: 'dark', label: t('settings.prefs.themeDark') || 'Dark' },
                { value: 'system', label: t('settings.prefs.themeSystem') || 'System Default' }
              ]}
              className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-slate-700 pb-2">
          {t('settings.notifs.title') || 'Notifications & Privacy'}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.notifs.email') || 'Email Notifications'}</h4>
              <p className="text-xs text-gray-500 dark:text-slate-400">{t('settings.notifs.emailDesc') || 'Receive updates and newsletters via email.'}</p>
            </div>
            <input 
              type="checkbox" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-slate-600 dark:bg-slate-700 dark:checked:bg-blue-500"
              checked={localSettings.emailAlerts}
              onChange={(e) => setLocalSettings({...localSettings, emailAlerts: e.target.checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.notifs.push') || 'Push Notifications'}</h4>
              <p className="text-xs text-gray-500 dark:text-slate-400">{t('settings.notifs.pushDesc') || 'Receive real-time alerts in the browser.'}</p>
            </div>
            <input 
              type="checkbox" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-slate-600 dark:bg-slate-700 dark:checked:bg-blue-500"
              checked={localSettings.pushAlerts}
              onChange={(e) => setLocalSettings({...localSettings, pushAlerts: e.target.checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{t('settings.notifs.data') || 'Data Sharing'}</h4>
              <p className="text-xs text-gray-500 dark:text-slate-400">{t('settings.notifs.dataDesc') || 'Share anonymous usage data to help us improve.'}</p>
            </div>
            <input 
              type="checkbox" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-slate-600 dark:bg-slate-700 dark:checked:bg-blue-500"
              checked={localSettings.dataSharing}
              onChange={(e) => setLocalSettings({...localSettings, dataSharing: e.target.checked})}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleReset} className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
          {t('settings.actions.reset') || 'Reset Defaults'}
        </Button>
        <Button 
          className={`text-white transition-colors ${hasChanges ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700' : 'bg-slate-400 cursor-not-allowed dark:bg-slate-600'}`} 
          onClick={hasChanges ? handleSave : undefined}
          disabled={!hasChanges}
        >
          {t('settings.actions.save') || 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
