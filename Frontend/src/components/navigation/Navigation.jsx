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
          <div className="left-zone">
            <div className="main-navigation_titre">
              <Link to="/connexion" className="soumission-lien">Soumissions</Link>
            </div>
            <LanguageSwitcher />
          </div>

          <div className="main-navigation_entete-nav">
            <ul className="navi-links"><NavLinks /></ul>
          </div>

          <div className="logo-container">
            <img src={require("./images/logomenu.png")} alt="Logo" className="logo-style" />
          </div>
        </header>



      </div>

    </>
  );
};



export default Navigation;
