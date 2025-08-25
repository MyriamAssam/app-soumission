const express = require("express");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users-routes");
const soumisRoutes = require("./routes/soumis-routes");
const errorHandler = require("./handler/error-handler");

const app = express();

const ALLOWED_HOSTNAMES = new Set([
  "app-soumission.onrender.com",
  "localhost",          // dev
]);

app.use((req, res, next) => {
  const origin = req.headers.origin || "";
  let allowed = false;

  try {
    const u = new URL(origin);
    // allow https://app-soumission.onrender.com and http(s)://localhost:5173/3000
    allowed =
      (u.protocol === "https:" && ALLOWED_HOSTNAMES.has(u.hostname)) ||
      (u.protocol.startsWith("http") && u.hostname === "localhost");
  } catch (_) {
    allowed = false;
  }

  // DEBUG: see exactly what origin the server receives
  if (req.method === "OPTIONS") {
    console.log("Preflight ->", { origin, url: req.originalUrl, allowed });
  }

  if (allowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
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
