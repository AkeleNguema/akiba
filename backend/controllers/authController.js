const Kiosk = require('../models/Kiosk');
const jwt = require('jsonwebtoken');

// Vérifier le code PIN d'un kiosque
exports.verifyPin = async (req, res) => {
  try {
    const { kioskId, pin } = req.body;

    // Validation rapide des champs
    if (!kioskId || !pin) {
      return res.status(400).json({ 
        success: false, 
        message: 'L\'identifiant du kiosque et le code PIN sont requis.' 
      });
    }

    // Recherche du kiosque en BDD
    const kiosk = await Kiosk.findOne({ id: kioskId });
    if (!kiosk) {
      return res.status(404).json({ 
        success: false, 
        message: 'Kiosque introuvable.' 
      });
    }

    // Comparaison du code PIN saisi avec le PIN haché
    const isMatch = await kiosk.comparePin(pin);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Code PIN incorrect.' 
      });
    }

    // Succès
    res.status(200).json({
      success: true,
      message: 'Connexion réussie !',
      kiosk: {
        _id: kiosk._id,
        id: kiosk.id,
        name: kiosk.name
      }
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du PIN :', error);
    res.status(500).json({ 
      success: false, 
      message: 'Une erreur serveur est survenue lors de la connexion.' 
    });
  }
};

// Connexion Administrateur
exports.loginAdmin = async (req, res) => {
  try {
    const { password } = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
    const JWT_SECRET = process.env.JWT_SECRET || "akiba_secret_key_2026";

    if (!password) {
      return res.status(400).json({ 
        success: false, 
        message: "Le mot de passe est requis." 
      });
    }

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ 
        success: false, 
        message: "Mot de passe administrateur incorrect." 
      });
    }

    // Génération du token JWT (valide 24h)
    const token = jwt.sign(
      { role: "admin" }, 
      JWT_SECRET, 
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      message: "Connexion administrateur réussie !",
      token,
      role: "admin"
    });

  } catch (error) {
    console.error("Erreur lors de la connexion admin :", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur serveur lors de la connexion." 
    });
  }
};

// Modification du code PIN d'un kiosque par l'admin
exports.updateKioskPin = async (req, res) => {
  try {
    const { kioskId } = req.params;
    const { newPin } = req.body;

    if (!newPin || newPin.length !== 4) {
      return res.status(400).json({ 
        success: false, 
        message: "Le code PIN doit comporter exactement 4 chiffres." 
      });
    }

    const kiosk = await Kiosk.findOne({ id: kioskId });

    if (!kiosk) {
      return res.status(404).json({ 
        success: false, 
        message: "Kiosque non trouvé." 
      });
    }

    kiosk.pin = newPin;
    await kiosk.save();

    return res.status(200).json({
      success: true,
      message: `Code PIN mis à jour avec succès pour ${kiosk.name} !`,
      kiosk: {
        _id: kiosk._id,
        id: kiosk.id,
        name: kiosk.name
      }
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du PIN :", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur serveur lors de la modification du PIN." 
    });
  }
};