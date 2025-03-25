const mongoose = require("mongoose");

const soumissionSchema = new mongoose.Schema({
    adresse: { type: String, required: false },
    nomEmployeur: { type: String },
    PrenomClient: { type: String }, // 👈 Ajouté
    email: { type: String, required: true },
    description: { type: String, required: false }, // 👈 Corrigé
    telephone: { type: String, required: false },
    employeurId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    notes: { type: String, default: "" },
    travaux: [{ type: String }]
});

module.exports = mongoose.model("Soumission", soumissionSchema);
