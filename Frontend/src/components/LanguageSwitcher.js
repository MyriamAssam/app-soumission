
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
    console.log("🌐 LanguageSwitcher mounted");

    const { i18n } = useTranslation();

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
