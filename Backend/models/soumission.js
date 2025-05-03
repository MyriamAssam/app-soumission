// models/soumission.js
const mongoose = require("mongoose");

const soumissionSchema = new mongoose.Schema({
    adresse: { type: String },
    prenomClient: { type: String },
    nomEmployeur: { type: String },
    email: { type: String, required: true },
    description: { type: String },
    telephone: { type: String },
    employeurId: { type: String, required: true }, // reste string
    clientId: { type: String, required: true },    // reste string
    travaux: [{ type: String }],
    date: { type: Date, default: Date.now },
    notesClients: [
        {
            auteur: String,
            texte: String,
            date: { type: Date, default: Date.now }
        }
    ],
    notesEmployes: [
        {
            auteur: String,
            texte: String,
            date: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model("Soumission", soumissionSchema);
