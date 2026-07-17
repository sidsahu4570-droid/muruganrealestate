import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from './context/ToastContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { AppRoutes } from './routes';
import { ScrollToTop } from './components/ScrollToTop';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop />
          <ToastProvider>
            <DarkModeProvider>
              <AuthProvider>
                <WishlistProvider>
                  <CompareProvider>
                    <RecentlyViewedProvider>
                      <AppRoutes />
                    </RecentlyViewedProvider>
                  </CompareProvider>
                </WishlistProvider>
              </AuthProvider>
            </DarkModeProvider>
          </ToastProvider>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
