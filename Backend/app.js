const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const usersRoutes = require("./routes/users-routes");
const soumisRoutes = require("./routes/soumis-routes");
const errorHandler = require("./handler/error-handler");

const app = express();
app.use(express.json());

// CORS autorisé uniquement pour ton frontend déployé
app.use(cors({
  origin: "https://app-soumission.onrender.com",
  credentials: true
}));

app.options("*", (req, res) => res.sendStatus(200));

// Routes
app.use("/soumis", soumisRoutes);
app.use("/soumissions", soumisRoutes);
app.use("/users", usersRoutes);

// Gestion des routes non trouvées
app.use((req, res, next) => {
  const error = new Error("Route non trouvée");
  error.code = 404;
  next(error);
});

// Gestion des erreurs
app.use(errorHandler);

// Connexion MongoDB
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGO_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT);
    console.log(`Connexion à la BD [${MONGODB_URI}] sur le port ${PORT} réussie.`);
  })
  .catch((e) => {
    console.log(`Connexion à la BD [${MONGODB_URI}] sur le port ${PORT} échouée.`);
    console.log(e);
  });
