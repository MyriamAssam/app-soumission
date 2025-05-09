import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";
import moment from "moment";
import { useTranslation } from "react-i18next";

const AllSoumissions = () => {
    const { t } = useTranslation();
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
                {soumissions.map((soumi) => {
                    const estClientProprietaire = auth.role === "client" && auth.user._id === soumi.clientId;
                    const estEmployeAutorise = auth.role === "employé" && soumi.travaux.includes(auth.user.specialite);

                    return (
                        <li
                            key={soumi.id}
                            style={{ cursor: "pointer", borderBottom: "1px solid #ccc", padding: "10px" }}
                            onClick={() => handleClick(soumi)}
                        >
                            <strong>{soumi.prenomClient}</strong> - {moment(soumi.date).format("DD MMM YYYY [à] HH:mm")}
                            <br />
                            {soumi.description || t("pasDeDescription")}

                            {(estClientProprietaire || estEmployeAutorise) && (
                                <div style={{ marginTop: "5px" }}>
                                    {estClientProprietaire && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate("/add-soumi", {
                                                    state: { ...soumi, soumissionId: soumi.id }
                                                });
                                            }}
                                        >
                                            {t("details.boutonModifierSoum")}
                                        </button>
                                    )}
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                await fetch(`${process.env.REACT_APP_BACKEND_URL}soumissions/${soumi.id}`, {
                                                    method: "DELETE",
                                                    headers: { "Content-Type": "application/json" }
                                                });
                                                setSoumissions((prev) => prev.filter(s => s.id !== soumi.id));
                                            } catch (err) {
                                                console.error("Erreur suppression :", err);
                                            }
                                        }}
                                    >
                                        {t("details.boutonSupprimerSoum")}
                                    </button>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AllSoumissions;
