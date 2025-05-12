
import { useTranslation } from "react-i18next";

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import "moment/locale/fr";
import "moment/locale/en-ca";


const ListeSoumissions = () => {
    const { t, i18n } = useTranslation();
    const [soumissions, setSoumissions] = useState([]);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();


    useEffect(() => {
        const lang = i18n.language.startsWith("fr") ? "fr" : "en-ca";
        moment.locale(lang);
    }, [i18n.language]);

    useEffect(() => {
        const fetchSoumissions = async () => {
            try {
                const endpoint =
                    auth.role === "employé"
                        ? `soumissions/employe/${auth.user._id}`
                        : `soumissions/client/${auth.user._id}`;

                const response = await fetch(process.env.REACT_APP_BACKEND_URL + endpoint);
                const data = await response.json();
                setSoumissions(data.soumissions || []);
            } catch (err) {
                console.error(err);
            }
        };

        if (auth.user && auth.role) {
            fetchSoumissions();
        }
    }, [auth.user, auth.role]);

    const handleDetails = (soumi) => {
        navigate(`/soumission/${soumi._id}`, { state: { soumi } });
    };

    const handleAddSoumi = () => {
        navigate("/add-soumi", {
            state: {
                prenomClient: "",
                email: "",
                adresse: "",
                telephone: "",
                description: "",
                travaux: false,
            },
        });
    };

    return (
        <div>
            <h2>
                {auth.role === "client"
                    ? t("soumissions.titre_client")
                    : t("soumissions.titre_employe")}
            </h2>

            {auth.role === "client" && (
                <button onClick={handleAddSoumi}>{t("soumissions.bouton_nouvelle")}</button>
            )}

            <ul>
                {soumissions.map((soumi) => (
                    <li
                        key={soumi._id}
                        onClick={() => handleDetails(soumi)}
                        style={{
                            cursor: "pointer",
                            padding: "10px",
                            borderBottom: "1px solid #ccc",
                        }}
                    >
                        {soumi.description
                            ? `${soumi.description} - ${moment(soumi.date).locale(i18n.language).format("LLL")}`
                            : t("soumissions.aucune_description")}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListeSoumissions;
