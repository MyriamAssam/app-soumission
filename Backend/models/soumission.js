const mongoose = require("mongoose");

const soumissionSchema = new mongoose.Schema({
    adresse: { type: String },
    nomEmployeur: { type: String },
    prenomClient: { type: String },
    email: { type: String, required: true },
    description: { type: String },
    telephone: { type: String },
    employeurId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    clientId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    travaux: [{ type: String }],
    date: { type: Date, default: Date.now },
    notesClients: [{
        auteur: String,
        texte: String,
        date: { type: Date, default: Date.now }
    }],
    notesEmployes: [{
        auteur: String,
        texte: String,
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model("Soumission", soumissionSchema);
