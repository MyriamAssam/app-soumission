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
    const [message, setMessage] = useState(null);
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);
    useEffect(() => {
        const fetchNoteList = async () => {
            try {
                const response = await fetch(
                    process.env.REACT_APP_BACKEND_URL + `soumissions/find/${soumi._id}`
                );
                const data = await response.json();
                const notes = auth.role === "employé"
                    ? data.soumission.notesEmployes
                    : data.soumission.notesClients;
                setListeNotes(notes || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchNoteList();
    }, [auth.role, soumi._id]);

    const handleEditNote = (index, texte) => {
        setNote(texte); // Remet la note dans le champ
        // Supprimer la note en attente de mise à jour
        const newNotes = [...listeNotes];
        newNotes.splice(index, 1);
        setListeNotes(newNotes);
    };

    const handleDeleteNote = async (index) => {
        const newNotes = [...listeNotes];
        newNotes.splice(index, 1);

        try {
            const champNote = auth.role === "employé" ? "notesEmployes" : "notesClients";
            await fetch(
                `${process.env.REACT_APP_BACKEND_URL}soumissions/${soumi._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ [champNote]: newNotes }),
                }
            );
            setListeNotes(newNotes);
            setMessage({ type: "info", text: "Note supprimée." });
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Erreur lors de la suppression de la note." });
        }
    };


    const handleSaveNote = async () => {
        try {
            console.log("📤 Données envoyées :", {
                note,
                role: auth.role,
                auteur: auth.prenom
            });

            await fetch(
                process.env.REACT_APP_BACKEND_URL + `soumissions/${soumi._id}/note`,

                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        notes: note,
                        role: auth.role,
                        auteur: auth.prenom,
                    }),
                }
            );

            console.log("📤 Données envoyées :", {
                note,
                role: auth.role,
                auteur: auth.prenom
            });

            const response = await fetch(
                process.env.REACT_APP_BACKEND_URL + `soumissions/find/${soumi._id}`
            );
            const data = await response.json();

            const notes = auth.role === "employé"
                ? data.soumission.notesEmployes
                : data.soumission.notesClients;

            setListeNotes(notes || []);
            setNote("");
            setMessage({ type: "info", text: "Note sauvegardée !" });

        } catch (err) {
            console.error(err);

            setMessage({ type: "info", text: "Erreur lors de la sauvegarde de la note." });


        }
    };

    const handleClearNotes = async () => {


        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}soumissions/${soumi._id}/notes/clear`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ role: auth.role }),
                }
            );

            const data = await response.json();
            setListeNotes([]);

            setMessage({ type: "info", text: "Historique des notes supprimé !" });


        } catch (err) {
            console.error(err);

            setMessage({ type: "info", text: "Erreur lors de la suppression de l'historique." });


        }
    };

    const handleDelete = async () => {


        try {
            await fetch(process.env.REACT_APP_BACKEND_URL + `soumissions/${soumi._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }

            });



            navigate("/soumissions");
        } catch (err) {
            console.error(err);

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

    const formatPhoneNumber = (number) => {
        if (!number) return "";
        const cleaned = ("" + number).replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return number;
    };

    if (!soumi) return <p>Aucune donnée à afficher.</p>;

    return (
        <div className="container-detail">
            <h2>Détails de la soumission</h2>
            <p><strong>Prénom :</strong> {soumi.prenomClient}</p>
            <p><strong>Email :</strong> {soumi.email}</p>
            <p><strong>Adresse :</strong> {soumi.adresse}</p>
            <p><strong>Téléphone :</strong> {formatPhoneNumber(soumi.telephone)}</p>
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

                        {n.auteur === auth.prenom && (
                            <>
                                <button onClick={() => handleEditNote(idx, n.texte)}>Modifier</button>
                                <button onClick={() => handleDeleteNote(idx)}>Supprimer</button>
                            </>
                        )}
                    </li>
                ))}

            </ul>

            <button className="boutonSupp" type="button" onClick={handleClearNotes}>
                <strong>Supprimer l'historique</strong>
            </button>

            {auth.role === "client" && (
                <div className="boutons-actions">

                    <button className="boutonModi" type="button" onClick={handleEdit}><strong>Modifier</strong></button>
                    <button className="boutonAjout" type="button" onClick={() => navigate("/add-soumi")}>
                        <strong>Créer une autre soumission</strong>
                    </button>
                    <button className="boutonSupp" type="button" onClick={handleDelete}><strong>Supprimer</strong></button>
                </div>

            )
            }
            <br />
            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}


            {auth.role === "employé" && (
                <div className="boutons-actions">


                    <button className="boutonSupp" type="button" onClick={handleDelete}><strong>Supprimer</strong></button>
                </div>

            )
            }



        </div >
    );
};
export default DetailSoumission;