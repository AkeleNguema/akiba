
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController'); // 👈 Import de ton contrôleur !

// ROUTE : Enregistrer un nouveau rapport de caisse journalier
// POST /api/reports
router.post('/', reportController.createReport); // ✅ Utilise désormais la logique parfaite du contrôleur

// ROUTE : Récupérer l'historique (filtré ou non par kiosque)
// GET /api/reports
router.get('/', reportController.getReports); // ✅ Utilise désormais getReports avec filtrage intelligent !

module.exports = router;