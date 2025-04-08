import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./DetailSoumission.css";
import moment from "moment";

const DetailSoumission = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { soumi } = location.state || {};
    const auth = useContext(AuthContext);
    const [note, setNote] = useState("");
    const [listeNotes, setListeNotes] = useState([]);


    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await fetch(
                    process.env.REACT_APP_BACKEND_URL + `soumissions/find/${soumi._id}`
                );
                const data = await response.json();
                const noteFromServer = auth.role === "employé" ? data.soumission.notesEmployes : data.soumission.notesClients;
                setNote(noteFromServer || "");
            } catch (err) {
                console.error(err);
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
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        notes: note,
                        role: auth.role,
                        auteur: auth.prenom
                    }),
                }
            );



            const response = await fetch(
                process.env.REACT_APP_BACKEND_URL + `soumissions/find/${soumi._id}`
            );
            const data = await response.json();

            const notes = auth.role === "employé"
                ? data.soumission.notesEmployes
                : data.soumission.notesClients;

            setListeNotes(notes || []);



            alert("Note sauvegardée !");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        const confirmation = window.confirm("Es-tu sûr(e) de vouloir supprimer cette soumission ?");
        if (!confirmation) return;

        try {
            await fetch(process.env.REACT_APP_BACKEND_URL + `soumissions/${soumi._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            alert("Soumission supprimée !");
            navigate("/soumissions");
        } catch (err) {
            console.error(err);
            alert("Une erreur est survenue lors de la suppression.");
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
            <p><strong>Date et heure :</strong> {moment(soumi.date).format("DD MMMM YYYY [à] HH:mm")}</p>



            <label><strong>Note :</strong></label><br />
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={5} cols={50}></textarea>
            <br />

            <button className="bouton" type="button" onClick={handleSaveNote}>
                <strong>Sauvegarder la note</strong>
            </button>
            <h3>Historique des notes :</h3>
            {listeNotes.length === 0 && <p>Aucune note encore.</p>}
            <ul>
                {listeNotes.map((n, idx) => (
                    <li key={idx}>
                        <strong>{n.auteur}</strong> ({moment(n.date).format("DD MMM YYYY HH:mm")}) :
                        <p>{n.texte}</p>
                    </li>
                ))}
            </ul>


            {auth.role === "client" && (
                <div className="boutons-actions">

                    <button className="boutonModi" type="button" onClick={handleEdit}><strong>Modifier</strong></button>
                    <button className="boutonAjout" type="button" onClick={() => navigate("/add-soumi")}>
                        <strong>Créer une autre soumission</strong>
                    </button>

                </div>

            )
            }
            <button className="boutonSupp" type="button" onClick={handleDelete}><strong>Supprimer</strong></button>

        </div >
    );
};
export default DetailSoumission;