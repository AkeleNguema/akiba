import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    kioskName: '',
    soldeAM: '',
    soldeExpress: '',
    soldeEspeces: '',
    attendu: '',
    note: ''
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      // Connexion directe avec ton API Node/Express sur le port 5000
      const response = await axios.post('http://127.0.0.1:5000/api/reports', {
        kioskName: formData.kioskName,
        soldeAM: Number(formData.soldeAM),
        soldeExpress: Number(formData.soldeExpress),
        soldeEspeces: Number(formData.soldeEspeces),
        attendu: Number(formData.attendu),
        note: formData.note
      });

      setMessage(`✅ Rapport enregistré avec succès ! Écart calculé : ${response.data.ecart} FCFA`);
      // Réinitialiser le formulaire
      setFormData({ kioskName: '', soldeAM: '', soldeExpress: '', soldeEspeces: '', attendu: '', note: '' });
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de se connecter au serveur backend.");
    }
  };

  return (
    <div className="app-container">
      <h1>Saisie Rapport de Caisse — Akiba</h1>
      
      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label>Nom du Kiosque :</label>
          <input 
            type="text" name="kioskName" value={formData.kioskName} 
            onChange={handleChange} required placeholder="Ex: Kiosque Charbonnages"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Solde Airtel Money (FCFA) :</label>
            <input type="number" name="soldeAM" value={formData.soldeAM} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Solde Moov Money / Express (FCFA) :</label>
            <input type="number" name="soldeExpress" value={formData.soldeExpress} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Solde Espèces (FCFA) :</label>
            <input type="number" name="soldeEspeces" value={formData.soldeEspeces} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Montant Attendu Théorique (FCFA) :</label>
            <input type="number" name="attendu" value={formData.attendu} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Note / Commentaire (Optionnel) :</label>
          <textarea name="note" value={formData.note} onChange={handleChange} placeholder="Remarques éventuelles..."></textarea>
        </div>

        <button type="submit" className="submit-btn">Enregistrer la journée</button>
      </form>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}
    </div>
  );
}

export default App;