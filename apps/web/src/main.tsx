import React from 'react';
import ReactDOM from 'react-dom/client';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import App from './App.js';
import { AuthProvider } from './app/AuthProvider.js';
import { initI18n } from './lib/i18n.js';
import { persistOptions, queryClient } from './app/queryClient.js';
import './styles/theme.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

void initI18n().then(() => {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </PersistQueryClientProvider>
    </React.StrictMode>,
  );
});
