// routes/reports.js
const express = require('express');
const router = express.Router();
const DailyReport = require('../models/DailyReport');

// ROUTE : Enregistrer un nouveau rapport de caisse journalier
// POST /api/reports
router.post('/', async (req, res) => {
    try {
        const { 
            kioskName, 
            date,
            moment,
            soldeAM1, 
            soldeAM2, 
            soldePrincipalLibertis, 
            soldeCashoutLibertis, 
            soldeExpress, 
            soldeEspeces, 
            venteSim,
            divers,
            comAM1,
            comAM2,
            comMC,
            note 
        } = req.body;

        // Calcul strict du totalCalcule demandé : somme des 5 montants principaux
        const calculTotal = 
            (Number(soldeAM1) || 0) +
            (Number(soldeAM2) || 0) +
            (Number(soldePrincipalLibertis) || 0) +
            (Number(soldeCashoutLibertis) || 0) +
            (Number(soldeExpress) || 0);

        const newReport = new DailyReport({
            kioskName,
            date,
            moment,
            soldeAM1: Number(soldeAM1) || 0,
            soldeAM2: Number(soldeAM2) || 0,
            soldePrincipalLibertis: Number(soldePrincipalLibertis) || 0,
            soldeCashoutLibertis: Number(soldeCashoutLibertis) || 0,
            soldeExpress: Number(soldeExpress) || 0,
            soldeEspeces: Number(soldeEspeces) || 0,
            venteSim: Number(venteSim) || 0,
            divers: Number(divers) || 0,
            comAM1: Number(comAM1) || 0,
            comAM2: Number(comAM2) || 0,
            comMC: Number(comMC) || 0,
            totalCalcule: calculTotal, // Injecté automatiquement par le calcul ci-dessus
            note
        });

        const savedReport = await newReport.save();
        
        // On renvoie le rapport complet enregistré pour affichage immédiat au gérant
        res.status(201).json(savedReport);
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de l'enregistrement du rapport", error: err.message });
    }
});

// ROUTE : Récupérer l'historique complet pour la page Historique d'Akiba
// GET /api/reports
router.get('/', async (req, res) => {
    try {
        const reports = await DailyReport.find().sort({ date: -1 });
        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des données", error: err.message });
    }
});

module.exports = router;