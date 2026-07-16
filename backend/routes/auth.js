const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route POST : http://localhost:5000/api/auth/verify-pin
router.post('/verify-pin', authController.verifyPin);

module.exports = router;