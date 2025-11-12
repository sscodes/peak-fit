import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router';
import App from './App';
import AuthInitializer from './modules/auth/components/auth-initializer/AuthInitializer';
import ErrorBoundary from './modules/error/ErrorBoundary';
import PageBrokenError from './modules/error/broken/PageBrokenError';
import { store } from './store';
import './styles/globals.css';
import './styles/typography.css';
import './styles/variables.css';
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

if (import.meta.env.NODE_ENV === 'production') disableReactDevTools();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
const root = ReactDOM.createRoot(rootElement);

// Create the router configuration
const router = createBrowserRouter([
  {
    path: '/*',
    element: (
      <ErrorBoundary fallback={<PageBrokenError />}>
        <AuthInitializer>
          <App />
        </AuthInitializer>
      </ErrorBoundary>
    ),
    errorElement: <PageBrokenError />,
  },
]);

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} position='top' />
      <ToastContainer />
    </Provider>
  </QueryClientProvider>
);
