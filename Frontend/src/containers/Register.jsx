import "./Register.css";
import Inscription from "../components/inscription/Inscription";
import { useState } from "react";

export default function Register() {
  const [typeCompte, setTypeCompte] = useState("Client");

  return (
    <div className="texte">
      <h2>Inscrivez-vous ou connectez-vous pour demander ou voir vos soumissions!</h2>
      <Inscription type={typeCompte} />

    </div>
  );
}
