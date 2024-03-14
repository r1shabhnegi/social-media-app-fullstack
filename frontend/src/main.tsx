import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './global/store.ts';
// import { AuthContextProvider } from './authContext/AuthContext.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      {/* <AuthContextProvider> */}
      <App />
      {/* </AuthContextProvider> */}
    </Provider>
  </QueryClientProvider>
);
