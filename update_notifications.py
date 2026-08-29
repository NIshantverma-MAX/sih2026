with open('src/components/common/NotificationMenu.tsx', 'r') as f:
    content = f.read()

# Add translation hook
if 'useTranslation' not in content:
    content = content.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate } from 'react-router-dom';\nimport { useTranslation } from '../../hooks/useTranslation';")
    content = content.replace("  const navigate = useNavigate();", "  const navigate = useNavigate();\n  const { t } = useTranslation();")

# Replace strings
content = content.replace('Notifications</h3>', '{t("notifications.title") || "Notifications"}</h3>')
content = content.replace('new\n', '{t("notifications.new") || "new"}\n')
content = content.replace('No notifications\n', '{t("notifications.empty") || "No notifications"}\n')

# Add dark mode styles
content = content.replace('text-gray-500 hover:text-gray-700 hover:bg-gray-100 ring-white', 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 ring-white dark:ring-slate-900')
content = content.replace('bg-white', 'bg-white dark:bg-slate-800')
content = content.replace('border-gray-100', 'border-gray-100 dark:border-slate-700')
content = content.replace('text-gray-900', 'text-gray-900 dark:text-white')
content = content.replace('bg-blue-100 text-blue-900', 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100')
content = content.replace('text-gray-500', 'text-gray-500 dark:text-slate-400')
content = content.replace('divide-gray-100', 'divide-gray-100 dark:divide-slate-700')
content = content.replace('hover:bg-gray-50', 'hover:bg-gray-50 dark:hover:bg-slate-700')
content = content.replace('bg-blue-50/50', 'bg-blue-50/50 dark:bg-slate-700/50')
content = content.replace('text-gray-700', 'text-gray-700 dark:text-slate-300')
content = content.replace('text-gray-400', 'text-gray-400 dark:text-slate-500')
content = content.replace('ring-white', 'ring-white dark:ring-slate-900')

with open('src/components/common/NotificationMenu.tsx', 'w') as f:
    f.write(content)
