import "./AddSoumi.css";
import React, { useContext, useEffect, useState } from "react";

import { useHttpClient } from "../hooks/http-hook";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";


const AddSoumi = (props) => {
    const { sendRequest } = useHttpClient();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    let prenomClient, email, adresse, description, travaux, telephone
    const [emailField, setEmailField] = useState(auth.email || "");
    const [adresseField, setAdresseField] = useState(auth.adresse || "");
    const [telephoneField, setTelephoneField] = useState(auth.telephone || "");
    useEffect(() => {
        setEmailField(auth.email || "");
        setAdresseField(auth.adresse || "");
        setTelephoneField(auth.telephone || "");
    }, [auth.email, auth.adresse, auth.telephone]);

    const location = useLocation();
    if (location.state !== null) {
        telephone = location.state.telephone;
        prenomClient = location.state.prenomClient;
        email = location.state.email;
        adresse = location.state.adresse;
        description = location.state.description;
        travaux = location.state.published;

    } else {
        telephone = 0;
        prenomClient = "";
        email = "";
        adresse = 0;
        description = "";
        travaux = null;

    }



    async function addSoumiSubmitHandler(event) {
        event.preventDefault();
        const fd = new FormData(event.target);
        const data = Object.fromEntries(fd.entries());

        const travauxSelectionnes = fd.getAll("travaux");

        const isEdit = location.state?.soumissionId;

        const newSoumi = {
            adresse: auth.adresse,
            prenomClient: auth.prenom,
            email: auth.email,
            telephone: auth.telephone,
            employeurId: auth.user,
            clientId: auth.user,
            description: data.description,
            travaux: travauxSelectionnes,
        };


        try {
            const url = isEdit
                ? process.env.REACT_APP_BACKEND_URL + `soumissions/${location.state.soumissionId}`
                : process.env.REACT_APP_BACKEND_URL + `soumissions/`;
            const method = isEdit ? "PUT" : "POST";

            await sendRequest(url, method, JSON.stringify(newSoumi), {
                "Content-Type": "application/json",
            });

            navigate("/soumissions?refresh=true");
        } catch (err) {
            console.error(err);
        }
    }



    return (
        <form onSubmit={addSoumiSubmitHandler}>
            <h2>{location.state?.soumissionId ? "Modifier la soumission" : "Créer nouvelle Soumission"}</h2>

            <div className="controles-rows">
                <div className="controles no-margin">
                    <label>Types de travaux :</label>
                    <br />
                    <div className="checkbox-group">
                        {["portes et fenêtres", "extérieur", "salle de bain", "toiture", "plancher", "climatisation", "éléctricité", "plomberie", "cuisine", "peinture"].map((item) => (
                            <div key={item}>
                                <label>
                                    <input type="checkbox" name="travaux" value={item} />
                                    {item}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="controles-rows">

            </div>

            <div className="controles-rows">
                <div className="controles no-margin">
                    <label>Email :</label>
                    <br />
                    <input type="email" value={emailField} readOnly />
                    <br />
                </div>
                <div className="controles no-margin">
                    <label>Adresse :</label>
                    <br />
                    <input type="text" value={adresseField} readOnly />
                    <br />
                </div>
                <div className="controles no-margin">
                    <label>Téléphone :</label>
                    <br />
                    <input type="text" value={telephoneField} readOnly />
                    <br />
                </div>
            </div>


            <div className="controles-rows">
                <div className="controles no-margin">
                    <label>Description : </label>
                    <br />
                    <textarea name="description" cols="60" rows="5" defaultValue={description}></textarea>
                </div>
            </div>

            <p className="form-actions">
                <button className="boutonLog" type="submit">
                    {location.state?.soumissionId ? "Modifier" : "Créer"}
                </button>


            </p>
        </form>
    );
};

export default AddSoumi;