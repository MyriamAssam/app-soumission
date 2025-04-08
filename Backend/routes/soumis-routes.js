const express = require("express");
const soumissionController = require("../controllers/soumissions-controller");
const SOUMISSIONS = require("../models/soumission");

const router = express.Router();

// ROUTES SPÉCIFIQUES D’ABORD
router.get("/client/:id", soumissionController.soumissionList);
router.get("/employe/:id", soumissionController.soumissionList);
router.get("/find/:oId", soumissionController.getSoumissionById);
router.post("/find", soumissionController.recherche);

router.patch("/:id/note", async (req, res) => {
    try {
        const { notes, role, auteur } = req.body;
        const champNote = role === "employé" ? "notesEmployes" : "notesClients";

        const nouvelleNote = {
            auteur,
            texte: notes,
            date: new Date()
        };

        const soumission = await SOUMISSIONS.findByIdAndUpdate(
            req.params.id,
            { $push: { [champNote]: nouvelleNote } },
            { new: true }
        );

        if (!soumission) {
            return res.status(404).json({ msg: "Soumission introuvable." });
        }

        res.json({ message: "Note mise à jour", soumission });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Erreur serveur" });
    }
});



// ROUTES GÉNÉRIQUES
router.get("/", soumissionController.getAllSoumissions);

router.post("/", soumissionController.addSoumission);
router.put("/:oId", soumissionController.majSoumission);
router.delete("/:oId", soumissionController.supprimerSoumission);

module.exports = router;
