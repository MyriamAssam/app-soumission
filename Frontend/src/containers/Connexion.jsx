import React, { useState, useEffect } from "react";
import Login from "../components/login/Login";
import "./Register.css";
import axios from "axios";

export default function Connexion() {
  const [typeCompte, setTypeCompte] = useState("Client");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const fetchOffers = async () => {
      if (isAuthenticated) {
        try {
          let response;
          if (typeCompte === "Client") {
            response = await axios.get(
              process.env.REACT_APP_BACKEND_URL + "soumissions/"
            );
          } else if (typeCompte === "Employé") {
            const employeurId = "66f1d6d0dbe127215621f263";
            response = await axios.get(
              process.env.REACT_APP_BACKEND_URL + `offers-Entrp/${employeurId}/`
            );
          }
          setOffers(response.data.offres);
        } catch (err) {
          setError("Erreur lors de la récupération des soumissions.");
        }
      }
    };

    fetchOffers();
  }, [isAuthenticated, typeCompte]);

  return (

    <div className="texte">
      <br />
      <h2>Inscrivez-vous ou connectez-vous pour demander ou voir vos soumissions!</h2>
      <br />
      <Login type={typeCompte} onLogin={handleLogin} />



      {error && <div>{error}</div>}


    </div>
  );
}
