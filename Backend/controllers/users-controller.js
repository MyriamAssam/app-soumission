const User = require("../models/user");
const Soumission = require("../models/soumission");
const HttpError = require("../util/http-error");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "tpsyntheseMelia&Ivan-cours4a5";

// 🔐 INSCRIPTION
const registerUser = async (req, res, next) => {
  const { email, mdp, prenom, adresse, telephone, role, specialite } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(mdp, 12);
  } catch {
    return next(new HttpError("Erreur hash mot de passe", 500));
  }

  const user = new User({
    email,
    mdp: hashedPassword,
    prenom,
    adresse,
    telephone,
    role,
    specialite: role === "employé" ? specialite : undefined
  });

  try {
    await user.save();
  } catch (e) {
    return next(new HttpError("Inscription échouée", 500));
  }

  let token;
  try {
    token = jwt.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
      specialite: user.specialite
    }, JWT_SECRET, { expiresIn: "24h" });
  } catch {
    return next(new HttpError("Token échoué", 500));
  }

  res.status(201).json({ user: user.toObject({ getters: true }), token });
};

// 🔐 LOGIN
const login = async (req, res, next) => {
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
  } catch {
    return next(new HttpError("Connexion échouée", 500));
  }
};

// 📦 GET ALL
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({ users: users.map(u => u.toObject({ getters: true })) });
  } catch {
    next(new HttpError("Chargement utilisateurs échoué", 500));
  }
};

// 🔎 GET BY ID
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(new HttpError("Utilisateur non trouvé", 404));
    }
    res.json({ user: user.toObject({ getters: true }) });
  } catch {
    next(new HttpError("Erreur récupération utilisateur", 500));
  }
};

// 🔍 GET BY ID or USERNAME
const getUserByUsernameOrId = async (req, res, next) => {
  const input = req.params.chaine;
  let results = [];

  try {
    if (mongoose.isValidObjectId(input)) {
      const user = await User.findById(input, "-mdp");
      if (user) results.push(user);
    }

    const users = await User.find({ username: input }, "-mdp");
    results = results.concat(users);

    if (!results.length) {
      return next(new HttpError("Aucun utilisateur trouvé", 404));
    }

    res.json({ users: results.map(u => u.toObject({ getters: true })) });
  } catch {
    next(new HttpError("Erreur lors de la recherche", 500));
  }
};

// 🔍 EMPLOYÉ PAR SPÉCIALITÉ
const getEmployeBySpecialite = async (req, res, next) => {
  const specialite = req.params.specialite;

  try {
    const employe = await User.findOne({
      role: "employé",
      specialite: { $regex: new RegExp(`^${specialite}$`, "i") }
    });

    if (!employe) {
      return next(new HttpError("Aucun employé pour cette spécialité", 404));
    }

    res.json({ employe: employe.toObject({ getters: true }) });
  } catch {
    next(new HttpError("Erreur lors de la recherche", 500));
  }
};

// ✏️ MISE À JOUR
const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const allowedFields = ["prenom", "adresse", "telephone", "email", "mdp", "specialite"];
  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field]) {
      updates[field] = req.body[field];
    }
  }

  if (updates.mdp) {
    try {
      updates.mdp = await bcrypt.hash(updates.mdp, 12);
    } catch {
      return next(new HttpError("Hash mot de passe échoué", 500));
    }
  }

  try {
    const updated = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!updated) return next(new HttpError("Utilisateur non trouvé", 404));
    res.status(200).json({ user: updated.toObject({ getters: true }) });
  } catch {
    next(new HttpError("Erreur lors de la mise à jour", 500));
  }
};

// 🔁 EXPORTS
exports.register = registerUser;
exports.login = login;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.findUser = getUserByUsernameOrId;
exports.getEmployeBySpecialite = getEmployeBySpecialite;
exports.majUser = updateUser;
