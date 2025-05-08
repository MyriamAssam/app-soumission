import LanguageSwitcher from "../LanguageSwitcher";
import React from "react";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import "./Navigation.css";

const Navigation = () => {
  return (
    <>
      <div className="main-header-wrapper">
        <header className="main-entete">
          <h1 className="main-navigation_titre">
            <Link to="/connexion" className="soumission-lien">Soumissions</Link>
          </h1>
          <nav className="main-navigation_entete-nav">
            <div className="nav-left">
              <ul className="navi-links"><NavLinks /></ul>
              <LanguageSwitcher />
            </div>
            <div className="logo-container">
              <img src={require("./images/logomenu.png")} alt="Logo" className="logo-style" />
            </div>
          </nav>
        </header>

      </div>

    </>
  );
};



export default Navigation;
