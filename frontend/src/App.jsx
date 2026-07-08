import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [kioskConnecte, setKioskConnecte] = useState("Kiosque Charbonnages");

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    moment: 'Soir',
    soldeAM1: '',
    soldeAM2: '',
    soldePrincipalLibertis: '',
    soldeCashoutLibertis: '',
    soldeExpress: '',
    soldeEspeces: '',
    venteSim: '',
    divers: '',
    comAM1: '',
    comAM2: '',
    comMC: '',
    note: ''
  });

  const [totalEnDirect, setTotalEnDirect] = useState(0);
  const [rapportSauvegarde, setRapportSauvegarde] = useState(null);
  const [historiqueRapports, setHistoriqueRapports] = useState([]);
  const [error, setError] = useState(null);

  // Événements pour la nouvelle section "Compte du Kiosque"
  const [voirTousLesTickets, setVoirTousLesTickets] = useState(false);
  const [ticketSelectionne, setTicketSelectionne] = useState(null);

  // Charger l'historique depuis MongoDB Atlas
  const chargerHistorique = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/reports');
      const rapportsDuKiosque = response.data.filter(r => r.kioskName === kioskConnecte);
      setHistoriqueRapports(rapportsDuKiosque);
    } catch (err) {
      console.error("Erreur lors du chargement de l'historique :", err);
    }
  };

  useEffect(() => {
    chargerHistorique();
  }, [kioskConnecte]);

  // Calcul du total des 5 flux en direct
  useEffect(() => {
    const am1 = Number(formData.soldeAM1) || 0;
    const am2 = Number(formData.soldeAM2) || 0;
    const libPrincipal = Number(formData.soldePrincipalLibertis) || 0;
    const libCashout = Number(formData.soldeCashoutLibertis) || 0;
    const express = Number(formData.soldeExpress) || 0;

    setTotalEnDirect(am1 + am2 + libPrincipal + libCashout + express);
  }, [formData.soldeAM1, formData.soldeAM2, formData.soldePrincipalLibertis, formData.soldeCashoutLibertis, formData.soldeExpress]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRapportSauvegarde(null);
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/reports', {
        kioskName: kioskConnecte,
        date: formData.date,
        moment: formData.moment,
        soldeAM1: Number(formData.soldeAM1) || 0,
        soldeAM2: Number(formData.soldeAM2) || 0,
        soldePrincipalLibertis: Number(formData.soldePrincipalLibertis) || 0,
        soldeCashoutLibertis: Number(formData.soldeCashoutLibertis) || 0,
        soldeExpress: Number(formData.soldeExpress) || 0,
        soldeEspeces: Number(formData.soldeEspeces) || 0,
        venteSim: Number(formData.venteSim) || 0,
        divers: Number(formData.divers) || 0,
        comAM1: Number(formData.comAM1) || 0,
        comAM2: Number(formData.comAM2) || 0,
        comMC: Number(formData.comMC) || 0,
        note: formData.note
      });

      setRapportSauvegarde(response.data);
      setTicketSelectionne(response.data); // Affiche directement le ticket du rapport venant d'être créé
      chargerHistorique();
      
      setFormData({
        ...formData,
        soldeAM1: '', soldeAM2: '', soldePrincipalLibertis: '', soldeCashoutLibertis: '',
        soldeExpress: '', soldeEspeces: '', venteSim: '', divers: '',
        comAM1: '', comAM2: '', comMC: '', note: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Erreur de connexion.");
    }
  };

  // Fonction pour afficher les détails du ticket au format reçu
  const renderTicketDeCaisse = (ticket) => (
    <div className="receipt-ticket">
      <div className="receipt-header">
        <h3>🧾 REÇU DE CAISSE AKIBA</h3>
        <p className="receipt-kiosk">{ticket.kioskName}</p>
        <p className="receipt-meta">
          <span>Date : {new Date(ticket.date).toLocaleDateString('fr-FR')}</span>
          <span>Moment : {ticket.moment}</span>
        </p>
      </div>
      <div className="receipt-divider"></div>
      <div className="receipt-section">
        <h4>📱 FLUX AIRTEL MONEY</h4>
        <div className="receipt-row"><span>Solde AM1 :</span> <span>{ticket.soldeAM1?.toLocaleString('fr-FR')} FCFA</span></div>
        <div className="receipt-row"><span>Solde AM2 :</span> <span>{ticket.soldeAM2?.toLocaleString('fr-FR')} FCFA</span></div>
      </div>
      <div className="receipt-section">
        <h4>📞 FLUX LIBERTIS</h4>
        <div className="receipt-row"><span>Solde Principal :</span> <span>{ticket.soldePrincipalLibertis?.toLocaleString('fr-FR')} FCFA</span></div>
        <div className="receipt-row"><span>Solde Cashout :</span> <span>{ticket.soldeCashoutLibertis?.toLocaleString('fr-FR')} FCFA</span></div>
      </div>
      <div className="receipt-section">
        <h4>💵 ESPÈCES \& EXPRESS</h4>
        <div className="receipt-row"><span>Solde Espèces :</span> <span>{ticket.soldeEspeces?.toLocaleString('fr-FR')} FCFA</span></div>
        <div className="receipt-row"><span>Solde Express :</span> <span>{ticket.soldeExpress?.toLocaleString('fr-FR')} FCFA</span></div>
      </div>
      <div className="receipt-section">
        <h4>💰 COMMISSIONS</h4>
        <div className="receipt-row"><span>Com AM1 :</span> <span>{ticket.comAM1?.toLocaleString('fr-FR')} FCFA</span></div>
        <div className="receipt-row"><span>Com AM2 :</span> <span>{ticket.comAM2?.toLocaleString('fr-FR')} FCFA</span></div>
        <div className="receipt-row"><span>Com MC :</span> <span>{ticket.comMC?.toLocaleString('fr-FR')} FCFA</span></div>
      </div>
      <div className="receipt-section">
        <h4>📦 AUTRES FLUX</h4>
        <div className="receipt-row"><span>Divers :</span> <span>{ticket.divers?.toLocaleString('fr-FR')} FCFA</span></div>
        <div className="receipt-row"><span>Vente SIM :</span> <span>{ticket.venteSim?.toLocaleString('fr-FR')} FCFA</span></div>
      </div>
      {ticket.note && (
        <div className="receipt-section receipt-note-section">
          <h4>📝 NOTE / COMMENTAIRE</h4>
          <p className="receipt-note-text">{ticket.note}</p>
        </div>
      )}
      <div className="receipt-divider"></div>
      <div className="receipt-footer">
        <div className="receipt-total-row">
          <span>TOTAL CALCULÉ (5 FLUX) :</span>
          <strong>{ticket.totalCalcule?.toLocaleString('fr-FR')} FCFA</strong>
        </div>
        <p className="receipt-sync-msg">🔒 Enregistré de manière sécurisée en base cloud Atlas</p>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <div className="header-akiba">
        <h1>Saisie Rapport de Caisse — Akiba</h1>
        {/* 🏪 ICÔNE COMPTE DU KIOSQUE */}
        <button 
          className={`kiosk-account-btn ${voirTousLesTickets ? 'active' : ''}`}
          onClick={() => {
            setVoirTousLesTickets(!voirTousLesTickets);
            setTicketSelectionne(null); // Réinitialise le focus du ticket
          }}
          title="Compte du Kiosque (Voir les tickets)"
        >
          📁 Compte du Kiosque
        </button>
      </div>
      
      <div className="welcome-kiosk-bar">
        🏪 Bienvenue sur l'espace du <strong>{kioskConnecte}</strong>
      </div>

      {error && <div className="alert error">{error}</div>}

      {/* PANNEAU "COMPTE DU KIOSQUE" (SI L'ICÔNE EST ACTIVÉE) */}
      {voirTousLesTickets ? (
        <div className="kiosk-panel-container">
          <div className="panel-header">
            <h2>📜 Liste de tous les tickets créés</h2>
            <button className="close-panel-btn" onClick={() => setVoirTousLesTickets(false)}>✕ Fermer</button>
          </div>
          
          <div className="panel-body">
            {/* Colonne gauche : Liste des tickets archivés */}
            <div className="tickets-list-sidebar">
              {historiqueRapports.length === 0 ? (
                <p className="no-data-msg">Aucun ticket pour ce kiosque.</p>
              ) : (
                historiqueRapports.map((ticket) => (
                  <div 
                    key={ticket._id} 
                    className={`ticket-item-row ${ticketSelectionne?._id === ticket._id ? 'selected' : ''}`}
                    onClick={() => setTicketSelectionne(ticket)}
                  >
                    <div className="ticket-item-meta">
                      <span className="ticket-item-date">{new Date(ticket.date).toLocaleDateString('fr-FR')}</span>
                      <span className={`badge ${ticket.moment === 'Matin' ? 'badge-matin' : 'badge-soir'}`}>{ticket.moment}</span>
                    </div>
                    <div className="ticket-item-total">{ticket.totalCalcule?.toLocaleString('fr-FR')} FCFA</div>
                  </div>
                ))
              )}
            </div>

            {/* Colonne droite : Visualisation du ticket cliqué au format ticket de caisse */}
            <div className="ticket-view-display">
              {ticketSelectionne ? (
                renderTicketDeCaisse(ticketSelectionne)
              ) : (
                <div className="select-prompt-box">
                  👈 Sélectionnez un ticket dans la liste pour afficher son reçu détaillé.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* FORMULAIRE DE SAISIE TRADITIONNEL (SI PANNEAU FERMÉ) */
        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-row">
            <div className="form-group">
              <label>Date du Rapport :</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Moment de la journée :</label>
              <select name="moment" value={formData.moment} onChange={handleChange} required>
                <option value="Matin">Matin (Ouverture)</option>
                <option value="Soir">Soir (Clôture)</option>
              </select>
            </div>
          </div>

          <h3 className="section-title">📱 Détail Airtel Money</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Solde AM1 (FCFA) :</label>
              <input type="number" name="soldeAM1" value={formData.soldeAM1} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Solde AM2 (FCFA) :</label>
              <input type="number" name="soldeAM2" value={formData.soldeAM2} onChange={handleChange} />
            </div>
          </div>

          <h3 className="section-title">📞 Détail Libertis</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Solde Principal (FCFA) :</label>
              <input type="number" name="soldePrincipalLibertis" value={formData.soldePrincipalLibertis} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Solde Cashout (FCFA) :</label>
              <input type="number" name="soldeCashoutLibertis" value={formData.soldeCashoutLibertis} onChange={handleChange} />
            </div>
          </div>

          <h3 className="section-title">💵 Espèces \& Express</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Solde Espèces (FCFA) :</label>
              <input type="number" name="soldeEspeces" value={formData.soldeEspeces} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Solde Express (FCFA) :</label>
              <input type="number" name="soldeExpress" value={formData.soldeExpress} onChange={handleChange} />
            </div>
          </div>

          <h3 className="section-title">💰 Commissions</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Com AM1 (FCFA) :</label>
              <input type="number" name="comAM1" value={formData.comAM1} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Com AM2 (FCFA) :</label>
              <input type="number" name="comAM2" value={formData.comAM2} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Com MC (FCFA) :</label>
              <input type="number" name="comMC" value={formData.comMC} onChange={handleChange} />
            </div>
          </div>

          <h3 className="section-title">📦 Autres Flux</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Divers (FCFA) :</label>
              <input type="number" name="divers" value={formData.divers} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Vente SIM (FCFA) :</label>
              <input type="number" name="venteSim" value={formData.venteSim} onChange={handleChange} />
            </div>
          </div>

          <div className="total-box">
            <span>Total Principal Calculé (5 Flux) :</span>
            <strong>{totalEnDirect.toLocaleString('fr-FR')} FCFA</strong>
          </div>

          <div className="form-group">
            <label>Note / Commentaire (Optionnel) :</label>
            <textarea name="note" value={formData.note} onChange={handleChange} placeholder="Remarques éventuelles..."></textarea>
          </div>

          <button type="submit" className="submit-btn">Enregistrer la journée</button>
        </form>
      )}

      {/* TICKET INSTANTANÉ APRÈS ENREGISTREMENT (UNIQUEMENT SI LE PANNEAU N'EST PAS DÉJÀ OUVERT) */}
      {!voirTousLesTickets && rapportSauvegarde && (
        <div className="receipt-container">
          {renderTicketDeCaisse(rapportSauvegarde)}
        </div>
      )}
    </div>
  );
}

export default App;