// app.js
// app.js
if (process.env.NODE_ENV !== "production") {
  try { require("dotenv").config(); } catch { }
}

const express = require("express");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users-routes");
const soumisRoutes = require("./routes/soumis-routes");
const errorHandler = require("./handler/error-handler");

const app = express();

/* -------------------- CORS -------------------- */
const ALLOWED_HOSTNAMES = new Set([
  "app-soumission.onrender.com", // your Render frontend (HTTPS)
  "localhost",                    // local dev on any port
]);

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || "";
  let allowed = false;

  try {
    const u = new URL(origin);
    allowed =
      (u.protocol === "https:" && ALLOWED_HOSTNAMES.has(u.hostname)) ||
      u.hostname === "localhost"; // http(s)://localhost:*
  } catch (_) {
    allowed = false;
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
  return allowed;
}

// Answer ALL preflights early (200 OK)
app.options("*", (req, res) => {
  const allowed = setCorsHeaders(req, res);
  console.log("Preflight ->", { origin: req.headers.origin, url: req.originalUrl, allowed });
  res.status(200).end();
});

// Normal requests get CORS too
app.use((req, res, next) => { setCorsHeaders(req, res); next(); });

/* -------------------- Parsers -------------------- */
app.use(express.json());

/* -------------------- Health -------------------- */
app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

/* -------------------- Routes -------------------- */
app.use("/soumis", soumisRoutes);
app.use("/soumissions", soumisRoutes);
app.use("/users", usersRoutes);

/* -------------------- 404 + Error Handler -------------------- */
app.use((req, _res, next) => {
  const e = new Error("Route non trouvée");
  e.code = 404;
  next(e);
});
app.use(errorHandler);

/* -------------------- Boot -------------------- */
const PORT = process.env.PORT || 3000;
// Accept either name to avoid typos in cloud env
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("Missing MONGO_URI (or MONGODB_URI) env var.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`HTTP server listening on ${PORT}`);
    });
  })
  .catch((e) => {
    console.error("Mongo connection error:", e);
    process.exit(1);
  });
