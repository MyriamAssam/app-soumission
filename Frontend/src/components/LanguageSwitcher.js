// components/LanguageSwitcher.js
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className="language-buttons">
            <button onClick={() => changeLanguage("fr")} className="lang-btn">FR</button>
            <button onClick={() => changeLanguage("en")} className="lang-btn">EN</button>
        </div>
    );
};

export default LanguageSwitcher;
