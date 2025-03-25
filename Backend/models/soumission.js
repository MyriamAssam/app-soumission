const mongoose = require("mongoose");
const soumissionSchema = new mongoose.Schema({
    adresse: { type: String, required: false },
    nomEmployeur: { type: String, required: false },
    email: { type: String, required: true },
    description: { type: Number, required: false },
    telephone: { type: String, required: false },
    employeurId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    notes: { type: String, default: "" },
    travaux: [{ type: String }]
});

module.exports = mongoose.model("Soumission", soumissionSchema);