import "./Login.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [typeCompte, setTypeCompte] = useState("Client");
  const [message, setMessage] = useState(null);
  const [error, SetError] = useState(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { user, token } = useAuthContext();

  async function authSubmitHandler(event) {
    event.preventDefault();
    const inputs = new FormData(event.target);
    const data = Object.fromEntries(inputs.entries());
    data.type = typeCompte.toLowerCase();
    event.target.reset();

    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "users/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        SetError(t("login_failed"));
        return;
      }

      if (
        !responseData.role ||
        responseData.role.toLowerCase() !== typeCompte.toLowerCase()
      ) {
        SetError(t("wrong_role"));
        return;
      }

      auth.login(
        responseData.userId,
        responseData.token,
        responseData.prenom,
        responseData.email,
        responseData.adresse,
        responseData.telephone,
        responseData.role,
        responseData.specialite

      );

      if (responseData.userId !== undefined) {
        navigate("/soumissions");
      }
    } catch (err) {
      SetError(t("error_occurred"));
      console.error(err);
    }
  }

  return (
    <form onSubmit={authSubmitHandler} className="login-form">
      <div className="form-inner">
        <h2>{t("connexion")}</h2>

        <div className="controles-rows">
          <div className="controles no-margin">
            <label htmlFor="email">{t("email")} :</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <br />
          <div className="controles no-margin">
            <label htmlFor="mdp">{t("form.mot_de_passe")} :</label>
            <input
              type="password"
              id="mdp"
              name="mdp"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="typeCompte">
          <button
            type="button"
            className={typeCompte === "Client" ? "active" : ""}
            onClick={() => {
              setTypeCompte("Client");
              setMessage({ type: "info", text: t("msg_client") });
            }}
          >
            {t("client")}
          </button>

          <button
            type="button"
            className={typeCompte === "Employé" ? "active" : ""}
            onClick={() => {
              setTypeCompte("Employé");
              setMessage({ type: "info", text: t("msg_employe") });
            }}
          >
            {t("employe")}
          </button>
        </div>

        {error && <div className="message erreur">{error}</div>}
        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        <div className="form-actions">
          <button className="boutonLog" type="submit">
            <strong>{t("connexion")}</strong>
          </button>
        </div>
      </div>
    </form>

  );
}
