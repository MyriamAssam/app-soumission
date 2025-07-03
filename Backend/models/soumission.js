const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    _id: false,
    id: String,
    auteur: String,
    auteurId: { type: mongoose.Types.ObjectId, ref: "User" }, // ✅ ajoute l'auteurId ici
    texte: String,
    date: { type: Date, default: Date.now },
    role: String
});

const soumissionSchema = new mongoose.Schema({
    adresse: { type: String, required: true },
    prenomClient: { type: String, required: true },
    nomEmployeur: { type: String },
    email: { type: String, required: true },
    description: { type: String, required: true },
    telephone: { type: String, required: true },
    employeurId: { type: mongoose.Types.ObjectId, ref: "User" },
    clientId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    travaux: [{ type: String }],
    date: { type: Date, default: Date.now },
    notesClients: [noteSchema],
    notesEmployes: [noteSchema]
});

module.exports = mongoose.model("Soumission", soumissionSchema);

