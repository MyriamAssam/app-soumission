import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "./components/context/AuthContext";
import { I18nextProvider } from 'react-i18next'; // 👈 il manquait ça
import i18n from './i18n'; // 👈 ton instance i18n

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}> {/* ✅ Ajout ici */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </I18nextProvider>
  </React.StrictMode>
);

reportWebVitals();
