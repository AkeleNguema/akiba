const DailyReport = require('../models/DailyReport');
const Kiosk = require('../models/Kiosk');

// 1. Créer un nouveau rapport financier lié à un kiosque
exports.createReport = async (req, res) => {
  try {
    const { 
      kioskId, // Reçu depuis le frontend suite à la connexion
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

    // 🛡️ SÉCURITÉ 1 : Vérifier si kioskId est bien fourni par le frontend
    if (!kioskId) {
      return res.status(400).json({ 
        success: false, 
        message: "L'identifiant du kiosque (kioskId) est obligatoire pour enregistrer un rapport." 
      });
    }

    // 🛡️ SÉCURITÉ 2 : Trouver le kiosque dans MongoDB Atlas pour récupérer son _id et son name
    const kiosk = await Kiosk.findOne({ id: kioskId });
    if (!kiosk) {
      return res.status(404).json({ 
        success: false, 
        message: `Kiosque introuvable en base de données pour l'identifiant "${kioskId}".` 
      });
    }

    // Création du rapport avec la liaison forte garantie (kiosk._id et kiosk.name existent forcément ici)
    const newReport = new DailyReport({
      kiosk: kiosk._id,       // Liaison ObjectId
      kioskName: kiosk.name,  // Nom du kiosque garanti d'être renseigné
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
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);

  } catch (error) {
    console.error('Erreur lors de la création du rapport :', error);
    res.status(500).json({ 
      success: false, 
      message: 'Une erreur serveur est survenue lors de l\'enregistrement.' 
    });
  }
};

// 2. Obtenir tous les rapports (Optionnel : filtrés par kiosque)
exports.getReports = async (req, res) => {
  try {
    const { kioskId } = req.query;
    let query = {};

    // Si on demande les rapports d'un kiosque spécifique
    if (kioskId) {
      const kiosk = await Kiosk.findOne({ id: kioskId });
      if (kiosk) {
        query.kiosk = kiosk._id;
      } else {
        // Si l'id envoyé n'existe pas, on force une requête vide pour ne pas mélanger les pinceaux
        query.kiosk = null; 
      }
    }

    const reports = await DailyReport.find(query)
      .sort({ date: -1, createdAt: -1 })
      .populate('kiosk', 'id name'); // Jointure propre pour charger les infos du kiosque lié

    res.status(200).json(reports);
  } catch (error) {
    console.error('Erreur lors de la récupération des rapports :', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la récupération.' 
    });
  }
};