import React from 'react';
import ReactDOM from 'react-dom/client';
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
 * Only register in production. In development, unregister any existing SW
 * so stale cached JS bundles never block the app from rendering.
 */
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(registration => {
          console.log('Sai SMS ServiceWorker active. Scope:', registration.scope);
        })
        .catch(err => {
          console.debug('ServiceWorker registration skipped:', err.message || err);
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
