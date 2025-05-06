import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
export default function Profile() {
    const { user, token, updateUser } = useAuthContext();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        prenom: "",
        adresse: "",
        telephone: "",
        email: "",
        mdp: "",
        role: "",
        specialite: ""
    });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                prenom: user.prenom || "",
                adresse: user.adresse || "",
                telephone: user.telephone || "",
                email: user.email || "",
                mdp: "",
                role: user.role || "",
                specialite: user.specialite || ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            if (name === "role" && value !== "employé") {
                return {
                    ...prev,
                    [name]: value,
                    specialite: ""
                };
            }

            return {
                ...prev,
                [name]: value
            };
        });
    };
    const telephoneEstValide = (tel) => {
        return /^\d{3}-\d{3}-\d{4}$/.test(tel);
    };
    const motDePasseEstValide = (mdp) => {
        if (!mdp) return true;
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(mdp);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        if (!telephoneEstValide(formData.telephone)) {
            setMessage({ type: "error", text: "Format de téléphone invalide (ex : 123-456-7890)." });
            return;
        }

        if (!motDePasseEstValide(formData.mdp)) {
            setMessage({ type: "error", text: "Mot de passe faible. Il doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial." });
            return;
        }

        try {
            const response = await fetch(
                process.env.REACT_APP_BACKEND_URL + `users/${user._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(formData)
                }
            );



            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour.");
            }

            const updatedUser = await response.json();
            updateUser(updatedUser.user);
            console.log(updatedUser);
            setMessage({ type: "success", text: "Profil mis à jour avec succès!" });

        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Échec de la mise à jour du profil." });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Modifier mon profil</h2>

            <div className="controles">
                <label>Prénom :</label>
                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
            </div>

            <div className="controles">
                <label>Adresse :</label>
                <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} required />
            </div>

            <div className="controles">
                <label>Téléphone :</label>
                <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} required />
            </div>

            <div className="controles">
                <label>Email :</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="controles">
                <label>Mot de passe :</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="mdp"
                        value={formData.mdp}
                        onChange={handleChange}
                        style={{ flex: 1 }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        style={{ marginLeft: "8px" }}
                    >
                        {showPassword ? "Cacher" : "Afficher"}
                    </button>
                </div>
            </div>



            {formData.role === "employé" && (
                <div className="controles">
                    <div className="controles-rows">
                        <div className="controles no-margin">
                            <label>Domaine de spécialité :</label>
                            <select name="specialite" value={formData.specialite} onChange={handleChange} required>
                                {[
                                    "portes et fenêtres", "extérieur", "salle de bain", "toiture",
                                    "plancher", "climatisation", "électricité", "plomberie", "cuisine", "peinture"
                                ].map((sp) => (
                                    <option key={sp} value={sp}>{sp}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}


            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <p className="form-actions">
                <button className="boutonLog" type="submit">
                    <strong>Mettre à jour</strong>
                </button>
            </p>
        </form>
    );
}
