const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    mdp: { type: String, required: true },
    role: { type: String, enum: ["client", "employé"], required: true },
    prenom: { type: String, required: true },
    adresse: { type: String, required: true },
    telephone: { type: String, required: true },
    specialite: { type: String },
});

module.exports = mongoose.model("User", userSchema);