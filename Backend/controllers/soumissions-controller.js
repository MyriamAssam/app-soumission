const SOUMISSIONS = require("../models/soumission");
const HttpError = require("../util/http-error");
const mongoose = require("mongoose");


const getAllSoumissions = async (req, res, next) => {
    let soumissions;
    try {
        soumissions = await SOUMISSIONS.find().exec();
        if (!soumissions || soumissions.length == 0) {
            return next(new HttpError("Aucune soumission trouvée...", 404));
        }
    } catch (e) {
        console.log(e);
        return next(
            new HttpError(
                "Échec lors de la récupération des soumissions, veuillez réessayer plus tard",
                500
            )
        );
    }
    res.json({ soumissions: soumissions.map((o) => o.toObject({ getters: true })) });
};



const getSoumissionById = async (req, res, next) => {
    const oId = req.params.oId;

    let soumission;
    try {
        soumission = await SOUMISSIONS.findById(oId);
    } catch (e) {
        console.log(e);
        return next(
            new HttpError(
                "Échec lors de la récupération de la soumission, veuillez réessayer plus tard.",
                500
            )
        );
    }

    if (!soumission) {
        return next(new HttpError("Soumission introuvable.", 404));
    }

    res.json({ soumission: soumission.toObject({ getters: true }) });
};


const getAllSoumissionsEmployeur = async (req, res, next) => {
    const employeurId = req.params.soumissionId;

    let SoumissionsEmployeur;
    try {
        SoumissionsEmployeur = await SOUMISSIONS.find({ employeurId: employeurId });
    } catch (e) {
        // Vérifier si l'erreur provient du fait que l'utilisateur est introuvable
        if (e.kind == "ObjectId" && e.path == "employeurId") {
            return next(new HttpError("L'utilisateur est introuvable.", 404));
        }

        console.log(e);
        return next(
            new HttpError(
                "Échec lors de l'obtention des soumissions de l'utilisateur.",
                500
            )
        );
    }

    if (SoumissionsEmployeur?.length === 0) {
        return next(
            new HttpError(
                "Cet utilisateur n'a pas encore publié de soumissions ou il est introuvable.",
                404
            )
        );
    }

    res.json({
        soumissions: SoumissionsEmployeur.map((o) => o.toObject({ getters: true })),
    });
};


const findSoumissionsByEmail = async (req, res, next) => {
    const { employeurId, email } = req.body;
    console.log(`EmployeurId: ${employeurId}, Email: ${email}`);

    let soumission = [];
    try {
        if (employeurId && mongoose.isValidObjectId(employeurId)) {
            (await SOUMISSIONS.find({ employeurId: employeurId })).map((o) =>
                soumission.push(o)
            );
        }
        if (email && email.length > 0) {
            if (soumission.length > 0) {
                soumission = soumission.filter(
                    (o) =>
                        o.email.toLowerCase() == email.toLowerCase() ||
                        o.email.toLowerCase().includes(email.toLowerCase()) ||
                        email.toLowerCase().includes(o.email.toLowerCase())
                );
            } else {
                const allSoumissions = await SOUMISSIONS.find();
                const allSoumissionsApresFiltre = allSoumissions.filter(
                    (o) =>
                        o.email.toLowerCase() == email.toLowerCase() ||
                        o.email.toLowerCase().includes(email.toLowerCase()) ||
                        email.toLowerCase().includes(o.email.toLowerCase())
                );
                allSoumissionsApresFiltre.map((o) => {
                    soumission.push(o);
                    console.log("Soumission trouvée par email: ", o);
                });
            }
        }
    } catch (e) {
        console.log(e);
        return next(
            new HttpError(
                "Échec lors de la recherche de la soumission, veuillez réessayer plus tard.",
                500
            )
        );
    }

    if (soumission.length == 0) {
        return next(
            new HttpError("Aucune soumission ne correspond à ces filtres.", 404)
        );
    }

    res.json({ soumission: soumission.map((o) => o.toObject({ getters: true })) });
};


const addSoumission = async (req, res, next) => {
    const { adresse, prenomClient, nomEmployeur, email, description, telephone, employeurId, travaux } = req.body;

    const newSoumission = new SOUMISSIONS({
        adresse,
        nomEmployeur,
        email,
        description,
        telephone,
        employeurId,
        prenomClient,
        clientId: req.body.clientId,
        travaux

    });

    try {
        await newSoumission.save();
        res.status(201).json({ soumission: newSoumission.toObject({ getters: true }) });
    } catch (err) {
        return next(new HttpError("Adding soumission failed, please try again.", 500));
    }
};




