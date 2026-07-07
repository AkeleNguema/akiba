const express = require('express');
const router = express.Router();
const DailyReport = require('../models/DailyReport');

// ROUTE pour Enregistrer un nouveau rapport de caisse journalier
// POST /api/reports
router.post('/', async (req, res) => {
    try {
        const { kioskName, soldeAM, soldeExpress, soldeEspeces, attendu, note } = req.body;

        // Calcul automatique du réel et de l'écart (Logique métier d'Akiba)
        const reel = Number(soldeAM) + Number(soldeExpress) + Number(soldeEspeces);
        const ecart = reel - Number(attendu);

        const newReport = new DailyReport({
            kioskName,
            soldeAM,
            soldeExpress,
            soldeEspeces,
            attendu,
            reel,
            ecart,
            note
        });

        const savedReport = await newReport.save();
        res.status(201).json(savedReport);
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de l'enregistrement du rapport", error: err.message });
    }
});

// ROUTE pour Récupérer l'historique de tous les rapports
// GET /api/reports
router.get('/', async (req, res) => {
    try {
        const reports = await DailyReport.find().sort({ date: -1 }); // Du plus récent au plus ancien
        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des données", error: err.message });
    }
});

module.exports = router;