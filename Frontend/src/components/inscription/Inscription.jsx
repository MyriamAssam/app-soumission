import "./Inscription.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { AuthContext } from "../context/AuthContext";

export default function Inscription(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prenom, setPrenom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const { user, token } = useAuthContext();
  const auth = useContext(AuthContext);
  const [error, SetError] = useState(null);
  const [typeCompte, setTypeCompte] = useState("Client");
  async function authSubmitHandler(event) {
    event.preventDefault();
    const inputs = new FormData(event.target);
    const data = Object.fromEntries(inputs.entries());
    console.log("data ", data);
    event.target.reset();
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "users/register/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      console.log("2", responseData);
      auth.login(responseData.user.id, responseData.token);

      if (responseData.user.role === "client") {
        navigate("/add-soumi", {
          state: {
            PrenomClient: responseData.user.prenom,
            email: responseData.user.email,
            adresse: responseData.user.adresse,
            phone: responseData.user.telephone,
            travaux: false,
          },
        });
      } else if (responseData.user.role === "employé") {
        navigate("/soumissions");
      }

      console.log("data1 ", responseData);
    } catch (err) {
      SetError(err.message || "une erreur");
      console.log(err);
    }
  }

  return (
    <form onSubmit={authSubmitHandler}>
      <h2>Inscription</h2>
      <div className="controles-rows">
        <div className="controles no-margin">
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="controles-rows">
        <div className="controles no-margin">
          <label>Mot de passe :</label>
          <input
            type="password"
            name="mdp"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="controles-rows">
        <div className="controles no-margin">
          <label>Prénom :</label>
          <input
            type="prenom"
            name="prenom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="controles-rows">
        <div className="controles no-margin">
          <label>Adresse :</label>
          <input
            type="adresse"
            name="adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="controles-rows">
        <div className="controles no-margin">
          <label>Téléphone</label>
          <input
            type="telephone"
            name="telephone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            required
          />
        </div>
      </div>
      {typeCompte === "Employé" && (
        <div className="controles no-margin">
          <label>Domaine de spécialité :</label>
          <select name="specialite" required>
            {[
              "portes et fenêtres", "extérieur", "salle de bain", "toiture",
              "plancher", "climatisation", "éléctricité", "plomberie", "cuisine", "peinture"
            ].map((sp) => (
              <option key={sp} value={sp}>{sp}</option>
            ))}
          </select>
        </div>

      )}
      { }
      <input type="hidden" name="role" value={typeCompte === "Employé" ? "employé" : "client"} />


      <div className="typeCompte">


        <a onClick={() => {
          setTypeCompte("Client");
          setMessage({ type: "info", text: "Client sélectionné." });
        }}>
          <strong>Client</strong>
        </a>

        <a onClick={() => {
          setTypeCompte("Employé");
          setMessage({ type: "info", text: "Employé sélectionné." });
        }}>
          <strong>Employé</strong>
        </a>
      </div>
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      <p className="form-actions">
        <button className="boutonLog" type="submit">
          <strong>Inscription</strong>
        </button>
      </p>
    </form>
  );
}
