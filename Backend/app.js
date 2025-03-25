const express = require("express");
const mongoose = require("mongoose");
const soumisRoutes = require("./routes/soumis-routes");
const usersRoutes = require("./routes/users-routes");

const errorHandler = require("./handler/error-handler");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use("/soumis", soumisRoutes);
app.use("/users", usersRoutes);


app.use((req, res, next) => {
  const error = new Error("Route non trouvée");
  error.code = 404;
  next(error);
});
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
//const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://2265470:i8Fm7j4giBKmbfgm@jobbang-bd.ybvsp.mongodb.net/?retryWrites=true&w=majority&appName=jobbang-bd"

const MONGODB_URI = "mongodb://localhost:27017/RdvDb";


mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT);
    console.log(`Connexion à la BD [${MONGODB_URI}] sur le port ${PORT} réussie.`);
  })
  .catch((e) => {
    console.log(`Connexion à la BD [${MONGODB_URI} sur le port ${PORT} échouée.]`);
    console.log(e);
  });

