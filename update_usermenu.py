import re

with open('src/components/common/UserMenu.tsx', 'r') as f:
    content = f.read()

# Add useTranslation
if 'useTranslation' not in content:
    content = content.replace("import { getInitials } from '../../utils/helpers';", "import { getInitials } from '../../utils/helpers';\nimport { useTranslation } from '../../hooks/useTranslation';")
    content = content.replace("  const dropdownRef = useRef<HTMLDivElement>(null);", "  const dropdownRef = useRef<HTMLDivElement>(null);\n  const { t } = useTranslation();")

# Replace strings
content = content.replace("Sign In\n", "{t('header.signIn') || 'Sign In'}\n")
content = content.replace("Profile\n", "{t('header.profile') || 'Profile'}\n")
content = content.replace("My Queries\n", "{t('nav.myQueries') || 'My Queries'}\n")
content = content.replace("Settings\n", "{t('nav.settings') || 'Settings'}\n")
content = content.replace("Sign out\n", "{t('header.signOut') || 'Sign out'}\n")

# Dark mode classes
content = content.replace('className="text-sm font-medium text-blue-900 hover:text-blue-800"', 'className="text-sm font-medium text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"')
content = content.replace('hover:bg-gray-100', 'hover:bg-gray-100 dark:hover:bg-slate-700')
content = content.replace('text-gray-700', 'text-gray-700 dark:text-slate-200')
content = content.replace('text-gray-500', 'text-gray-500 dark:text-slate-400')
content = content.replace('text-gray-900', 'text-gray-900 dark:text-white')
content = content.replace('bg-white', 'bg-white dark:bg-slate-800')
content = content.replace('border-gray-100', 'border-gray-100 dark:border-slate-700')

with open('src/components/common/UserMenu.tsx', 'w') as f:
    f.write(content)
