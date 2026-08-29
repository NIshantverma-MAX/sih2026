with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

# Add dark mode classes
content = content.replace('bg-white rounded-2xl', 'bg-white dark:bg-slate-900 rounded-2xl')
content = content.replace('border-slate-200', 'border-slate-200 dark:border-slate-700')
content = content.replace('bg-[#f4f7fc]', 'bg-[#f4f7fc] dark:bg-slate-800')
content = content.replace('text-[#0c1a3b]', 'text-[#0c1a3b] dark:text-white')
content = content.replace('text-[#1e293b]', 'text-[#1e293b] dark:text-slate-300')
content = content.replace('text-slate-600', 'text-slate-600 dark:text-slate-300')
content = content.replace('text-slate-400', 'text-slate-400 dark:text-slate-500')
content = content.replace('text-slate-900', 'text-slate-900 dark:text-white')
content = content.replace('bg-white px-7', 'bg-white dark:bg-slate-800 px-7')
content = content.replace('bg-white border', 'bg-white dark:bg-slate-900 border')
content = content.replace('text-slate-800', 'text-slate-800 dark:text-slate-200')
content = content.replace('bg-slate-100', 'bg-slate-100 dark:bg-slate-800')
content = content.replace('bg-slate-50', 'bg-slate-50 dark:bg-slate-800')
content = content.replace('bg-white px-3', 'bg-white dark:bg-slate-900 px-3')
content = content.replace('text-slate-500 hover:border-indigo-300', 'text-slate-500 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-500 dark:bg-slate-800')

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)
