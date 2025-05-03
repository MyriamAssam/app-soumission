const Soumission = require("../models/soumission");
const User = require("../models/user");
const mongoose = require("mongoose");
const HttpError = require("../util/http-error");

exports.getAllSoumissions = async (_, res, next) => {
    try {
        const soums = await Soumission.find();
        if (!soums.length) return next(new HttpError("Aucune soumission trouvée.", 404));
        res.json({ soumissions: soums.map(s => s.toObject({ getters: true })) });
    } catch {
        next(new HttpError("Erreur lors du chargement", 500));
    }
};

exports.getSoumissionById = async (req, res, next) => {
    try {
        const soum = await Soumission.findById(req.params.oId);
        if (!soum) return next(new HttpError("Soumission introuvable", 404));
        res.json({ soumission: soum.toObject({ getters: true }) });
    } catch {
        next(new HttpError("Erreur récupération soumission", 500));
    }
};

exports.recherche = async (req, res, next) => {
    const { employeurId, email } = req.body;
    try {
        let soums = [];

        if (employeurId && mongoose.isValidObjectId(employeurId)) {
            soums = await Soumission.find({ employeurId });
        }

        if (email) {
            const regex = new RegExp(email, "i");
            const filtres = (soums.length ? soums : await Soumission.find()).filter(s =>
                regex.test(s.email)
            );

            if (!filtres.length) return next(new HttpError("Aucune correspondance", 404));
            return res.json({ soumission: filtres.map(s => s.toObject({ getters: true })) });
        }

        if (!soums.length) return next(new HttpError("Aucune soumission trouvée", 404));
        res.json({ soumission: soums.map(s => s.toObject({ getters: true })) });
    } catch {
        next(new HttpError("Erreur lors de la recherche", 500));
    }
};

exports.addSoumission = async (req, res, next) => {
    const {
        adresse, prenomClient, nomEmployeur, email, description,
        telephone, employeurId, clientId, travaux
    } = req.body;

    if (!mongoose.isValidObjectId(clientId)) return next(new HttpError("clientId invalide", 400));

    try {
        const soum = new Soumission({
            adresse, prenomClient, nomEmployeur, email,
            description, telephone, employeurId, clientId, travaux
        });

        await soum.save();
        res.status(201).json({ soumission: soum.toObject({ getters: true }) });
    } catch {
        next(new HttpError("Ajout échoué", 500));
    }
};

exports.majSoumission = async (req, res, next) => {
    try {
        const maj = await Soumission.findByIdAndUpdate(req.params.oId, req.body, { new: true });
        if (!maj) return next(new HttpError("Soumission introuvable", 404));
        res.status(200).json({ soumission: maj.toObject({ getters: true }) });
    } catch {
        next(new HttpError("Erreur mise à jour", 500));
    }
};

exports.supprimerSoumission = async (req, res, next) => {
    try {
        const deleted = await Soumission.findByIdAndDelete(req.params.oId);
        if (!deleted) return next(new HttpError("Soumission introuvable", 404));
        res.status(200).json({ message: "Soumission supprimée." });
    } catch {
        next(new HttpError("Erreur suppression", 500));
    }
};

exports.soumissionUser = async (req, res, next) => {
    const employeurId = req.params.soumissionId;
    try {
        const list = await Soumission.find({ employeurId });
        if (!list.length) return next(new HttpError("Aucune soumission trouvée", 404));
        res.json({ soumissions: list.map(s => s.toObject({ getters: true })) });
    } catch {
        next(new HttpError("Erreur récupération employeur", 500));
    }
};

exports.soumissionList = async (req, res, next) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) return next(new HttpError("Utilisateur introuvable", 404));

        const query = user.role === "employé"
            ? { travaux: user.specialite }
            : { clientId: id };

        const soums = await Soumission.find(query);
        if (!soums.length) return next(new HttpError("Aucune soumission trouvée", 404));

        res.json({ soumissions: soums.map(s => s.toObject({ getters: true })) });
    } catch {
        next(new HttpError("Erreur de récupération", 500));
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
