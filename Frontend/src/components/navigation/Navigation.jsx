import LanguageSwitcher from "../LanguageSwitcher";
import React from "react";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import "./Navigation.css";

const Navigation = () => {
  return (
    <>
      <header className="main-entete">
        <h1 className="main-navigation_titre">
          <Link to="/connexion" className="soumission-lien">Soumissions</Link>
        </h1>
        <nav className="main-navigation_entete-nav">
          <ul className="navi-links">
            <NavLinks />
          </ul>
          <div className="nav-right">
            <LanguageSwitcher />
            <div className="logo-container">
              <img src={require("./images/logomenu.png")} alt="Logo" className="logo-style" />
            </div>
          </div>
        </nav>


      </header>
    </>
  );
};



export default Navigation;
