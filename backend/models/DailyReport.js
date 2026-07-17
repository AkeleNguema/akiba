const mongoose = require('mongoose');

const DailyReportSchema = new mongoose.Schema({
    kiosk: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kiosk',
        required: [true, "La référence du kiosque est obligatoire"]
    },
    kioskName: {
        type: String,
        required: [true, "Le nom du kiosque est obligatoire"],
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    moment: {
        type: String,
        required: true,
        enum: ['Matin', 'Soir'],
        default: 'Soir'
    },
    // Les 6 Flux Financiers pour le calcul du total
    soldeAM1: { type: Number, default: 0 },
    soldeAM2: { type: Number, default: 0 },
    soldePrincipalLibertis: { type: Number, default: 0 },
    soldeCashoutLibertis: { type: Number, default: 0 },
    soldeExpress: { type: Number, default: 0 },
    soldeEspeces: { type: Number, default: 0 },
    
    // Autres flux saisis (exclus du calcul automatique)
    venteSim: { type: Number, default: 0 },
    divers: { type: Number, default: 0 },
    comAM1: { type: Number, default: 0 },
    comAM2: { type: Number, default: 0 },
    comMC: { type: Number, default: 0 },
    
    // Le Total automatique requis
    totalCalcule: { type: Number, default: 0 },
    note: { type: String, trim: true }
}, { timestamps: true });

// ✅ CORRIGÉ : Calcul automatique asynchrone moderne sur les 6 flux
DailyReportSchema.pre('save', async function () {
    this.totalCalcule = 
        (Number(this.soldeAM1) || 0) + 
        (Number(this.soldeAM2) || 0) + 
        (Number(this.soldeEspeces) || 0) +
        (Number(this.soldePrincipalLibertis) || 0) + 
        (Number(this.soldeCashoutLibertis) || 0) + 
        (Number(this.soldeExpress) || 0);
});

module.exports = mongoose.model('DailyReport', DailyReportSchema);