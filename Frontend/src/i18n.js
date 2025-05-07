// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "fr",
        debug: true,
        resources: {
            fr: {
                translation: {
                    connexion: "Connexion",
                    email: "Email",
                    password: "Mot de passe",
                    client: "Client",
                    employe: "Employé",
                    client_selected: "Client sélectionné.",
                    employe_selected: "Employé sélectionné.",
                    login_failed: "Connexion échouée.",
                    wrong_role: "Rôle incorrect sélectionné ou informations invalides.",
                    login_success: "Connexion réussie.",
                    error_occurred: "Une erreur est survenue.",
                },
            },
            en: {
                translation: {
                    connexion: "Login",
                    email: "Email",
                    password: "Password",
                    client: "Client",
                    employe: "Employee",
                    client_selected: "Client selected.",
                    employe_selected: "Employee selected.",
                    login_failed: "Login failed.",
                    wrong_role: "Incorrect role or invalid credentials.",
                    login_success: "Login successful.",
                    error_occurred: "An error occurred.",
                },
            },
        },
        lng: "fr",
        fallbackLng: "fr",
        interpolation: { escapeValue: false },
    });

export default i18n;
