import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './presentation/legacy/shared/css/estilos.css';
import { ToastProvider } from './presentation/context/ToastContext';
import { SplashProvider } from './presentation/context/SplashContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SplashProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </SplashProvider>
  </React.StrictMode>,
);
