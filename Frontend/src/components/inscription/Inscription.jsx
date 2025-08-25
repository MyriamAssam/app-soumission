import "./Inscription.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function Inscription(props) {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prenom, setPrenom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState(null);
  const [error, SetError] = useState(null);
  const [typeCompte, setTypeCompte] = useState("Client");

  const navigate = useNavigate();
  const { user, token } = useAuthContext();
  const auth = useContext(AuthContext);

  const motDePasseEstValide = (pwd) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pwd);
  };

  const formatPhoneInput = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    const len = cleaned.length;
    if (len < 4) return cleaned;
    if (len < 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  };

  async function authSubmitHandler(event) {
    event.preventDefault();
    const inputs = new FormData(event.target);
    const data = Object.fromEntries(inputs.entries());

    if (!motDePasseEstValide(password)) {
      SetError(t("form.erreur_password"));
      return;
    }

    event.target.reset();

    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "users/register", // <- sans le slash final
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // credentials: "include", // seulement si tu envoies/attends des cookies
          mode: "cors",
          body: JSON.stringify(data),
        }
      );


      const responseData = await response.json();

      if (!response.ok) {
        SetError(responseData.message || t("register.erreur_generale"));
        return;
      }


      const u = responseData.user;
      auth.login(
        u.id,
        responseData.token,
        u.prenom,
        u.email,
        u.adresse,
        u.telephone,
        u.role,
        u.specialite || ""
      );

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
    } catch (err) {
      SetError(err.message || "error");
      console.log(err);
    }
  }

  return (
    <form onSubmit={authSubmitHandler}>
      <h2>{t("register.inscription")}</h2>

      <div className="controles-rows">
        <div className="controles no-margin">
          <label>{t("email")} :</label>
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
        <div className="controles no-margin mdp-field">
          <label>{t("form.mot_de_passe")} :</label>
          <input
            type="password"
            name="mdp"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      { }
      <p className="mdp-info">{t("mdp")}</p>







      <div className="controles-rows">
        <div className="controles no-margin">
          <label>{t("form.prenom")} :</label>
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
          <label>{t("form.adresse")} :</label>
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
          <label>{t("form.telephone")}</label>
          <input
            type="tel"
            name="telephone"
            value={telephone}
            onChange={(e) => setTelephone(formatPhoneInput(e.target.value))}
            maxLength="12"
            required
          />
        </div>
      </div>

      {typeCompte === "Employé" && (
        <div className="controles-rows">
          <div className="controles no-margin">
            <label>{t("profil.specialite")} :</label>
            <select name="specialite" required>
              {[
                "portes et fenêtres", "extérieur", "salle de bain", "toiture",
                "plancher", "climatisation", "électricité", "plomberie",
                "cuisine", "peinture"
              ].map((item) => (
                <option key={item} value={item}>{t(`typeTravauxList.${item}`)}</option>
              ))}

            </select>
          </div>
        </div>
      )}

      <input
        type="hidden"
        name="role"
        value={typeCompte === "Employé" ? "employé" : "client"}
      />

      <div className="typeCompte">
        <button
          type="button"
          className={typeCompte === "Client" ? "active" : ""}
          onClick={() => {
            setTypeCompte("Client");
            setMessage({ type: "info", text: t("form.msg_client") });
          }}
        >
          {t("client")}
        </button>

        <button
          type="button"
          className={typeCompte === "Employé" ? "active" : ""}
          onClick={() => {
            setTypeCompte("Employé");
            setMessage({ type: "info", text: t("form.msg_employe") });
          }}
        >
          {t("form.employe")}
        </button>
      </div>


      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <p className="form-actions">
        <button className="boutonLog" type="submit">
          <strong>{t("register.btn")}</strong>
        </button>
      </p>

      {error && <div className="message">{error}</div>}
    </form>
  );
}
