import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Hide branded loader after React mounts
const loader = document.getElementById('initial-loader');
if (loader) {
  // Give React a moment to paint first frame
  setTimeout(() => {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.5s ease';
    setTimeout(() => loader.remove(), 500);
  }, 200);
}

/**
 * SERVICE WORKER
 * Offline capabilities are enabled here for production caching.
 * In development, we recommend using incognito or disabling cache to avoid stale bundles.
 */
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(registration => {
          console.log('Sai SMS ServiceWorker active. Scope:', registration.scope);
        })
        .catch(err => {
          console.error('ServiceWorker registration failed:', err);
        });
    });
  } else {
    // Development: unregister all SWs so cache never interferes
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(r => r.unregister());
    });
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
  }
}
