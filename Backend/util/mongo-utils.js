const mongoose = require("mongoose");

/**
 * Tente de convertir en ObjectId sinon retourne tel quel (string).
 */
function safeObjectId(value) {
    if (mongoose.Types.ObjectId.isValid(value)) {
        return new mongoose.Types.ObjectId(value);
    }
    return value;
}

module.exports = { safeObjectId };
