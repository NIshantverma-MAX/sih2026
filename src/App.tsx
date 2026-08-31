import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Toaster } from 'react-hot-toast';
import { useStore } from './lib/store';
import { hydrateCurrentUser } from './services/authService';

function App() {
  const login = useStore((state) => state.login);
  const logout = useStore((state) => state.logout);
  const setAuthHydrated = useStore((state) => state.setAuthHydrated);

  useEffect(() => {
    let cancelled = false;

    async function hydrateAuth() {
      try {
        const user = await hydrateCurrentUser();

        if (cancelled) {
          return;
        }

        if (user) {
          login(user);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Failed to restore the InsForge session.', error);
        if (!cancelled) {
          logout();
        }
      } finally {
        if (!cancelled) {
          setAuthHydrated(true);
        }
      }
    }

    void hydrateAuth();

    return () => {
      cancelled = true;
    };
  }, [login, logout, setAuthHydrated]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#1e3a5f',
          border: '1px solid #e5e7eb',
        },
      }} />
    </>
  );
}

export default App;
