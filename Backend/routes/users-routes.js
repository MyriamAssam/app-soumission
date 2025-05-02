const express = require("express");
const userController = require("../controllers/users-controller");
const checkAuth = require("../middleware/check-auth");
const HttpError = require("../util/http-error");

const USERS = require("../models/user");
const SOUMISSIONS = require("../models/soumission");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/find/:chaine", userController.findUser);
router.get("/allUsers", userController.getAllUsers);

// ✅ Cette route est accessible sans authentification
router.get("/employe/specialite/:specialite", userController.getEmployeBySpecialite);

// ✅ À partir d’ici, on protège les routes
router.use(checkAuth);

router.patch("/:userId", async (req, res, next) => {
    const userIdFromParams = req.params.userId;
    const userIdFromToken = req.userData.userId;

    if (userIdFromParams !== userIdFromToken) {
        const error = new HttpError("Non autorisé à modifier ce profil.", 403);
        return next(error);
    }

    userController.majUser(req, res, next);
});

router.get("/soumissions/employe/:id", async (req, res) => {
    try {
        const employe = await USERS.findById(req.params.id);
        if (!employe || employe.role !== "employé") {
            return res.status(403).json({ msg: "Accès refusé" });
        }

        const soumissions = await SOUMISSIONS.find({
            travaux: employe.specialite
        });

        res.json(soumissions);
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur" });
    }
});

router.get("/soumissions/client/:id", async (req, res) => {
    try {
        const clientId = req.params.id;
        console.log("🔍 clientId reçu :", clientId);

        const objectId = mongoose.Types.ObjectId.isValid(clientId)
            ? new mongoose.Types.ObjectId(clientId)
            : clientId;

        console.log("🔍 objectId utilisé :", objectId);

        const soumissions = await SOUMISSIONS.find({ clientId: objectId });
        console.log("📦 Résultat :", soumissions);

        res.status(200).json(soumissions);
    } catch (err) {
        console.error("🔥 ERREUR BACKEND :", err);
        res.status(500).json({ message: "Erreur lors de la récupération des soumissions du client" });
    }
});



router.get("/:userId", userController.getUserById);

module.exports = router;
