require("dotenv").config(); // si tu utilises un .env

const mongoose = require("mongoose");
const Soumission = require("../models/soumission");

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/tonDB");

        const allSoums = await Soumission.find();

        for (const soum of allSoums) {
            let updated = false;

            soum.notesClients.forEach(note => {
                if (!note.auteurId) {
                    note.auteurId = soum.clientId;
                    updated = true;
                }
            });

            soum.notesEmployes.forEach(note => {
                if (!note.auteurId) {
                    note.auteurId = soum.employeurId || soum.clientId;
                    updated = true;
                }
            });

            if (updated) {
                await soum.save();
                console.log(`Soumission ${soum._id} mise à jour`);
            }
        }

        console.log("✅ Migration des auteurId terminée.");
    } catch (err) {
        console.error("❌ Erreur durant la migration:", err);
    } finally {
        mongoose.connection.close();
    }
})();
