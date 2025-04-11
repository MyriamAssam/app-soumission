import "./Register.css";
import Inscription from "../components/inscription/Inscription";
import { useState } from "react";

export default function Register() {
  const [typeCompte, setTypeCompte] = useState("Client");

  return (
    <div className="texte">
      <br />
      <h2>Inscrivez-vous ou connectez-vous pour demander ou voir vos soumissions!</h2>
      <br />
      <Inscription type={typeCompte} />

    </div>
  );
}