const modifierSoumission = async (req, res, next) => {
    const oId = req.params.oId;
    const modifications = req.body;

    try {
        const soumissionModifiee = await SOUMISSIONS.findByIdAndUpdate(oId, modifications, {
            new: true,
        });

        if (!soumissionModifiee) {
            return next(new HttpError("Soumission introuvable.", 404));
        }

        res.status(201).json({ soumission: soumissionModifiee.toObject({ getters: true }) });
    } catch (e) {
        console.log(e);
        return next(new HttpError("Échec lors de la modification de la soumission.", 500));
    }
};


exports.modifierNote = async (req, res, next) => {
    const { oId, noteId } = req.params;
    const { texte, role } = req.body;

    const champNote = role === "employé" ? "notesEmployes" : "notesClients";

    try {
        const soum = await SOUMISSIONS.findById(oId);
        if (!soum) return next(new HttpError("Soumission introuvable", 404));

        const notes = soum[champNote];
        const noteIndex = notes.findIndex((n) => n.id === noteId);
        if (noteIndex === -1) {
            console.warn("Note non trouvée par ID:", noteId, notes.map(n => n.id));
            return next(new HttpError("Note introuvable", 404));
        }


        notes[noteIndex].texte = texte;

        await soum.save();
        res.status(200).json({ message: "Note modifiée avec succès", soumission: soum });
    } catch (err) {
        console.error(err);
        return next(new HttpError("Erreur serveur", 500));
    }
};


const ajouterNote = async (req, res, next) => {
    const soumissionId = req.params.oId;
    const { notes, role, auteur } = req.body;

    try {
        const soumission = await SOUMISSIONS.findById(soumissionId);
        if (!soumission) {
            return next(new HttpError("Soumission introuvable.", 404));
        }

        const nouvelleNote = {
            id: req.body.id,
            auteur,
            texte: notes,
            date: new Date()
        };


        if (role === "client") {
            soumission.notesClients.push(nouvelleNote);
        } else if (role === "employé") {
            soumission.notesEmployes.push(nouvelleNote);
        } else {
            return next(new HttpError("Rôle invalide.", 400));
        }

        await soumission.save();
        res.status(200).json({ message: "Note ajoutée avec succès." });
    } catch (err) {
        console.error(err);
        return next(new HttpError("Erreur lors de l'ajout de la note.", 500));
    }
};


const soumissionList = async (req, res, next) => {
    const userId = req.params.id;
    const user = await require("../models/user").findById(userId);

    if (!user || !user.role) {
        return res.status(404).json({ message: "Utilisateur invalide." });
    }

    if (user.role === "employé" && !user.specialite) {
        return res.status(404).json({ message: "Employé sans spécialité." });
    }


    let query = {};
    if (user.role === "employé") {
        query.travaux = user.specialite;
    } else {
        query.clientId = userId;
    }

    try {
        const soumissions = await SOUMISSIONS.find(query);
        res.json({ soumissions: soumissions.map((s) => s.toObject({ getters: true })) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur lors du chargement des soumissions." });
    }
}


const deleteSoumission = async (req, res, next) => {
    const oId = req.params.oId;

    let soumission;
    try {
        soumission = await SOUMISSIONS.findByIdAndDelete(oId);

        if (!soumission) {
            return next(new HttpError("Soumission introuvable.", 404));
        }

        res.status(200).json({ message: "La soumission a été supprimée avec succès." });
    } catch (e) {
        console.log(e);
        return next(
            new HttpError(
                "Échec lors de la suppression de la soumission, veuillez réessayer plus tard.",
                500
            )
        );
    }
};

// --- EXPORTS ---
exports.getAllSoumissions = getAllSoumissions;
exports.getSoumissionById = getSoumissionById;
exports.soumissionUser = getAllSoumissionsEmployeur;
exports.recherche = findSoumissionsByEmail;
exports.soumissionList = soumissionList;
exports.addSoumission = addSoumission;
exports.majSoumission = modifierSoumission;
exports.supprimerSoumission = deleteSoumission;
exports.ajouterNote = ajouterNote;