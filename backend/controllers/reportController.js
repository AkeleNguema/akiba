const DailyReport = require('../models/DailyReport');
const Kiosk = require('../models/Kiosk');

// 1. Créer un nouveau rapport financier lié à un kiosque
exports.createReport = async (req, res) => {
  try {
    const { 
      kioskId, // 🆕 Reçu depuis le frontend suite à la connexion
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

    // 🆕 Trouver le kiosque pour récupérer sa référence unique (_id)
    const kiosk = await Kiosk.findOne({ id: kioskId });
    if (!kiosk) {
      return res.status(404).json({ 
        success: false, 
        message: 'Kiosque introuvable. Impossible d\'enregistrer le rapport.' 
      });
    }

    // Création du rapport avec la liaison forte
    const newReport = new DailyReport({
      kiosk: kiosk._id, // 🆕 ObjectId lié
      kioskName: kiosk.name, // Nom du kiosque
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