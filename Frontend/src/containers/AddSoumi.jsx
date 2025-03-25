import "./AddSoumi.css";
import React, { useContext } from "react";
import { useHttpClient } from "../hooks/http-hook";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";

const AddSoumi = (props) => {
    const { sendRequest } = useHttpClient();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    let prenomClient, email, adresse, description, travaux, telephone

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

        const newSoumi = {
            adresse: data.adresse,
            prenomClient: data.PrenomClient,
            email: data.email,
            description: data.description,
            telephone: data.telephone,
            employeurId: auth.user,
            travaux: travauxSelectionnes,
        };

        try {
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + "soumissions/",
                "POST",
                JSON.stringify(newSoumi),
                { "Content-Type": "application/json" }
            );
        } catch (err) {
            console.error(err);
        }
        event.target.reset();
        navigate("/soumissions?refresh=true");
    }




    return (
        <form onSubmit={addSoumiSubmitHandler}>
            <h2>Créer nouvelle Soumission</h2>
            <div className="controles-rows">
                <div className="controles no-margin">
                    <label>Types de travaux :</label>
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
                <div className="controles no-margin">
                    <label>Email : </label>
                    <input type="email" name="email" defaultValue={email} required />
                </div>
            </div>

            <div className="controles-rows">
                <div className="controles no-margin">
                    <label>prénom: </label>
                    <input type="prenomClient" name="prenomClient" defaultValue={prenomClient} />
                </div>
            </div>

            <div className="controles-rows">
                <div className="controles no-margin">
                    <label>Télephone : </label>
                    <input type="telephone" name="telephone" defaultValue={telephone} />
                </div>
            </div>
            <div className="controles-rows">
                <div className="controles no-margin">
                    <label>Adresse : </label>
                    <input type="adresse" name="adresse" defaultValue={adresse} />
                </div>
            </div>
            <div className="controles-rows">
                <div className="controles no-margin">
                    <label>Description : </label>
                    <textarea name="description" cols="60" rows="5" defaultValue={description}></textarea>
                </div>
            </div>

            <p className="form-actions">
                <button className="boutonLog" type="submit">
                    Créer
                </button>

            </p>
        </form>
    );
};

export default AddSoumi;