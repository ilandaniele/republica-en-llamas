import React from 'react';
import ReactDOM from 'react-dom/client';
import { LazyMotion } from 'framer-motion';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import App from './App.js';
import { AuthProvider } from './app/AuthProvider.js';
import { initI18n } from './lib/i18n.js';
import { persistOptions, queryClient } from './app/queryClient.js';
import './styles/theme.css';
import './styles/fonts.css';
import { ErrorBoundary, RecoveryScreen } from './components/ErrorBoundary.js';
import { UserMotionConfig } from './components/UserMotionConfig.js';

const loadMotionFeatures = () => import('./lib/motionFeatures.js').then((mod) => mod.default);

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

const reactRoot = ReactDOM.createRoot(root);
void initI18n()
  .then(() => {
    reactRoot.render(
      <React.StrictMode>
        <ErrorBoundary>
          <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
            <AuthProvider>
              <LazyMotion features={loadMotionFeatures} strict>
                <UserMotionConfig>
                  <App />
                </UserMotionConfig>
              </LazyMotion>
            </AuthProvider>
          </PersistQueryClientProvider>
        </ErrorBoundary>
      </React.StrictMode>,
    );
  })
  .catch(() => reactRoot.render(<RecoveryScreen />));
