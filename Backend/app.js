// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const usersRoutes = require("./routes/users-routes");
const soumisRoutes = require("./routes/soumis-routes");
const errorHandler = require("./handler/error-handler");

const app = express();

const whitelist = [
  "https://app-soumission.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);               // curl / server-to-server
    if (whitelist.includes(origin)) return cb(null, true);
    return cb(null, false);                            // <- ne pas throw d’erreur
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

// IMPORTANT: CORS en tout premier
app.use((req, res, next) => { res.header("Vary", "Origin"); next(); });
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // gère tous les preflights

// Optionnel: petit log pour debug rapide
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    console.log("Preflight", req.headers.origin, req.originalUrl);
  }
  next();
});

app.use(express.json());

app.use("/soumis", soumisRoutes);
app.use("/soumissions", soumisRoutes);
app.use("/users", usersRoutes);

app.use((req, res, next) => { const e = new Error("Route non trouvée"); e.code = 404; next(e); });
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT))
  .catch(console.error);
