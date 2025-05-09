// models/soumission.js
const mongoose = require("mongoose");

const soumissionSchema = new mongoose.Schema({
    adresse: { type: String },
    prenomClient: { type: String },
    nomEmployeur: { type: String },
    email: { type: String, required: true },
    description: { type: String },
    telephone: { type: String },
    employeurId: { type: mongoose.Types.ObjectId, ref: "User" },



    clientId: { type: mongoose.Types.ObjectId, ref: "User" },
    travaux: [{ type: String }],
    date: { type: Date, default: Date.now },
    notesClients: [
        {
            _id: false, // pour éviter que Mongoose crée un _id automatiquement
            id: String, // <-- ajout de cet identifiant
            auteur: String,
            texte: String,
            date: { type: Date, default: Date.now }
        }
    ],
    notesEmployes: [
        {
            _id: false,
            id: String, // ⬅️ ajoute ceci
            auteur: String,
            texte: String,
            date: { type: Date, default: Date.now }
        }
    ]

});

module.exports = mongoose.model("Soumission", soumissionSchema);
