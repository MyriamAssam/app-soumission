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
        return next(new HttpError("Échec lors de la récupération des soumissions, veuillez réessayer plus tard", 500));
    }
    return res.json({ soumissions: soumissions.map((o) => o.toObject({ getters: true })) });
};

const getSoumissionById = async (req, res, next) => {
    const oId = req.params.oId;
    let soumission;
    try {
        soumission = await SOUMISSIONS.findById(oId);
    } catch (e) {
        console.log(e);
        return next(new HttpError("Échec lors de la récupération de la soumission, veuillez réessayer plus tard.", 500));
    }
    if (!soumission) {
        return next(new HttpError("Soumission introuvable.", 404));
    }
    return res.json({ soumission: soumission.toObject({ getters: true }) });
};

const getAllSoumissionsEmployeur = async (req, res, next) => {
    const employeurId = req.params.soumissionId;
    let SoumissionsEmployeur;
    try {
        SoumissionsEmployeur = await SOUMISSIONS.find({ employeurId: employeurId });
    } catch (e) {
        if (e.kind == "ObjectId" && e.path == "employeurId") {
            return next(new HttpError("L'utilisateur est introuvable.", 404));
        }
        console.log(e);
        return next(new HttpError("Échec lors de l'obtention des soumissions de l'utilisateur.", 500));
    }
    if (SoumissionsEmployeur?.length === 0) {
        return next(new HttpError("Cet utilisateur n'a pas encore publié de soumissions ou il est introuvable.", 404));
    }
    return res.json({ soumissions: SoumissionsEmployeur.map((o) => o.toObject({ getters: true })) });
};

const findSoumissionsByEmail = async (req, res, next) => {
    const { employeurId, email } = req.body;
    console.log(`EmployeurId: ${employeurId}, Email: ${email}`);
    let soumission = [];
    try {
        if (employeurId && mongoose.isValidObjectId(employeurId)) {
            (await SOUMISSIONS.find({ employeurId: employeurId })).map((o) => soumission.push(o));
        }
        if (email && email.length > 0) {
            if (soumission.length > 0) {
                soumission = soumission.filter((o) =>
                    o.email.toLowerCase() == email.toLowerCase() ||
                    o.email.toLowerCase().includes(email.toLowerCase()) ||
                    email.toLowerCase().includes(o.email.toLowerCase())
                );
            } else {
                const allSoumissions = await SOUMISSIONS.find();
                const allSoumissionsApresFiltre = allSoumissions.filter((o) =>
                    o.email.toLowerCase() == email.toLowerCase() ||
                    o.email.toLowerCase().includes(email.toLowerCase()) ||
                    email.toLowerCase().includes(o.email.toLowerCase())
                );
                allSoumissionsApresFiltre.map((o) => soumission.push(o));
            }
        }
    } catch (e) {
        console.log(e);
        return next(new HttpError("Échec lors de la recherche de la soumission, veuillez réessayer plus tard.", 500));
    }
    if (soumission.length == 0) {
        return next(new HttpError("Aucune soumission ne correspond à ces filtres.", 404));
    }
    return res.json({ soumission: soumission.map((o) => o.toObject({ getters: true })) });
};


