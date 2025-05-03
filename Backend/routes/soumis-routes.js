const express = require("express");
const soumissionController = require("../controllers/soumissions-controller");
const SOUMISSIONS = require("../models/soumission");

const router = express.Router();

// --- ROUTES PUBLIQUES ---
router.get("/", soumissionController.getAllSoumissions);
router.get("/find/:oId", soumissionController.getSoumissionById);
router.post("/find", soumissionController.recherche);

// --- ROUTES SELON RÔLE UTILISATEUR ---
router.get("/client/:id", soumissionController.soumissionList);
router.get("/employe/:id", soumissionController.soumissionList);

// --- NOTES ---
router.patch("/:oId/note", async (req, res) => {
    try {
        const { notes, role, auteur } = req.body;

        if (!notes || !role || !auteur) {
            return res.status(400).json({ msg: "Champs manquants" });
        }

        const champNote = role === "employé" ? "notesEmployes" : "notesClients";
        const nouvelleNote = { auteur, texte: notes, date: new Date() };

        const updated = await SOUMISSIONS.findByIdAndUpdate(
            req.params.oId,
            { $push: { [champNote]: nouvelleNote } },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ msg: "Soumission introuvable." });
        }

        res.status(200).json({ message: "Note ajoutée avec succès", soumission: updated });
    } catch (err) {
        console.error("Erreur serveur:", err);
        res.status(500).json({ msg: "Erreur serveur" });
    }
});
// backend/routes/soumissions-routes.js
router.get("/specialite/:specialite", async (req, res) => {
    try {
        const specialite = req.params.specialite;

        const soumissions = await SOUMISSIONS.find({
            travaux: { $in: [specialite] }
        });

        res.status(200).json(soumissions);
    } catch (err) {
        console.error("Erreur:", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
});

router.patch("/:oId/notes/clear", async (req, res) => {
    const { role } = req.body;

    if (!role) {
        return res.status(400).json({ msg: "Le rôle est requis." });
    }

    const champNote = role === "employé" ? "notesEmployes" : "notesClients";

    try {
        const cleared = await SOUMISSIONS.findByIdAndUpdate(
            req.params.oId,
            { [champNote]: [] },
            { new: true }
        );

        if (!cleared) {
            return res.status(404).json({ msg: "Soumission introuvable." });
        }

        res.status(200).json({ msg: "Historique des notes supprimé", soumission: cleared });
    } catch (err) {
        console.error("Erreur suppression notes:", err);
        res.status(500).json({ msg: "Erreur serveur" });
    }
});

// --- CRUD SOUMISSIONS ---
router.post("/", soumissionController.addSoumission);
router.put("/:oId", soumissionController.majSoumission);
router.delete("/:oId", soumissionController.supprimerSoumission);

module.exports = router;
