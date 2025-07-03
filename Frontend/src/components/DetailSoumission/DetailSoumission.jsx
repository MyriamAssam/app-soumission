import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import "./DetailSoumission.css";
import moment from "moment";

const DetailSoumission = () => {
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();
    const location = useLocation();
    const { soumi } = location.state || {};
    const auth = useContext(AuthContext);

    const [noteIdEnCours, setNoteIdEnCours] = useState(null);
    const [note, setNote] = useState("");
    const [listeNotes, setListeNotes] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);
    useEffect(() => {
        const lang = i18n.language.startsWith("fr") ? "fr" : "en-ca";
        moment.locale(lang);
    }, [i18n.language]);

    useEffect(() => {
        const fetchNoteList = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}soumissions/find/${soumi._id}`
                );
                const data = await response.json();
                const notes = auth.role === "employé" ? data.soumission.notesEmployes : data.soumission.notesClients;
                setListeNotes(notes || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchNoteList();
    }, [auth.role, soumi._id]);

    const handleEditNote = (index) => {
        const noteAEditer = listeNotes[index];
        setNote(noteAEditer.texte);
        setNoteIdEnCours(noteAEditer.id || noteAEditer._id); // fallback si jamais
    };


    const handleDeleteNote = async (index) => {
        const newNotes = [...listeNotes];
        newNotes.splice(index, 1);

        try {
            const champNote = auth.role === "employé" ? "notesEmployes" : "notesClients";
            await fetch(`${process.env.REACT_APP_BACKEND_URL}soumissions/${soumi._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [champNote]: newNotes }),
            });
            setListeNotes(newNotes);
            setMessage({ type: "info", text: t("details.noteSupprimee") });
        } catch (err) {
            setMessage({ type: "error", text: t("details.erreurSuppression") });
        }
    };

    const handleSaveNote = async () => {
        try {
            const isEdit = noteIdEnCours != null && noteIdEnCours !== "";

            const url = isEdit
                ? `${process.env.REACT_APP_BACKEND_URL}soumissions/${soumi._id}/note/${noteIdEnCours}`
                : `${process.env.REACT_APP_BACKEND_URL}soumissions/${soumi._id}/note`;

            const body = isEdit
                ? { texte: note, role: auth.role }
                : {
                    id: Math.random().toString(36).substr(2, 9),
                    texte: note,
                    role: auth.role,
                    auteur: auth.user.prenom,
                    auteurId: auth.user._id // ✅ ajoute ceci
                };





            await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + auth.token  // ✅ Ajoute le token
                },
                body: JSON.stringify(body),
            });


            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}soumissions/find/${soumi._id}`);
            const data = await res.json();
            const notes = auth.role === "employé" ? data.soumission.notesEmployes : data.soumission.notesClients;

            setListeNotes(notes || []);
            setNote("");
            setNoteIdEnCours(null);
            setMessage({ type: "info", text: t("details.noteSauvegardee") });
        } catch (err) {
            setMessage({ type: "info", text: t("details.erreurSauvegarde") });
        }
    };

    const handleClearNotes = async () => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}soumissions/${soumi._id}/notes/clear`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: auth.role }),
            });

            // 🔁 Recharge la liste après suppression pour éviter les notes fantômes
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}soumissions/find/${soumi._id}`);
            const data = await res.json();
            const notes = auth.role === "employé" ? data.soumission.notesEmployes : data.soumission.notesClients;

            setListeNotes(notes || []);
            setMessage({ type: "info", text: t("details.historiqueSupprime") });
        } catch (err) {
            setMessage({ type: "info", text: t("details.erreurSuppressionHistorique") });
        }
    };


    const handleDelete = async () => {
        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}soumissions/${soumi._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + auth.token  // ✅ Ajoute le token ici
                },
            });
            navigate("/soumissions");
        } catch (err) {
            console.error(err);
        }
    };


    const handleEdit = () => {
        navigate("/add-soumi", {
            state: { ...soumi, soumissionId: soumi._id },
        });

    };

    const formatPhoneNumber = (number) => {
        const cleaned = ("" + number).replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        return match ? `${match[1]}-${match[2]}-${match[3]}` : number;
    };

    if (!soumi) return <p>{t("details.aucuneDonnee")}</p>;

    return (
        <div className="container-detail">
            <h2>{t("details.titre")}</h2>
            <p><strong>{t("details.prenom")} :</strong> {soumi.prenomClient}</p>
            <p><strong>{t("details.email")} :</strong> {soumi.email}</p>
            <p><strong>{t("details.adresse")} :</strong> {soumi.adresse}</p>
            <p><strong>{t("details.telephone")} :</strong> {formatPhoneNumber(soumi.telephone)}</p>
            <p><strong>{t("details.description")} :</strong> {soumi.description}</p>
            <p><strong>{t("details.travaux")} :</strong> {soumi.travaux?.join(", ")}</p>
            <p><strong>{t("details.date")} :</strong> {moment(soumi.date).locale(i18n.language).format("LLL")}</p>

            <label><strong>{t("details.note")}</strong></label><br />
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={5} cols={50}></textarea><br />

            <button className="bouton" type="button" onClick={handleSaveNote}>
                <strong>{t("details.boutonSauvegarder")}</strong>
            </button>

            <h3>{t("details.historique")}</h3>
            {listeNotes.length === 0 && <p>{t("details.aucuneNote")}</p>}
            <ul>
                {listeNotes.map((n, idx) => (
                    <li key={idx}>
                        <strong>{n.auteur}</strong> ({moment(soumi.date).format("LLL")}) :
                        <p>{n.texte}</p>
                        {n.auteurId === auth.user._id && (
                            <>
                                <button onClick={() => handleEditNote(idx)}>{t("details.boutonModifier")}</button>
                                <button onClick={() => handleDeleteNote(idx)}>{t("details.boutonSupprimer")}</button>
                            </>
                        )}

                    </li>
                ))}
            </ul>

            <button className="boutonSupp" onClick={handleClearNotes}>
                <strong>{t("details.boutonSupprimerHistorique")}</strong>
            </button>
            { }
            {auth.role === "client" && auth.user._id === soumi.clientId && (
                <div className="boutons-actions">
                    <button className="boutonModi" onClick={handleEdit}><strong>{t("details.boutonModifierSoum")}</strong></button>
                    <button className="boutonAjout" onClick={() => navigate("/add-soumi")}><strong>{t("details.boutonAjouter")}</strong></button>
                    <button className="boutonSupp" onClick={handleDelete}><strong>{t("details.boutonSupprimerSoum")}</strong></button>
                </div>
            )}

            { }
            {auth.role === "employé" && soumi.travaux.includes(auth.user.specialite) && (
                <div className="boutons-actions">
                    <button className="boutonSupp" onClick={handleDelete}><strong>{t("details.boutonSupprimerSoum")}</strong></button>
                </div>
            )}


            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default DetailSoumission;
