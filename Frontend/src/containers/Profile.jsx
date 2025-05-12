import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { useTranslation } from "react-i18next";

export default function Profile() {
    const { t } = useTranslation();
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
                mdp: user.mdp || "",
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

    const telephoneEstValide = (tel) => /^\d{3}-\d{3}-\d{4}$/.test(tel);
    const motDePasseEstValide = (mdp) => {
        if (!mdp) return true;
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(mdp);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        if (!telephoneEstValide(formData.telephone)) {
            setMessage({ type: "error", text: t("profil.telephoneInvalide") });
            return;
        }

        if (!motDePasseEstValide(formData.mdp)) {
            setMessage({ type: "error", text: t("profil.motDePasseInvalide") });
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

            if (!response.ok) throw new Error();

            const updatedUser = await response.json();
            updateUser(updatedUser.user);
            setMessage({ type: "success", text: t("profil.miseAJourSucces") });

        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: t("profil.miseAJourErreur") });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{t("profil.titre")}</h2>

            <div className="controles">
                <label>{t("profil.prenom")} :</label>
                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
            </div>

            <div className="controles">
                <label>{t("profil.adresse")} :</label>
                <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} required />
            </div>

            <div className="controles">
                <label>{t("profil.telephone")} :</label>
                <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} required />
            </div>

            <div className="controles">
                <label>{t("profil.email")} :</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <label>{t("profil.infoMdp")}</label>

            <div className="controles">
                <label>{t("profil.mdp")} :</label>
                <div className="input-with-button">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="mdp"
                        value={formData.mdp}
                        onChange={handleChange}
                        required
                    />
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? t("profil.cacher") : t("profil.afficher")}
                    </button>
                </div>
            </div>
            <label>{t("specialite")} :</label>
            {formData.role === "employé" && (

                <div className="controles">

                    <label>{t("profil.specialite")} :</label>
                    <select name="specialite" value={formData.specialite} onChange={handleChange} required>
                        {[
                            "portes et fenêtres", "extérieur", "salle de bain", "toiture",
                            "plancher", "climatisation", "électricité", "plomberie",
                            "cuisine", "peinture"
                        ].map((item) => (
                            <option key={item} value={item}>{t(`typeTravauxList.${item}`)}</option>
                        ))}

                    </select>
                </div>
            )}

            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <p className="form-actions">
                <button className="boutonLog" type="submit">
                    <strong>{t("profil.btnMettreAJour")}</strong>
                </button>
            </p>
        </form>
    );
}
