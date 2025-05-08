
import './App.css'; // Assure-toi d'avoir ce fichier ou ajoute la classe dans App.css
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
    let i18n;

    try {
        const translation = useTranslation();
        i18n = translation.i18n;
    } catch (e) {
        console.warn("i18n context non disponible encore.");
        return null; // retourne rien si le contexte n'est pas prêt
    }

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    const currentLang = i18n.language;

    return (
        <div className="language-buttons">
            <button
                onClick={() => changeLanguage("fr")}
                className={`lang-btn ${currentLang === "fr" ? "active" : ""}`}
            >
                FR
            </button>
            <button
                onClick={() => changeLanguage("en")}
                className={`lang-btn ${currentLang === "en" ? "active" : ""}`}
            >
                EN
            </button>
        </div>
    );
};

export default LanguageSwitcher;
