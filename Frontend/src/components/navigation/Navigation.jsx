import LanguageSwitcher from "../LanguageSwitcher";
import React from "react";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";


const Navigation = () => {
  return (
    <>
      <header className="main-entete">
        <h1 className="main-navigation_titre">
          <Link to="/connexion" className="soumission-lien">Soumissions</Link>
        </h1>
        <nav className="main-navigation_entete-nav">

          <NavLinks />
          <LanguageSwitcher />
          {/* ✅ ICI, sous le NavLinks */}
          <div style={logoContainer}>
            <img src={require("./images/logomenu.png")} alt="Logo" style={logoStyle} />
          </div>
        </nav>
      </header>
    </>
  );
};

const logoContainer = {
  flex: 1,
  display: "flex",
  justifyContent: "flex-start",
  marginLeft: "200px"
};

const logoStyle = {
  height: "50px",
  width: "auto"
};

export default Navigation;
