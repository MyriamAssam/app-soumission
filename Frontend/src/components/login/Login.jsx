import "./Login.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("");

  const navigate = useNavigate();

  const auth = useContext(AuthContext);
  const [error, SetError] = useState(null);

  async function authSubmitHandler(event) {
    event.preventDefault();
    const inputs = new FormData(event.target);
    const data = Object.fromEntries(inputs.entries());
    console.log("data ", data);
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
      console.log("asd", response);
      const responseData = await response.json();
      console.log("1", responseData);
      auth.login(responseData.userId, responseData.token, responseData.role);



      if (responseData.userId !== undefined) {
        navigate("/soumissions");
      }
      console.log("a");
    } catch (err) {
      SetError(err.message || "une erreur");
      console.log(err);
    }
  }

  return (
    <form onSubmit={authSubmitHandler}>
      <h2>Connexion</h2>
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


      <p className="form-actions">
        <button className="boutonLog" type="submit">
          Connexion
        </button>
      </p>
    </form>
  );
}
