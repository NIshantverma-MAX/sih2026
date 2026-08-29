import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Toaster } from 'react-hot-toast';
import { useStore } from './lib/store';

function App() {
  const theme = useStore(state => state.settings?.theme || 'light');

  useEffect(() => {
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  }, [theme]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        className: 'dark:bg-slate-800 dark:text-white dark:border-slate-700',
        style: {
          background: 'var(--toast-bg, #fff)',
          color: 'var(--toast-color, #1e3a5f)',
          border: '1px solid var(--toast-border, #e5e7eb)',
        },
      }} />
    </>
  );
}

export default App;
