const express = require("express");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users-routes");
const soumisRoutes = require("./routes/soumis-routes");
const errorHandler = require("./handler/error-handler");

const app = express();

const ALLOWED = new Set([
  "https://app-soumission.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Log utile pour voir l’Origin exact
  if (req.method === "OPTIONS") {
    console.log("Preflight ->", { origin, url: req.originalUrl, allowed: ALLOWED.has(origin) });
  }

  // 🔐 Version robuste : mets true si tu veux restreindre, false si tu veux débloquer pour debug
  const RESTRICT = true;

  // ✅ soit on restreint aux origins connus
  // ✅ soit on reflète n'importe quel origin (DEBUG) pour vérifier que CORS est bien appliqué
  const ok = RESTRICT ? (origin && ALLOWED.has(origin)) : !!origin;

  if (ok) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
    // Echo des headers demandés par le navigateur (plus tolérant que liste fixe)
    res.setHeader(
      "Access-Control-Allow-Headers",
      req.headers["access-control-request-headers"] || "Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
  }

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});


app.use(express.json());

// routes
app.use("/soumis", soumisRoutes);
app.use("/soumissions", soumisRoutes);
app.use("/users", usersRoutes);

// 404 + handler
app.use((req, res, next) => { const e = new Error("Route non trouvée"); e.code = 404; next(e); });
app.use(errorHandler);
