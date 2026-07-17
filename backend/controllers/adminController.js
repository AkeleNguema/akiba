const Kiosk = require('../models/Kiosk');

// Initialiser les kiosques par défaut (Seed)
exports.seedKiosks = async (req, res) => {
  try {
    // On nettoie d'abord la collection pour éviter les doublons lors des tests
    await Kiosk.deleteMany({});

    // Liste des kiosques d'Akiba à insérer avec leurs codes PIN par défaut
    const defaultKiosks = [
      { 
        id: 'akibacharbonnage', // ✅ Utilisation de "id" pour correspondre au schéma
        name: 'Kiosque Charbonnages', 
        pin: '2025' 
      },
      { 
        id: 'akibaalibandeng',  // ✅ Utilisation de "id" pour correspondre au schéma
        name: 'Kiosque Alibandeng', 
        pin: '0700' 
      },
      { 
        id: 'akibaondogo',      // ✅ Utilisation de "id" pour correspondre au schéma
        name: 'Kiosque Ondogo', 
        pin: '7128' 
      }
    ];

    // Enregistrement en base de données
    const createdKiosks = await Kiosk.create(defaultKiosks);

    res.status(201).json({
      success: true,
      message: 'Les kiosques Akiba ont été initialisés avec succès !',
      data: createdKiosks.map(k => ({ id: k.id, name: k.name })) // ✅ Retourne bien k.id
    });

  } catch (error) {
    console.error("Erreur lors de l'initialisation des kiosques :", error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de l'initialisation des kiosques."
    });
  }
};