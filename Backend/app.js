const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const bodyParser = require("body-parser"); // pas nécessaire si tu as express.json()

const usersRoutes = require("./routes/users-routes");
const soumisRoutes = require("./routes/soumis-routes");
const errorHandler = require("./handler/error-handler");

const app = express();

/* ---- CORS AU TOUT DÉBUT ---- */
const allowedOrigins = new Set([
  "https://app-soumission.onrender.com", // ton front Render
  "http://localhost:5173",               // Vite dev
  "http://localhost:3000"                // CRA dev
]);

app.use((req, res, next) => {
  res.header("Vary", "Origin"); // pour les caches/CDN
  next();
});

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // requêtes server-to-server / curl
    return allowedOrigins.has(origin) ? cb(null, true) : cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
}));

// Répondre aux preflights sur toutes les routes
app.options("*", cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    return allowedOrigins.has(origin) ? cb(null, true) : cb(new Error("Not allowed by CORS"));
  },
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

/* ---- PARSERS ---- */
app.use(express.json());
// app.use(bodyParser.json()); // inutile si express.json() est présent

/* ---- ROUTES ---- */
app.use("/soumis", soumisRoutes);
app.use("/soumissions", soumisRoutes);
app.use("/users", usersRoutes);

/* ---- 404 & error handler ---- */
app.use((req, res, next) => {
  const error = new Error("Route non trouvée");
  error.code = 404;
  next(error);
});
app.use(errorHandler);

/* ---- BOOT ---- */
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGO_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT);
    console.log(`DB OK. Port ${PORT}.`);
  })
  .catch((e) => {
    console.log(`DB KO: ${e}`);
  });
