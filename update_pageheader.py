with open('src/components/ui/PageHeader.tsx', 'r') as f:
    content = f.read()

content = content.replace('text-gray-900', 'text-gray-900 dark:text-white')
content = content.replace('text-gray-600', 'text-gray-600 dark:text-slate-400')
content = content.replace('text-gray-500', 'text-gray-500 dark:text-slate-400')
content = content.replace('hover:text-blue-900', 'hover:text-blue-900 dark:hover:text-blue-400')

with open('src/components/ui/PageHeader.tsx', 'w') as f:
    f.write(content)
