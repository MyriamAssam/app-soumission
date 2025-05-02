const jwt = require("jsonwebtoken");
const HttpError = require("../util/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HttpError("Token d'authentification manquant ou invalide.", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, "tpsyntheseMelia&Ivan-cours4a5");

    req.userData = {
      userId: decodedToken.userId,
      role: decodedToken.role,
      specialite: decodedToken.specialite
    };

    next();
  } catch (err) {
    console.log("Erreur vérification JWT:", err);
    return next(new HttpError("Token invalide, veuillez vous reconnecter.", 403));
  }
};
