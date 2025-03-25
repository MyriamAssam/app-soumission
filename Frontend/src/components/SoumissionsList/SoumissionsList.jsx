import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ListeSoumissions = () => {
    const [soumissions, setSoumissions] = useState([]);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSoumissions = async () => {
            try {
                const endpoint =
                    auth.role === "employé"
                        ? `soumissions/employe/${auth.user}`
                        : `soumissions/client/${auth.user}`;

                const response = await fetch(process.env.REACT_APP_BACKEND_URL + endpoint);
                const data = await response.json();
                setSoumissions(data);
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
                PrenomClient: "", email: "", adresse: "", phone: "", description: "", travaux: false
            }
        });
    };

    return (
        <div>
            <h2>Mes Soumissions</h2>
            <button onClick={handleAddSoumi}>Créer une nouvelle soumission</button>
            <ul>
                {soumissions.map((soumi) => (
                    <li key={soumi.id} onClick={() => handleDetails(soumi)} style={{ cursor: "pointer", padding: "10px", borderBottom: "1px solid #ccc" }}>
                        {soumi.description || "(Aucune description)"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListeSoumissions;
