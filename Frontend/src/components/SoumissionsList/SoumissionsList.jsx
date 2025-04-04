import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";


const ListeSoumissions = () => {
    const [soumissions, setSoumissions] = useState([]);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Rôle :", auth.role, "| ID :", auth.user);
        const fetchSoumissions = async () => {
            try {
                const endpoint = auth.role === "employé"
                    ? `soumissions/employe/${auth.user}`
                    : `soumissions/client/${auth.user}`;

                const response = await fetch(process.env.REACT_APP_BACKEND_URL + endpoint);
                const data = await response.json();
                setSoumissions(data.soumissions || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSoumissions();
    }, [auth.user, auth.role]);



    const handleDetails = (soumi) => {
        navigate(`/soumission/${soumi.id}`, { state: { soumi } });
    };

    const handleAddSoumi = () => {
        navigate("/add-soumi", {
            state: {
                prenomClient: "", email: "", adresse: "", telephone: "", description: "", travaux: false
            }
        });
    };

    return (
        <div>
            <h2>Mes Soumissions</h2>
            {auth.role === "client" && (
                <button onClick={handleAddSoumi}>Créer une nouvelle soumission</button>
            )}

            <ul>
                {soumissions.map((soumi) => (
                    <li key={soumi.id} onClick={() => handleDetails(soumi)} style={{ cursor: "pointer", padding: "10px", borderBottom: "1px solid #ccc" }}>
                        {soumi.description + " - " + moment(soumi.date).format("DD MMM YYYY HH:mm") || "(Aucune description)"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListeSoumissions;
