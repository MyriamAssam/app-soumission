import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import LanguageSwitcher from "../LanguageSwitcher";
import "./Navigation.css";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="main-header-wrapper">
      <header className="main-entete">
        <div className="left-zone">
          <div className="main-navigation_titre">
            <Link to="/connexion" className="soumission-lien">Soumissions</Link>
          </div>
          <LanguageSwitcher />
        </div>

        <div className={`main-navigation_entete-nav ${menuOpen ? "open" : ""}`}>
          <ul className="navi-links"><NavLinks onLinkClick={() => setMenuOpen(false)} /></ul>
        </div>

        {/* Le logo à la fin pour qu’il soit à droite des liens */}
        <div className="logo-container">
          <img src={require("./images/logomenu.png")} alt="Logo" className="logo-style" />
        </div>

        {/* Hamburger (visible uniquement sur mobile) */}
        <div className="burger" onClick={() => setMenuOpen(prev => !prev)}>
          ☰
        </div>
      </header>




    </div>
  );
};

export default Navigation;

