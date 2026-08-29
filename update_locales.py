import re

def update_locale(filepath, is_hi=False):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # We'll inject new keys just before the last closing brace
    # Actually, it's safer to just do string replacement or regex insertion
    
    settings_en = """
  settings: {
    title: 'Settings',
    subtitle: 'Manage your account preferences and app settings',
    profile: {
      title: 'Profile Information',
      name: 'Name',
      email: 'Email',
      role: 'Role'
    },
    prefs: {
      title: 'Preferences',
      language: 'Language',
      theme: 'Theme',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeSystem: 'System Default'
    },
    notifs: {
      title: 'Notifications & Privacy',
      email: 'Email Notifications',
      emailDesc: 'Receive updates and newsletters via email.',
      push: 'Push Notifications',
      pushDesc: 'Receive real-time alerts in the browser.',
      data: 'Data Sharing',
      dataDesc: 'Share anonymous usage data to help us improve.'
    },
    actions: {
      reset: 'Reset Defaults',
      save: 'Save Settings'
    },
    toast: {
      saved: 'Settings saved successfully.',
      reset: 'Settings reset to defaults.'
    }
  },
"""
    
    settings_hi = """
  settings: {
    title: 'सेटिंग्स',
    subtitle: 'अपनी खाता प्राथमिकताएं और ऐप सेटिंग्स प्रबंधित करें',
    profile: {
      title: 'प्रोफ़ाइल जानकारी',
      name: 'नाम',
      email: 'ईमेल',
      role: 'भूमिका'
    },
    prefs: {
      title: 'प्राथमिकताएं',
      language: 'भाषा',
      theme: 'थीम',
      themeLight: 'लाइट',
      themeDark: 'डार्क',
      themeSystem: 'सिस्टम डिफ़ॉल्ट'
    },
    notifs: {
      title: 'सूचनाएं और गोपनीयता',
      email: 'ईमेल सूचनाएं',
      emailDesc: 'ईमेल के माध्यम से अपडेट और समाचार पत्र प्राप्त करें।',
      push: 'पुश सूचनाएं',
      pushDesc: 'ब्राउज़र में वास्तविक समय अलर्ट प्राप्त करें।',
      data: 'डेटा साझाकरण',
      dataDesc: 'सुधार करने में हमारी मदद करने के लिए अनाम उपयोग डेटा साझा करें।'
    },
    actions: {
      reset: 'डिफ़ॉल्ट रीसेट करें',
      save: 'सेटिंग्स सहेजें'
    },
    toast: {
      saved: 'सेटिंग्स सफलतापूर्वक सहेजी गईं।',
      reset: 'सेटिंग्स को डिफ़ॉल्ट पर रीसेट किया गया।'
    }
  },
"""

    insertion = settings_hi if is_hi else settings_en
    
    if "settings: {" not in content:
        content = content.replace("  common: {", insertion + "  common: {")
        
    with open(filepath, 'w') as f:
        f.write(content)

update_locale('src/locales/en.ts', is_hi=False)
update_locale('src/locales/hi.ts', is_hi=True)

