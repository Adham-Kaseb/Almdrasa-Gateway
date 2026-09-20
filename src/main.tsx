import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { OSProvider } from './context/OSContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <OSProvider>
        <App />
      </OSProvider>
    </AuthProvider>
  </React.StrictMode>
);
