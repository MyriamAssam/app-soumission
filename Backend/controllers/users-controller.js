const User = require("../models/user");
const HttpError = require("../util/http-error");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "tpsyntheseMelia&Ivan-cours4a5";

exports.register = async (req, res, next) => {
  const { email, mdp, prenom, adresse, telephone, role, specialite } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(mdp, 12);
    const user = new User({
      email,
      mdp: hashedPassword,
      prenom,
      adresse,
      telephone,
      role,
      specialite: role === "employé" ? specialite : undefined
    });

    await user.save();

    const token = jwt.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
      specialite: user.specialite
    }, JWT_SECRET, { expiresIn: "24h" });

    res.status(201).json({ user: user.toObject({ getters: true }), token });
  } catch (e) {
    return next(new HttpError("Erreur lors de l'inscription", 500));
  }
};

exports.login = async (req, res, next) => {
  const { email, mdp, type } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return next(new HttpError("Utilisateur introuvable", 401));

    const isValid = await bcrypt.compare(mdp, user.mdp);
    if (!isValid || user.role !== type) {
      return next(new HttpError("Identifiants incorrects", 401));
    }

    const token = jwt.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
      specialite: user.specialite
    }, JWT_SECRET, { expiresIn: "24h" });

    res.status(201).json({
      userId: user.id,
      prenom: user.prenom,
      email: user.email,
      adresse: user.adresse,
      telephone: user.telephone,
      role: user.role,
      specialite: user.specialite,
      token
    });
  } catch (e) {
    return next(new HttpError("Erreur de connexion", 500));
  }
};

exports.getAllUsers = async (_, res, next) => {
  try {
    const users = await User.find();
    res.json({ users: users.map(u => u.toObject({ getters: true })) });
  } catch {
    next(new HttpError("Chargement utilisateurs échoué", 500));
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return next(new HttpError("Utilisateur non trouvé", 404));
    res.json({ user: user.toObject({ getters: true }) });
  } catch {
    next(new HttpError("Erreur récupération utilisateur", 500));
  }
};

exports.getEmployeBySpecialite = async (req, res, next) => {
  try {
    const employe = await User.findOne({
      role: "employé",
      specialite: { $regex: new RegExp(`^${req.params.specialite}$`, "i") }
    });

    if (!employe) return next(new HttpError("Aucun employé pour cette spécialité", 404));
    res.json({ employe: employe.toObject({ getters: true }) });
  } catch {
    next(new HttpError("Erreur lors de la recherche", 500));
  }
};

exports.majUser = async (req, res, next) => {
  const updates = {};
  const allowed = ["prenom", "adresse", "telephone", "email", "mdp", "specialite"];

  for (const field of allowed) {
    if (req.body[field]) updates[field] = req.body[field];
  }

  if (updates.mdp) {
    try {
      updates.mdp = await bcrypt.hash(updates.mdp, 12);
    } catch {
      return next(new HttpError("Erreur de hachage", 500));
    }
  }

  try {
    const updated = await User.findByIdAndUpdate(req.params.userId, updates, { new: true });
    if (!updated) return next(new HttpError("Utilisateur non trouvé", 404));
    res.status(200).json({ user: updated.toObject({ getters: true }) });
  } catch {
    next(new HttpError("Erreur mise à jour", 500));
  }
};


// 🔁 EXPORTS
exports.register = register;
exports.login = login;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.findUser = getUserByUsernameOrId;
exports.getEmployeBySpecialite = getEmployeBySpecialite;
exports.majUser = updateUser;
