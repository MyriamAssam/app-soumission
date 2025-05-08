// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { AuthProvider } from './components/context/AuthContext';
import App from './components/App';

console.log("✅ Rendering app with I18nextProvider");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </I18nextProvider>
  </React.StrictMode>
);

reportWebVitals();
