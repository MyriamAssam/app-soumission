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

router.patch("/:oId/notes/clear", checkAuth, soumissionController.clearNotes);


// ROUTES GÉNÉRIQUES PROTÉGÉES
router.get("/", soumissionController.getAllSoumissions);
router.patch("/:oId/note", soumissionController.ajouterNote);
router.post("/", checkAuth, soumissionController.addSoumission);
router.put("/:oId", soumissionController.majSoumission);
router.delete("/:oId", soumissionController.supprimerSoumission);

module.exports = router;
