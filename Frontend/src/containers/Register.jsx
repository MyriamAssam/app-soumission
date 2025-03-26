import "./Register.css";
import Inscription from "../components/inscription/Inscription";
import { useState } from "react";

export default function Register() {
  const [typeCompte, setTypeCompte] = useState("Client");

  return (
    <div>
      <Inscription type={typeCompte} />
      <div className="typeCompte">

        <a onClick={() => setTypeCompte("Client")}>Client</a>
        <a onClick={() => setTypeCompte("Employé")}>Employé</a>
      </div>


    </div>
  );
}
