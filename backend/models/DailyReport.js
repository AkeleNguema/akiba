const mongoose = require('mongoose');

const DailyReportSchema = new mongoose.Schema({
    kioskName: {
        type: String,
        required: [true, "Le nom du kiosque est obligatoire"],
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    // Les Flux Financiers demandés
    soldeAM: {
        type: Number,
        required: true,
        default: 0
    },
    soldeExpress: {
        type: Number,
        required: true,
        default: 0
    },
    soldeEspeces: {
        type: Number,
        required: true,
        default: 0
    },
    // Calculs de contrôle
    attendu: {
        type: Number,
        required: true
    },
    reel: {
        type: Number,
        required: true
    },
    ecart: {
        type: Number,
        required: true,
        default: 0 // (Reel - Attendu) -> Positif (en plus), Négatif (en moins)
    },
    note: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('DailyReport', DailyReportSchema);