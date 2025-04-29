const jwt = require("jsonwebtoken");
const HttpError = require("../util/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: Bearer TOKEN
    if (!token) {
      throw new Error("Authentification échouée !");
    }
    const decodedToken = jwt.verify(token, "tpsyntheseMelia&Ivan-cours4a5");

    req.userData = { userId: decodedToken.userId, role: decodedToken.role };
    next();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Authentification échouée, veuillez vous reconnecter.", 403);
    return next(error);

  }
};