import "./AddSoumi.css";
import React, { useContext, useEffect, useState } from "react";
import { useHttpClient } from "../hooks/http-hook";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";
import { useTranslation } from "react-i18next";

const AddSoumi = () => {
    const { t } = useTranslation();
    const { sendRequest } = useHttpClient();
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [emailField, setEmailField] = useState(auth.user?.email || "");
    const [adresseField, setAdresseField] = useState(auth.user?.adresse || "");
    const [telephoneField, setTelephoneField] = useState(auth.user?.telephone || "");
    const description = location.state?.description || "";
    const isEdit = !!location.state?.soumissionId;

    useEffect(() => {
        setEmailField(auth.user?.email || "");
        setAdresseField(auth.user?.adresse || "");
        setTelephoneField(auth.user?.telephone || "");
    }, [auth.user]);

    async function addSoumiSubmitHandler(event) {
        event.preventDefault();
        const fd = new FormData(event.target);
        const data = Object.fromEntries(fd.entries());
        const travauxSelectionnes = [fd.get("travaux")];

        const newSoumi = {
            adresse: auth.user?.adresse,
            prenomClient: auth.user?.prenom,
            email: auth.user?.email,
            telephone: auth.user?.telephone,
            employeurId: auth.user?._id || auth.user?.userId,
            clientId: auth.user?._id || auth.user?.userId,
            nomEmployeur: auth.user?.prenom,
            description: data.description,
            travaux: travauxSelectionnes,
        };

        try {
            const url = isEdit
                ? `${process.env.REACT_APP_BACKEND_URL}soumissions/${location.state.soumissionId}`
                : `${process.env.REACT_APP_BACKEND_URL}soumissions/`;
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
            <h2>{isEdit ? t("soumission.modifSoumission") : t("soumission.modifSoumission")}</h2>

            <div className="controles-rows">
                <div className="controles no-margin">
                    <label>{t("soumission.typeTravaux")} :</label>
                    <select name="travaux" required defaultValue="">
                        <option value="" disabled>{t("soumission.selectionType")}</option>
                        {[
                            "portes et fenêtres", "extérieur", "salle de bain", "toiture",
                            "plancher", "climatisation", "électricité", "plomberie",
                            "cuisine", "peinture"
                        ].map((item) => (
                            <option key={item} value={item}>{t(`typeTravauxList.${item}`)}</option>
                        ))}

                    </select>
                </div>
            </div>

            <div className="controles-rows">
                <div className="controles no-margin">
                    <label>{t("profil.email")} :</label>
                    <input type="email" value={emailField} readOnly />
                </div>
                <div className="controles no-margin">
                    <label>{t("profil.adresse")} :</label>
                    <input type="text" value={adresseField} readOnly />
                </div>
                <div className="controles no-margin">
                    <label>{t("profil.telephone")} :</label>
                    <input type="text" value={telephoneField} readOnly />
                </div>
            </div>

            <div className="controles-rows">
                <div className="controles no-margin">
                    <label>{t("details.description")} : </label>
                    <textarea name="description" cols="60" rows="5" defaultValue={description}></textarea>
                </div>
            </div>

            <p className="form-actions">
                <button className="boutonLog" type="submit">
                    {isEdit ? t("soumission.modifier") : t("soumission.creer")}
                </button>
            </p>
        </form>
    );
};

export default AddSoumi;
