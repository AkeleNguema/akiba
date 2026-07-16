const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route GET : http://localhost:5000/api/admin/seed-kiosks
router.get('/seed-kiosks', adminController.seedKiosks);

module.exports = router;