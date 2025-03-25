const express = require("express");
const userController = require("../controllers/users-controller");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/register", userController.register);



router.post("/login", userController.login);

router.get("/find/:chaine", userController.findUser);
router.get("/allUsers", userController.getAllUsers);

router.get("/soumissions/employe/:id", async (req, res) => {
    try {
        const employe = await User.findById(req.params.id);
        if (!employe || employe.role !== "employé") return res.status(403).json({ msg: "Accès refusé" });

        const soumissions = await Soumission.find({
            travaux: employe.specialite
        });

        res.json(soumissions);
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur" });
    }
});

router.get("/:userId", userController.getUserById);
router.put("/:userId", userController.majUser);

// --- EXPORTS ---
module.exports = router;