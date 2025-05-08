import './i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import router from './components/App';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // 👈

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </I18nextProvider>
  </React.StrictMode>
);

reportWebVitals();




