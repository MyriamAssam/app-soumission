// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users-routes");
const soumisRoutes = require("./routes/soumis-routes");
const errorHandler = require("./handler/error-handler");

const app = express();

/* -------------------- CORS -------------------- */
const ALLOWED_HOSTNAMES = new Set([
  "app-soumission.onrender.com", // your Render frontend (HTTPS)
  "localhost",                    // local dev (any port)
]);

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || "";
  let allowed = false;

  try {
    const u = new URL(origin);
    // allow https://app-soumission.onrender.com and http(s)://localhost:*
    allowed =
      (u.protocol === "https:" && ALLOWED_HOSTNAMES.has(u.hostname)) ||
      u.hostname === "localhost";
  } catch (_) {
    allowed = false;
  }

  // Useful to see what the server decides for preflights
  if (req.method === "OPTIONS") {
    console.log("Preflight ->", {
      origin,
      url: req.originalUrl,
      allowed,
    });
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

// Handle ALL preflights first
app.options("*", (req, res) => {
  setCorsHeaders(req, res);
  return res.status(200).end(); // 200 OK, empty body
});

// Set CORS on normal requests too
app.use((req, res, next) => {
  setCorsHeaders(req, res);
  next();
});

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
const MONGO_URI = process.env.MONGO_URI;

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
