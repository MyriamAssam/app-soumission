const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const usersRoutes = require("./routes/users-routes");
const soumisRoutes = require("./routes/soumis-routes");
const errorHandler = require("./handler/error-handler");

const app = express();
app.use(express.json());

app.use(cors({
  origin: ["https://app-soumission.onrender.com", "https://app-soumission-1.onrender.com"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://app-soumission.onrender.com");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});


app.use(bodyParser.json());




app.use("/soumissions", soumisRoutes);
app.use("/users", usersRoutes);


app.use((req, res, next) => {
  const error = new Error("Route non trouvée");
  error.code = 404;
  next(error);
});


app.use(errorHandler);


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
