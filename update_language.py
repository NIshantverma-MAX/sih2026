with open('src/components/common/LanguageSelector.tsx', 'r') as f:
    content = f.read()

content = content.replace('text-gray-700 bg-white', 'text-gray-700 dark:text-slate-200 bg-white dark:bg-transparent')
content = content.replace('hover:bg-gray-50', 'hover:bg-gray-50 dark:hover:bg-slate-800')
content = content.replace('text-gray-500', 'text-gray-500 dark:text-slate-400')
content = content.replace('bg-white', 'bg-white dark:bg-slate-800')
content = content.replace('text-blue-900 bg-blue-50', 'text-blue-900 dark:text-blue-400 bg-blue-50 dark:bg-slate-700')
content = content.replace('text-gray-700 hover:bg-gray-100', 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700')

with open('src/components/common/LanguageSelector.tsx', 'w') as f:
    f.write(content)
