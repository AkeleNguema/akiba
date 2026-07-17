const Kiosk = require('../models/Kiosk');

// Vérifier le code PIN d'un kiosque
exports.verifyPin = async (req, res) => {
  try {
    const { kioskId, pin } = req.body;

    //  Validation rapide des champs
    if (!kioskId || !pin) {
      return res.status(400).json({ 
        success: false, 
        message: 'L\'identifiant du kiosque et le code PIN sont requis.' 
      });
    }

    //  Recherche du kiosque en BDD
    const kiosk = await Kiosk.findOne({ id: kioskId });
    if (!kiosk) {
      return res.status(404).json({ 
        success: false, 
        message: 'Kiosque introuvable.' 
      });
    }

    //  Comparaison du code PIN saisi avec le PIN haché
    const isMatch = await kiosk.comparePin(pin);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Code PIN incorrect.' 
      });
    }

    //  Succès
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