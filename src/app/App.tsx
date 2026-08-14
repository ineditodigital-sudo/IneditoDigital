import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import Preloader from './components/Preloader';
import FontPreloader from './components/FontPreloader';
import FontLoader from './components/FontLoader';

export default function App() {
  return (
    <ErrorBoundary>
      <FontPreloader />
      <FontLoader />
      <Preloader />
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </AppProvider>
    </ErrorBoundary>
  );
}