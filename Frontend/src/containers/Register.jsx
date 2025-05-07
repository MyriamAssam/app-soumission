import "./Register.css";
import Inscription from "../components/inscription/Inscription";
import { useState } from "react";

export default function Register() {
  const [typeCompte, setTypeCompte] = useState("Client");

  return (
    <div className="texte">
      <br />
      <h2>{t("register.messageinscription")} </h2>
      <br />
      <Inscription type={typeCompte} />

    </div>
  );
}
