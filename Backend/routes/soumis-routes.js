// --- IMPORTS ---
const express = require("express");
const soumissionController = require("../controllers/soumissions-controller");
const checkAuth = require("../middleware/check-auth");

// --- ROUTES ---
const router = express.Router();

router.get("/", soumissionController.getAllSoumissions);
router.get("/find/:oId", soumissionController.getSoumissionById);
router.get("/:employeurId", soumissionController.soumissionUser);

router.post("/find", soumissionController.recherche);

router.get("/employe/:id", soumissionController.soumissionList);
router.get("/client/:id", soumissionController.soumissionList);

router.post("/", soumissionController.addSoumission);
router.put("/:oId", soumissionController.majSoumission);
router.delete("/:oId", soumissionController.supprimerSoumission);
router.patch("/soumissions/:id/note", async (req, res) => {
    try {
        const { notes } = req.body;
        const soumission = await Soumission.findByIdAndUpdate(
            req.params.id,
            { notes },
            { new: true }
        );
        res.json(soumission);
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur" });
    }
});

// --- EXPORTS ---
module.exports = router;