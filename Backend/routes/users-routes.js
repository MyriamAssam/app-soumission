const express = require("express");
const userController = require("../controllers/users-controller");
const checkAuth = require("../middleware/check-auth");
const HttpError = require("../util/http-error");
const { safeObjectId } = require("../util/mongo-utils");

const USERS = require("../models/user");
const SOUMISSIONS = require("../models/soumission");

const router = express.Router();

// --- ROUTES PUBLIQUES ---
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/find/:chaine", userController.findUser);
router.get("/allUsers", userController.getAllUsers);
router.get("/employe/specialite/:specialite", userController.getEmployeBySpecialite);

// --- ROUTES PROTÉGÉES ---
router.use(checkAuth);

// 🔐 Mise à jour du profil utilisateur (auto-protection par token)
router.patch("/:userId", async (req, res, next) => {
    const { userId } = req.params;
    const userFromToken = req.userData.userId;

    if (userId.toString() !== userFromToken.toString()) {
        return next(new HttpError("Non autorisé à modifier ce profil.", 403));
    }

    userController.majUser(req, res, next);
});

// 🔐 Soumissions d'un employé (par spécialité)
router.get("/soumissions/employe/:id", async (req, res) => {
    try {
        const employe = await USERS.findById(req.params.id);
        if (!employe || employe.role !== "employé") {
            return res.status(403).json({ msg: "Accès refusé" });
        }

        const soumissions = await SOUMISSIONS.find({
            travaux: employe.specialite
        }).lean();

        res.json(soumissions);
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur" });
    }
});

// 🔐 Soumissions d'un client (par ID)
router.get("/soumissions/client/:id", async (req, res) => {
    try {
        const objectId = safeObjectId(req.params.id);
        const soumissions = await SOUMISSIONS.find({ clientId: objectId }).lean();

        res.status(200).json(soumissions);
    } catch (err) {
        console.error("🔥 ERREUR BACKEND :", err);
        res.status(500).json({ message: "Erreur lors de la récupération des soumissions du client" });
    }
});

// 🔐 Détails utilisateur (doit être en dernier !)
router.get("/:userId", userController.getUserById);

module.exports = router;
