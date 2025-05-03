const Soumission = require("../models/soumission");
const User = require("../models/user");
const mongoose = require("mongoose");
const HttpError = require("../util/http-error");

// 🔎 GET ALL
const getAllSoumissions = async (req, res, next) => {
    try {
        const soumissions = await Soumission.find();
        if (!soumissions.length) {
            return next(new HttpError("Aucune soumission trouvée...", 404));
        }
        res.json({ soumissions: soumissions.map(s => s.toObject({ getters: true })) });
    } catch (e) {
        next(new HttpError("Échec lors de la récupération des soumissions.", 500));
    }
};

// 🔎 GET ONE
const getSoumissionById = async (req, res, next) => {
    try {
        const soumission = await Soumission.findById(req.params.oId);
        if (!soumission) {
            return next(new HttpError("Soumission introuvable.", 404));
        }
        res.json({ soumission: soumission.toObject({ getters: true }) });
    } catch (e) {
        next(new HttpError("Échec lors de la récupération de la soumission.", 500));
    }
};

// 🔎 FIND (by employeurId or email)
const findSoumissionsByEmail = async (req, res, next) => {
    const { employeurId, email } = req.body;
    let results = [];

    try {
        if (employeurId && mongoose.isValidObjectId(employeurId)) {
            results = await Soumission.find({ employeurId });
        }

        if (email) {
            const emailLower = email.toLowerCase();
            const filterByEmail = (list) =>
                list.filter(
                    s =>
                        s.email.toLowerCase() === emailLower ||
                        s.email.toLowerCase().includes(emailLower) ||
                        emailLower.includes(s.email.toLowerCase())
                );

            if (results.length) {
                results = filterByEmail(results);
            } else {
                const all = await Soumission.find();
                results = filterByEmail(all);
            }
        }

        if (!results.length) {
            return next(new HttpError("Aucune soumission ne correspond à ces filtres.", 404));
        }

        res.json({ soumission: results.map(s => s.toObject({ getters: true })) });
    } catch (e) {
        next(new HttpError("Échec lors de la recherche de la soumission.", 500));
    }
};

// 📥 CREATE
const addSoumission = async (req, res, next) => {
    let {
        adresse, prenomClient, nomEmployeur, email, description,
        telephone, employeurId, travaux, clientId
    } = req.body;

    try {
        if (!mongoose.isValidObjectId(clientId)) {
            return next(new HttpError("clientId invalide.", 400));
        }
        if (!mongoose.isValidObjectId(employeurId)) {
            return next(new HttpError("employeurId invalide.", 400));
        }

        const newSoumission = new Soumission({
            adresse,
            prenomClient,
            nomEmployeur,
            email,
            description,
            telephone,
            employeurId: new mongoose.Types.ObjectId(employeurId),
            clientId: new mongoose.Types.ObjectId(clientId),
            travaux
        });

        await newSoumission.save();
        res.status(201).json({ soumission: newSoumission.toObject({ getters: true }) });
    } catch (e) {
        console.log(e);
        next(new HttpError("Ajout de la soumission échoué.", 500));
    }
};

// ✏️ UPDATE
const modifierSoumission = async (req, res, next) => {
    try {
        const updated = await Soumission.findByIdAndUpdate(
            req.params.oId,
            req.body,
            { new: true }
        );

        if (!updated) {
            return next(new HttpError("Soumission introuvable.", 404));
        }

        res.status(201).json({ soumission: updated.toObject({ getters: true }) });
    } catch (e) {
        next(new HttpError("Échec de la modification de la soumission.", 500));
    }
};

// ❌ DELETE
const deleteSoumission = async (req, res, next) => {
    try {
        const deleted = await Soumission.findByIdAndDelete(req.params.oId);
        if (!deleted) {
            return next(new HttpError("Soumission introuvable.", 404));
        }

        res.status(200).json({ message: "Soumission supprimée avec succès." });
    } catch (e) {
        next(new HttpError("Erreur lors de la suppression.", 500));
    }
};

// 🔎 ALL BY EMPLOYEUR ID
const getAllSoumissionsEmployeur = async (req, res, next) => {
    const employeurId = req.params.soumissionId;

    try {
        if (!mongoose.isValidObjectId(employeurId)) {
            return next(new HttpError("ID employeur invalide.", 400));
        }

        const results = await Soumission.find({ employeurId });
        if (!results.length) {
            return next(new HttpError("Aucune soumission publiée par cet employeur.", 404));
        }

        res.json({ soumissions: results.map(s => s.toObject({ getters: true })) });
    } catch (e) {
        next(new HttpError("Erreur récupération soumissions employeur.", 500));
    }
};

// 🔁 BY ROLE
const soumissionList = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        const query = user.role === "employé"
            ? { travaux: user.specialite }
            : { clientId: new mongoose.Types.ObjectId(userId) };

        const soumissions = await Soumission.find(query);
        if (!soumissions.length) {
            return res.status(404).json({ message: "Aucune soumission trouvée." });
        }

        res.json({ soumissions: soumissions.map(s => s.toObject({ getters: true })) });
    } catch (err) {
        console.error("💥 ERREUR:", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// 🔁 EXPORTS
exports.getAllSoumissions = getAllSoumissions;
exports.getSoumissionById = getSoumissionById;
exports.soumissionUser = getAllSoumissionsEmployeur;
exports.recherche = findSoumissionsByEmail;
exports.soumissionList = soumissionList;
exports.addSoumission = addSoumission;
exports.majSoumission = modifierSoumission;
exports.supprimerSoumission = deleteSoumission;
