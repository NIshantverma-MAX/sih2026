with open('src/layouts/AppLayout.tsx', 'r') as f:
    content = f.read()

# Add dark mode classes
content = content.replace('bg-[#f8fafc]', 'bg-[#f8fafc] dark:bg-slate-900')
content = content.replace('bg-white border-b border-gray-200', 'bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800')
content = content.replace('text-[#0c1a3b]', 'text-[#0c1a3b] dark:text-white')
content = content.replace('text-slate-500 font-medium', 'text-slate-500 dark:text-slate-400 font-medium')
content = content.replace('bg-gray-50/50', 'bg-gray-50/50 dark:bg-slate-800')
content = content.replace('border-gray-300', 'border-gray-300 dark:border-slate-700')
content = content.replace('text-gray-400', 'text-gray-400 dark:text-slate-500')

with open('src/layouts/AppLayout.tsx', 'w') as f:
    f.write(content)
