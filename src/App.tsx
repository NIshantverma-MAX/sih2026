import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Toaster } from 'react-hot-toast';
import { useStore } from './lib/store';
import { hydrateCurrentUser } from './services/authService';

function App() {
  const login = useStore((state) => state.login);
  const logout = useStore((state) => state.logout);

  useEffect(() => {
    let cancelled = false;

    async function hydrateAuth() {
      const user = await hydrateCurrentUser();

      if (cancelled) {
        return;
      }

      if (user) {
        login(user);
      } else {
        logout();
      }
    }

    void hydrateAuth();

    return () => {
      cancelled = true;
    };
  }, [login, logout]);

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
