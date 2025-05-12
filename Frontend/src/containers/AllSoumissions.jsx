import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";
import moment from "moment";
import "moment/locale/fr";
import { useTranslation } from "react-i18next";
import "moment/locale/en-ca";

const AllSoumissions = () => {
    const { t, i18n } = useTranslation();

    const [soumissions, setSoumissions] = useState([]);
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    useEffect(() => {
        const fetchAllSoumissions = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}soumissions`);
                const data = await response.json();
                setSoumissions(data.soumissions || []);
            } catch (err) {
                console.error("Erreur lors de la récupération des soumissions :", err);
            }
        };
        fetchAllSoumissions();
    }, []);
    useEffect(() => {
        moment.locale(i18n.language);
    }, [i18n.language]);

    const handleClick = (soumi) => {
        navigate(`/soumission/${soumi.id}`, { state: { soumi } });
    };

    if (!auth.user) {
        return <p><strong>{t("connectezVousPourVoir")}</strong></p>;
    }

    return (
        <div>
            <h2>{t("titreToutesSoumissions")}</h2>
            <ul>
                {soumissions.map((soumi) => (
                    <li
                        key={soumi.id}
                        style={{ cursor: "pointer", borderBottom: "1px solid #ccc", padding: "10px" }}
                        onClick={() => handleClick(soumi)}
                    >
                        <strong>{soumi.prenomClient}</strong> - {moment(soumi.date).locale(i18n.language).format("LLL")
                        }
                        <br />
                        {soumi.description || t("pasDeDescription")}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllSoumissions;     