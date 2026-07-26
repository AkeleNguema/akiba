const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Route publisues
router.post('/verify-pin', authController.verifyPin);
router.post('/admin-login', authController.loginAdmin);

// Route protégée pour l'admin
router.put('/kiosk/:kioskId/pin', authMiddleware, authController.updateKioskPin);

module.exports = router;