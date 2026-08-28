import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { PageHeader, Card, Button, Input, Select } from '../components/ui';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, settings, updateSettings, language, setLanguage } = useStore();
  
  // Local state for form
  const [localSettings, setLocalSettings] = useState({
    language: language,
    emailAlerts: settings.emailNotifications ?? false,
    pushAlerts: settings.pushNotifications ?? true,
    theme: settings.theme || 'light',
    dataSharing: settings.dataSharing ?? true
  });

  const handleSave = () => {
    setLanguage(localSettings.language as any);
    updateSettings({
      language: localSettings.language as any,
      emailNotifications: localSettings.emailAlerts,
      pushNotifications: localSettings.pushAlerts,
      theme: localSettings.theme as any,
      dataSharing: localSettings.dataSharing
    });
    toast.success('Settings saved successfully.');
  };

  const handleReset = () => {
    setLocalSettings({
      language: 'en',
      emailAlerts: false,
      pushAlerts: true,
      theme: 'light',
      dataSharing: true
    });
    toast('Settings reset to defaults.', { icon: '🔄' });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <PageHeader title="Settings" subtitle="Manage your account preferences and app settings" />

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input value={user?.name || ''} readOnly className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input value={user?.email || ''} readOnly className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
              {user?.role || 'Guest'}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Preferences</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <Select 
              value={localSettings.language}
              onChange={(e) => setLocalSettings({...localSettings, language: e.target.value as any})}
              options={[
                { value: 'en', label: 'English' },
                { value: 'hi', label: 'Hindi (हिंदी)' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <Select 
              value={localSettings.theme}
              onChange={(e) => setLocalSettings({...localSettings, theme: e.target.value as any})}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'system', label: 'System Default' }
              ]}
            />
            <p className="text-xs text-gray-500 mt-1">Currently only light theme is supported.</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Notifications & Privacy</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
              <p className="text-xs text-gray-500">Receive updates and newsletters via email.</p>
            </div>
            <input 
              type="checkbox" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={localSettings.emailAlerts}
              onChange={(e) => setLocalSettings({...localSettings, emailAlerts: e.target.checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
              <p className="text-xs text-gray-500">Receive real-time alerts in the browser.</p>
            </div>
            <input 
              type="checkbox" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={localSettings.pushAlerts}
              onChange={(e) => setLocalSettings({...localSettings, pushAlerts: e.target.checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Data Sharing</h4>
              <p className="text-xs text-gray-500">Share anonymous usage data to help us improve.</p>
            </div>
            <input 
              type="checkbox" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={localSettings.dataSharing}
              onChange={(e) => setLocalSettings({...localSettings, dataSharing: e.target.checked})}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleReset}>
          Reset Defaults
        </Button>
        <Button className="bg-blue-900 text-white hover:bg-blue-800" onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}
