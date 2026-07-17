// ✅ 1. On charge dotenv UNIQUEMENT si on n'est pas en production sur Render
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 

// On importe le modèle Kiosk après l'initialisation de mongoose
const Kiosk = require('./models/Kiosk'); 

// Import des routes
const reportRoutes = require('./routes/reports');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// ✅ 2. On récupère la variable d'environnement système
const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("❌ ERREUR CRITIQUE : La variable MONGO_URI n'est pas définie dans l'environnement !");
    process.exit(1); // Arrête le processus pour éviter les boucles de timeouts
}

// Connexion à MongoDB Atlas et initialisation automatique
mongoose.connect(uri)
    .then(async () => {
        console.log("Connexion réussie à MongoDB Atlas ! 🍃");
        
        // Vérification automatique et réinjection des kiosques si la collection est vide
        try {
            const count = await Kiosk.countDocuments();
            if (count === 0) {
                console.log("🏪 Base de données vide. Initialisation automatique des kiosques...");
                const defaultKiosks = [
                    { id: 'akibacharbonnage', name: 'Kiosque Charbonnages', pin: '2025' }, 
                    { id: 'akibaalibandeng', name: 'Kiosque Alibandeng', pin: '0700' },    
                    { id: 'akibaondogo', name: 'Kiosque Ondogo', pin: '7128' }         
                ];
                await Kiosk.create(defaultKiosks);
                console.log("✅ Les 3 kiosques ont été créés avec succès !");
            } else {
                console.log(`ℹ️ Base de données : ${count} kiosques opérationnels.`);
            }
        } catch (seedError) {
            console.error("Erreur lors de l'initialisation automatique :", seedError);
        }
    })
    .catch(err => console.error("Erreur de connexion à MongoDB :", err));

// Première route de test
app.get('/', (req, res) => {
    res.send("Le serveur d'Akiba est opérationnel, connecté à la base de données et prêt ! 🚀");
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port : ${PORT}`);
});