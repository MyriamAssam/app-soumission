const express = require("express");
const soumissionController = require("../controllers/soumissions-controller");

const router = express.Router();

// ROUTES SPÉCIFIQUES D’ABORD
router.get("/client/:id", soumissionController.soumissionList);
router.get("/employe/:id", soumissionController.soumissionList);
router.get("/find/:oId", soumissionController.getSoumissionById);
router.post("/find", soumissionController.recherche);
router.patch("/:id/note", async (req, res) => {
    try {
        const { notes } = req.body;
        const soumission = await SOUMISSIONS.findByIdAndUpdate(
            req.params.id,
            { notes },
            { new: true }
        );
        res.json(soumission);
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur" });
    }
});

// ROUTES GÉNÉRIQUES
router.get("/", soumissionController.getAllSoumissions);

router.post("/", soumissionController.addSoumission);
router.put("/:oId", soumissionController.majSoumission);
router.delete("/:oId", soumissionController.supprimerSoumission);

module.exports = router;
