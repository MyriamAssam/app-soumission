const mongoose = require("mongoose");

const soumissionSchema = new mongoose.Schema({
    adresse: { type: String, required: false },
    nomEmployeur: { type: String },
    prenomClient: { type: String, required: false },
    email: { type: String, required: true },
    description: { type: String, required: false },
    telephone: { type: String, required: false },
    employeurId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    notes: { type: String, default: "" },
    clientId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    travaux: [{ type: String }]
});

module.exports = mongoose.model("Soumission", soumissionSchema);
