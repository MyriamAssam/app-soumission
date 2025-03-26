import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const DetailSoumission = () => {
    const location = useLocation();
    const { soumi } = location.state || {};
    const auth = useContext(AuthContext);
    const [note, setNote] = useState(soumi.notes || "");

    const handleSaveNote = async () => {
        try {
            await fetch(
                process.env.REACT_APP_BACKEND_URL + `soumissions/${soumi._id}/note`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ notes: note })
                }
            );
            alert("Note sauvegardée !");
        } catch (err) {
            console.error(err);
        }
    };

    if (!soumi) return <p>Aucune donnée à afficher.</p>;

    return (
        <div>
            <h2>Détails de la soumission</h2>
            <p><strong>Prénom :</strong> {soumi.prenomClient}</p>
            <p><strong>Email :</strong> {soumi.email}</p>
            <p><strong>Adresse :</strong> {soumi.adresse}</p>
            <p><strong>Téléphone :</strong> {soumi.telephone}</p>
            <p><strong>Description :</strong> {soumi.description}</p>
            <p><strong>Travaux :</strong> {soumi.travaux?.join(", ")}</p>

            {auth.role === "employé" ? (
                <>
                    <label><strong>Notes :</strong></label><br />
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={5} cols={50}></textarea>
                    <br />
                    <button className="bouton" type="submit" onClick={handleSaveNote}>Sauvegarder la note</button>
                </>
            ) : (
                <>
                    <p><strong>Note de l’employé :</strong> {soumi.notes || "Aucune note encore"}</p>
                </>
            )}
        </div>
    );
};

export default DetailSoumission;

