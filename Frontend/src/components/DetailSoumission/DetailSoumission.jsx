import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./DetailSoumission.css";

const DetailSoumission = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { soumi } = location.state || {};
    const auth = useContext(AuthContext);
    const [note, setNote] = useState(soumi.notes || "");
    const [message, setMessage] = useState(null);
    useEffect(() => {
        const fetchNote = async () => {
            if (auth.role === "client") {
                try {
                    const response = await fetch(
                        process.env.REACT_APP_BACKEND_URL + `soumissions/find/${soumi._id}`
                    );
                    const data = await response.json();
                    setNote(data.soumission.notes || "");
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchNote();
    }, [auth.role, soumi._id]);

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

            const response = await fetch(
                process.env.REACT_APP_BACKEND_URL + `soumissions/find/${soumi._id}`
            );
            const data = await response.json();
            setNote(data.soumission.notes || "");
            setMessage({ type: "info", text: "Note sauvegardée !" });

        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        const confirmation = setMessage({ type: "info", text: "Es-tu sûr(e) de vouloir supprimer cette soumission ?" });
        {
            message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )
        }
        if (!confirmation) return;

        try {
            await fetch(process.env.REACT_APP_BACKEND_URL + `soumissions/${soumi._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            {
                message && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )
            }
            setMessage({ type: "info", text: "❌ Soumission supprimée !" });

            navigate("/soumissions");
        } catch (err) {
            console.error(err);
            {
                message && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )
            }
            setMessage({ type: "info", text: "❌ Une erreur est survenue lors de la suppression." });
        }
    };


    const handleEdit = () => {
        navigate("/add-soumi", {
            state: {
                prenomClient: soumi.prenomClient,
                email: soumi.email,
                adresse: soumi.adresse,
                telephone: soumi.telephone,
                description: soumi.description,
                travaux: soumi.travaux,
                soumissionId: soumi._id,
            }
        });
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
                    <button className="bouton" type="button" onClick={handleSaveNote}><strong>Sauvegarder la note</strong></button>
                </>
            ) : (
                <p><strong>Note de l’employé :</strong> {note || "Aucune note encore"}</p>
            )}

            {auth.role === "client" && (
                <div className="boutons-actions">
                    <button className="boutonSupp" type="button" onClick={handleDelete}><strong>Supprimer</strong></button>
                    <button className="boutonModi" type="button" onClick={handleEdit}><strong>Modifier</strong></button>
                </div>
            )}


        </div>
    );
};
export default DetailSoumission;
