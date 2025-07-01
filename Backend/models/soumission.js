const mongoose = require("mongoose");

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
    notesClients: [
        {
            _id: false,
            id: String,
            auteur: String,
            texte: String,
            date: { type: Date, default: Date.now },
            role: String // <-- add this line
        }
    ],
    notesEmployes: [
        {
            _id: false,
            id: String,
            auteur: String,
            texte: String,
            date: { type: Date, default: Date.now },
            role: String // <-- add this line
        }
    ]

});

module.exports = mongoose.model("Soumission", soumissionSchema);
