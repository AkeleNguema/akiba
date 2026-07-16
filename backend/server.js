const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const reportRoutes = require('./routes/reports');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);


// Connexion à MongoDB Atlas
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
    .then(() => console.log("Connexion réussie à MongoDB Atlas ! 🍃"))
    .catch(err => console.error("Erreur de connexion à MongoDB :", err));

// Première route de test
app.get('/', (req, res) => {
    res.send("Le serveur d'Akiba est opérationnel, connecté à la base de données et prêt ! 🚀");
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port : ${PORT}`);
});