import React, { useState, useEffect } from "react";
import Login from "../components/login/Login";
//import OffersList from "../components/OffersList/OffersList";
import axios from "axios";

export default function Connexion() {
  const [typeCompte, setTypeCompte] = useState("Candidat");
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
          if (typeCompte === "Candidat") {
            response = await axios.get(
              process.env.REACT_APP_BACKEND_URL + "offres/"
            );
          } else if (typeCompte === "Employeur") {
            const employeurId = "66f1d6d0dbe127215621f263";
            response = await axios.get(
              process.env.REACT_APP_BACKEND_URL + `offers-Entrp/${employeurId}/`
            );
          }
          setOffers(response.data.offres);
        } catch (err) {
          setError("Erreur lors de la récupération des offres.");
        }
      }
    };

    fetchOffers();
  }, [isAuthenticated, typeCompte]);

  return (
    <div>
      <div className="typeCompte">

        <a onClick={() => setTypeCompte("Client")}>Client</a>
        <a onClick={() => setTypeCompte("Employé")}>Employé</a>
      </div>

      <Login type={typeCompte} onLogin={handleLogin} />

      {error && <div>{error}</div>}


    </div>
  );
}
