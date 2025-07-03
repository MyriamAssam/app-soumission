const express = require("express");
const soumissionController = require("../controllers/soumissions-controller");
const SOUMISSIONS = require("../models/soumission");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// ROUTES PUBLIQUES
router.get("/client/:id", soumissionController.soumissionList);
router.get("/employe/:id", soumissionController.soumissionList);
router.get("/find/:oId", soumissionController.getSoumissionById);
router.post("/find", soumissionController.recherche);

// PROTÉGER TOUTES LES ROUTES SUIVANTES
router.use(checkAuth);

// ROUTES PROTÉGÉES
router.patch("/:oId/note/:noteId", soumissionController.modifierNote);
router.get("/:oId/notes", soumissionController.getNotes);
router.delete("/:oId/notes/:noteId", soumissionController.deleteNote);

router.patch("/:oId/notes/clear", checkAuth, async (req, res, next) => {
    const { role } = req.body;

    if (!role) {
        return res.status(400).json({ msg: "Le rôle est requis." });
    }

    const champNote = role === "employé" ? "notesEmployes" : role === "client" ? "notesClients" : null;

    if (!champNote) {
        return res.status(400).json({ msg: "Rôle invalide." });
    }

    try {
        const soumission = await SOUMISSIONS.findById(req.params.oId);
        if (!soumission) {
            return res.status(404).json({ msg: "Soumission introuvable." });
        }

        soumission[champNote] = [];
        await soumission.save();

        return res.status(200).json({ msg: "Historique supprimé.", soumission });
    } catch (err) {
        console.error("Erreur suppression notes:", err);
        return next(new Error("Erreur serveur lors de la suppression des notes."));
    }
});


// ROUTES GÉNÉRIQUES PROTÉGÉES
router.get("/", soumissionController.getAllSoumissions);
router.patch("/:oId/note", soumissionController.ajouterNote);
router.post("/", checkAuth, soumissionController.addSoumission);
router.put("/:oId", soumissionController.majSoumission);
router.delete("/:oId", soumissionController.supprimerSoumission);

module.exports = router;
