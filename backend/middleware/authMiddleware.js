const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    const token = authHeader.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || "akiba_secret_key_2026";

    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.adminData = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Session expirée ou token invalide.' });
  }
};