const addSoumission = async (req, res, next) => {
    const {
        adresse,
        prenomClient,
        nomEmployeur = null,
        email,
        description,
        telephone,
        employeurId = null,
        travaux
    } = req.body;

    const clientId = req.userData?.userId;
    const role = req.userData?.role;

    if (!clientId) {
        return next(new HttpError("Client non authentifié.", 401));
    }

    // 🔎 Validation générale
    if (!adresse || !prenomClient || !email || !description || !telephone) {
        return next(new HttpError("Informations manquantes.", 400));
    }

    // ✅ Validation spécifique employé
    if (role === "employé") {
        if (!nomEmployeur || !employeurId) {
            return next(new HttpError("Informations employeur manquantes.", 400));
        }
    }

    let clientObjectId;
    try {
        clientObjectId = new mongoose.Types.ObjectId(clientId);
    } catch (err) {
        return next(new HttpError("ID client invalide.", 400));
    }

    console.log("===== [addSoumission] Début de la requête =====");
    console.log("Body reçu:", req.body);
    console.log("Client ID (token):", clientId);
    console.log("Rôle:", role);
    console.log("===============================================");

    const newSoumission = new SOUMISSIONS({
        adresse,
        nomEmployeur,
        email,
        description,
        telephone,
        employeurId: employeurId ? new mongoose.Types.ObjectId(employeurId) : null,
        prenomClient,
        clientId: clientObjectId,
        travaux: travaux || []
    });

    try {
        await newSoumission.save();
        res.status(201).json({ soumission: newSoumission.toObject({ getters: true }) });
    } catch (err) {
        console.error("Erreur .save():", err.message);
        return next(new HttpError("Ajout de la soumission échoué : " + err.message, 500));
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


const modifierNote = async (req, res, next) => {
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
    const { id, texte, role, auteur } = req.body;

    if (!texte || !role || !auteur) {
        return next(new HttpError("Champs requis manquants pour la note.", 400));
    }

    const roleNormalized = role.toLowerCase();
    const champNote = roleNormalized === "client" ? "notesClients" :
        roleNormalized === "employé" ? "notesEmployes" : null;


    if (!champNote) {
        return next(new HttpError("Rôle invalide (doit être 'client' ou 'employé').", 400));
    }

    try {
        const soumission = await SOUMISSIONS.findById(soumissionId);
        if (!soumission) {
            return next(new HttpError("Soumission introuvable.", 404));
        }

        // Empêcher les doublons
        if (soumission[champNote].some(n => n.id === id)) {
            return next(new HttpError("Une note avec cet ID existe déjà.", 400));
        }

        const noteId = id || require("crypto").randomBytes(6).toString("hex");
        const nouvelleNote = {
            id: noteId,
            auteur,
            auteurId: req.userData.userId,
            texte,
            role,
            date: new Date()
        };




        soumission[champNote].push(nouvelleNote);

        await soumission.save();
        res.status(201).json({ message: "Note ajoutée avec succès.", soumission });

    } catch (err) {
        console.error("Erreur lors de l'ajout de la note:", err);
        return next(new HttpError("Erreur lors de l'ajout de la note: " + err.message, 500));
    }
};




const soumissionList = async (req, res, next) => {
    try {
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

        const soumissions = await SOUMISSIONS.find(query);
        return res.json({ soumissions: soumissions.map((s) => s.toObject({ getters: true })) });
    } catch (err) {
        console.error("Erreur dans soumissionList:", err);
        return res.status(500).json({ message: "Erreur serveur lors du chargement des soumissions." });
    }
};



const deleteSoumission = async (req, res, next) => {
    const oId = req.params.oId;
    const userRole = req.userData.role;
    const userId = req.userData.userId;

    let soumission;
    try {
        soumission = await SOUMISSIONS.findById(oId);
        if (!soumission) {
            return next(new HttpError("Soumission introuvable.", 404));
        }

        // ✅ Vérifie permissions
        if (userRole === "client") {
            if (soumission.clientId.toString() !== userId) {
                return next(new HttpError("Non autorisé à supprimer cette soumission.", 403));
            }
        } else if (userRole === "employé") {
            const user = await require("../models/user").findById(userId);
            if (!user || soumission.travaux.indexOf(user.specialite) === -1) {
                return next(new HttpError("Non autorisé à supprimer cette soumission.", 403));
            }
        } else {
            return next(new HttpError("Rôle non autorisé.", 403));
        }

        // ✅ Supprime après validation
        await soumission.deleteOne();

        res.status(200).json({ message: "La soumission a été supprimée avec succès." });
    } catch (e) {
        console.log(e);
        return next(new HttpError("Échec lors de la suppression de la soumission, veuillez réessayer plus tard.", 500));
    }
};

const getNotes = async (req, res, next) => {
    const { oId } = req.params;
    const { role } = req.query;

    if (!role || (role !== "client" && role !== "employé")) {
        return next(new HttpError("Rôle invalide (client ou employé requis).", 400));
    }

    const champNote = role === "client" ? "notesClients" : "notesEmployes";

    try {
        const soumission = await SOUMISSIONS.findById(oId);
        if (!soumission) {
            return next(new HttpError("Soumission introuvable.", 404));
        }

        res.status(200).json({ notes: soumission[champNote] });
    } catch (err) {
        console.error(err);
        return next(new HttpError("Erreur lors de la récupération des notes.", 500));
    }
};
const clearNotes = async (req, res, next) => {
    const { role } = req.body;
    const { oId } = req.params;

    if (!role) {
        return next(new HttpError("Le rôle est requis.", 400));
    }

    const champNote = role === "employé" ? "notesEmployes" : role === "client" ? "notesClients" : null;

    if (!champNote) {
        return next(new HttpError("Rôle invalide.", 400));
    }

    try {
        const soumission = await SOUMISSIONS.findById(oId);
        if (!soumission) {
            return next(new HttpError("Soumission introuvable.", 404));
        }

        soumission[champNote] = [];
        await soumission.save();

        return res.status(200).json({ message: "Historique supprimé.", soumission });
    } catch (err) {
        console.error("Erreur suppression notes:", err);
        return next(new HttpError("Erreur serveur lors de la suppression des notes.", 500));
    }
};



const deleteNote = async (req, res, next) => {
    const { oId, noteId } = req.params;
    const { role } = req.query;

    const champNote = role === "client" ? "notesClients" :
        role === "employé" ? "notesEmployes" : null;

    if (!champNote) {
        return next(new HttpError("Rôle invalide (client ou employé requis).", 400));
    }

    try {
        const soumission = await SOUMISSIONS.findById(oId);
        if (!soumission) {
            return next(new HttpError("Soumission introuvable.", 404));
        }

        const index = soumission[champNote].findIndex(n => n.id === noteId);
        if (index === -1) {
            return next(new HttpError("Note introuvable.", 404));
        }

        soumission[champNote].splice(index, 1);
        await soumission.save();

        res.status(200).json({ message: "Note supprimée avec succès." });
    } catch (err) {
        console.error(err);
        return next(new HttpError("Erreur lors de la suppression de la note.", 500));
    }
};


// --- EXPORTS ---
exports.getAllSoumissions = getAllSoumissions;
exports.clearNotes = clearNotes;
exports.getSoumissionById = getSoumissionById;
exports.soumissionUser = getAllSoumissionsEmployeur;
exports.recherche = findSoumissionsByEmail;
exports.soumissionList = soumissionList;
exports.addSoumission = addSoumission;
exports.majSoumission = modifierSoumission;
exports.supprimerSoumission = deleteSoumission;
exports.ajouterNote = ajouterNote;
exports.modifierNote = modifierNote;
exports.getNotes = getNotes;
exports.deleteNote = deleteNote;

