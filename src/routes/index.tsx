import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';

// Lazy load all pages
const Home = lazy(() => import('../pages/Home'));
const Standards = lazy(() => import('../pages/Standards'));
const StandardDetails = lazy(() => import('../pages/StandardDetails'));
const Certification = lazy(() => import('../pages/Certification'));
const Labs = lazy(() => import('../pages/Labs'));
const LabDetails = lazy(() => import('../pages/LabDetails'));
const Hallmarking = lazy(() => import('../pages/Hallmarking'));
const ConsumerHelp = lazy(() => import('../pages/ConsumerHelp'));
const AskAssistant = lazy(() => import('../pages/AskAssistant'));
const MyQueries = lazy(() => import('../pages/MyQueries'));
const SavedItems = lazy(() => import('../pages/SavedItems'));
const UploadDocument = lazy(() => import('../pages/UploadDocument'));
const Settings = lazy(() => import('../pages/Settings'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const GlobalSearch = lazy(() => import('../pages/GlobalSearch'));

// Loading fallback component
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
  </div>
);

const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<PageLoading />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: withSuspense(Home) },
      { path: 'standards', element: withSuspense(Standards) },
      { path: 'standards/:id', element: withSuspense(StandardDetails) },
      { path: 'certification', element: withSuspense(Certification) },
      { path: 'labs', element: withSuspense(Labs) },
      { path: 'labs/:id', element: withSuspense(LabDetails) },
      { path: 'hallmarking', element: withSuspense(Hallmarking) },
      { path: 'consumer-help', element: withSuspense(ConsumerHelp) },
      { path: 'ask', element: withSuspense(AskAssistant) },
      { path: 'my-queries', element: withSuspense(MyQueries) },
      { path: 'saved-items', element: withSuspense(SavedItems) },
      { path: 'upload-document', element: withSuspense(UploadDocument) },
      { path: 'settings', element: withSuspense(Settings) },
      { path: 'dashboard', element: withSuspense(Dashboard) },
      { path: 'search', element: withSuspense(GlobalSearch) },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      { index: true, element: withSuspense(Login) },
    ],
  },
  {
    path: '/register',
    element: <AuthLayout />,
    children: [
      { index: true, element: withSuspense(Register) },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
