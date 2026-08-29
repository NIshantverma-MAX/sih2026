import re
from pathlib import Path

# Card
card_path = Path('src/components/ui/Card.tsx')
if card_path.exists():
    content = card_path.read_text()
    content = content.replace('bg-white', 'bg-white dark:bg-slate-800')
    content = content.replace('border-gray-200', 'border-gray-200 dark:border-slate-700')
    card_path.write_text(content)

# Button
btn_path = Path('src/components/ui/Button.tsx')
if btn_path.exists():
    content = btn_path.read_text()
    content = content.replace('bg-white border-gray-300 text-gray-700 hover:bg-gray-50', 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700')
    content = content.replace('text-gray-500 hover:text-gray-700 hover:bg-gray-100', 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800')
    btn_path.write_text(content)

# Input
inp_path = Path('src/components/ui/Input.tsx')
if inp_path.exists():
    content = inp_path.read_text()
    content = content.replace('bg-white', 'bg-white dark:bg-slate-800')
    content = content.replace('border-gray-300', 'border-gray-300 dark:border-slate-600')
    content = content.replace('text-gray-900', 'text-gray-900 dark:text-white')
    content = content.replace('text-red-500', 'text-red-500 dark:text-red-400')
    inp_path.write_text(content)

# Select is not a separate file in ui folder? Let's find it.
# wait, Settings.tsx has "import { PageHeader, Card, Button, Input, Select } from '../components/ui';"
# so Select must be in src/components/ui/Select.tsx or index.ts
sel_path = Path('src/components/ui/Select.tsx')
if sel_path.exists():
    content = sel_path.read_text()
    content = content.replace('bg-white', 'bg-white dark:bg-slate-800')
    content = content.replace('border-gray-300', 'border-gray-300 dark:border-slate-600')
    content = content.replace('text-gray-900', 'text-gray-900 dark:text-white')
    sel_path.write_text(content)

