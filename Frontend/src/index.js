import './i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { I18nextProvider } from 'react-i18next';

import { AuthProvider } from './components/context/AuthContext';
import App from './components/App';

console.log("✅ Rendering app with I18nextProvider");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <AuthProvider>
      <App />
    </AuthProvider>

  </React.StrictMode>
);

reportWebVitals();
