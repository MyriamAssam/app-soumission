const USERS = require("../models/user");
const jwt = require("jsonwebtoken");
const HttpError = require("../util/http-error");
const mongoose = require("mongoose");

// --- GET ALL USERS ---

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await USERS.find();
  } catch (e) {
    return next(
      new HttpError(
        "Échec lors de la récupération des utilisateurs, veuillez réessayer plus tard",
        500
      )
    );
  }
  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};

// --- GET SPECIFIC USER ---
const getUserById = async (req, res, next) => {
  const userId = req.params.userId;

  let user;
  try {
    user = await USERS.findById(userId);
  } catch (e) {
    console.log(e);
    return next(
      new HttpError(
        "Échec lors de la récupération de l'utilisateur, veuillez réessayer plus tard.",
        500
      )
    );
  }

  if (!user) {
    return next(
      new HttpError(`L'utilisateur d'id ${userId} n'a pas été trouvé.`, 404)
    );
  }
  res.json({ user: user.toObject({ getters: true }) });
};

const getUserByUsernameOrId = async (req, res, next) => {
  const username = req.params.chaine;

  let users = [];
  try {
    if (mongoose.isValidObjectId(username)) {
      let user = await USERS.findById(username, "-mdp");
      if (user) {
        users.push(user);
      }
    }

    let userName = await USERS.find({ username: username }, "-mdp");
    if (userName) {
      userName.map((u) => {
        users.push(u);
      });
    }
  } catch (e) {
    console.log(e);
    return next(
      new HttpError(
        "Échec lors de la récupération des utilisateurs, veuillez réessayer plus tard.",
        500
      )
    );
  }

  if (users.length == 0) {
    return next(new HttpError("Aucun utilisateur trouvé.", 404));
  }
  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};

// --- INSCRIPTION ---
const registerUser = async (req, res, next) => {
  const { email, mdp, prenom, adresse, telephone, role, specialite } = req.body;

  const createdUser = new USERS({
    email,
    mdp,
    prenom,
    adresse,
    telephone,
    role,
    specialite: role === "employé" ? specialite : undefined,
  });

  console.log("Utilisateur créé: ", createdUser);

  try {
    await createdUser.save();
  } catch (e) {
    console.log(e);
    return next(
      new HttpError(
        "Échec lors de l'inscription du nouvel utilisateur, veuillez réessayer plus tard",
        500
      )
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: email, role: createdUser.role, specialite: createdUser.specialite },
      "tpsyntheseMelia&Ivan-cours4a5",
      { expiresIn: "24h" }
    );
  } catch (e) {
    console.log(e);
    return next(
      new HttpError("La connexion a échouée, veuillez réessayer plus tard.", 500)
    );
  }

  res.status(201).json({
    user: createdUser.toObject({ getters: true }),
    token: token
  });
};

// --- CONNEXION ---
const login = async (req, res, next) => {
  const { email, mdp, type } = req.body;
  console.log(`Credentials: [${email}][${mdp}][${type}]`);

  let existingUser;
  try {
    existingUser = await USERS.findOne({ email: email });
  } catch (e) {
    console.log(e);
    return next(new HttpError("Échec lors de la validation du courriel.", 500));
  }

  // Vérification des identifiants
  if (!existingUser || existingUser.mdp !== mdp || existingUser.role !== type) {
    return next(
      new HttpError(
        "Connexion échouée, veuillez vérifier vos identifiants.",
        401
      )
    );

  } else {
    // Si les identifiants sont bons
    let token;
    try {
      token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        "tpsyntheseMelia&Ivan-cours4a5",
        { expiresIn: "24h" }
      );
    } catch (e) {
      console.log(e);
      return next(
        new HttpError(
          "La connexion a échouée, veuillez réessayer plus tard.",
          500
        )
      );
    }

    res.status(201).json({
      userId: existingUser.id,
      prenom: existingUser.prenom,
      email: existingUser.email,
      adresse: existingUser.adresse,
      telephone: existingUser.telephone,
      role: existingUser.role,
      specialite: existingUser.specialite,
      token: token,
    });

  }
};

const SOUMISSIONS = require("../models/soumission");

const updateUser = async (req, res, next) => {
  const userId = req.params.userId;
  const updates = req.body;

  try {
    const userMaj = await USERS.findByIdAndUpdate(userId, updates, { new: true });

    if (!userMaj) {
      return next(new HttpError("Utilisateur non trouvé, impossible de faire la mise à jour", 404));
    }

    // 🔁 Mise à jour des soumissions associées
    await SOUMISSIONS.updateMany(
      { clientId: userId },
      {
        $set: {
          prenomClient: userMaj.prenom,
          email: userMaj.email,
          adresse: userMaj.adresse,
          telephone: userMaj.telephone,
        },
      }
    );

    res.status(200).json({ user: userMaj.toObject({ getters: true }) });
  } catch (e) {
    return next(new HttpError("Échec de la maj de l'utilisateur", 500));
  }
};


// --- EXPORTS ---
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.findUser = getUserByUsernameOrId;

exports.register = registerUser;
exports.login = login;

exports.majUser = updateUser;