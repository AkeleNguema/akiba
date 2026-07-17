import { useState, useEffect } from 'react';
import axios from 'axios';
import KioskCard from './components/KioskCard';
import LoginModal from './components/LoginModal'; 
import './App.css';

function App() {
  const kiosksData = [
    { id: 'akibacharbonnage', name: 'Kiosque Charbonnages' },
    { id: 'akibaalibandeng', name: 'Kiosque Alibandeng' },
    { id: 'akibaondogo', name: 'Kiosque Ondogo' }
  ];

  const [kioskConnecte, setKioskConnecte] = useState(null); 
  const [kioskConnecteId, setKioskConnecteId] = useState(null); // ID MongoDB unique
  const [kioskIdTechnique, setKioskIdTechnique] = useState(null); // Stocke l'id textuel
  const [kioskEnCoursDeConnexion, setKioskEnCoursDeConnexion] = useState(null); // Stocke le kiosque sélectionné pour le PIN
  const [voirTousLesTickets, setVoirTousLesTickets] = useState(false);
  const [ticketSelectionne, setTicketSelectionne] = useState(null);
  const [historiqueRapports, setHistoriqueRapports] = useState([]);
  const [error, setError] = useState(null);
  const [rapportSauvegarde, setRapportSauvegarde] = useState(null);

  // Initialisation des valeurs financières à 0 pour éviter les bugs de rendu
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    moment: 'Soir',
    soldeAM1: 0, soldeAM2: 0, soldePrincipalLibertis: 0, soldeCashoutLibertis: 0,
    soldeExpress: 0, soldeEspeces: 0, venteSim: 0, divers: 0,
    comAM1: 0, comAM2: 0, comMC: 0, note: ''
  });

  // Récupère l'historique directement avec l'ID unique du kiosque connecté (sans try-catch)
  const chargerHistorique = async () => {
    if (!kioskConnecteId) return;

    const response = await axios.get(`https://akiba-bb4r.onrender.com/api/reports?kioskId=${kioskIdTechnique}`);
    setHistoriqueRapports(response.data);
  };

  useEffect(() => {
    chargerHistorique();
  }, [kioskConnecteId]); // Se déclenche dès que l'ID connecté change

  // Gestion de la saisie
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calcul du total synchrone et propre
  const calculerTotal = () => {
    const am1 = Number(formData.soldeAM1) || 0;
    const am2 = Number(formData.soldeAM2) || 0;
    const especes = Number(formData.soldeEspeces) || 0;
    const libPrincipal = Number(formData.soldePrincipalLibertis) || 0;
    const libCashout = Number(formData.soldeCashoutLibertis) || 0;
    const express = Number(formData.soldeExpress) || 0;

    return (am1 + am2 + especes + libPrincipal + libCashout + express).toLocaleString('fr-FR') + " FCFA";
  };

  // Clic sur une carte : on ouvre d'abord le pop-up en stockant le kiosque cible
  const handleSelectKiosk = (name, id) => {
    setKioskEnCoursDeConnexion({ name, id });
  };

  // Soumission du code PIN en direct avec le Backend (sans try-catch)
  const handlePinSubmit = async (pinEntered) => {
    setError(null);

    const response = await axios.post('https://akiba-bb4r.onrender.com/api/auth/verify-pin', {
      kioskId: kioskEnCoursDeConnexion.id,
      pin: pinEntered
    });

    if (response.data.success) {
      setKioskConnecte(response.data.kiosk.name);
      setKioskConnecteId(response.data.kiosk._id); // Vrai _id MongoDB
      setKioskIdTechnique(response.data.kiosk.id); // Sauvegarde de l'id technique
      setKioskEnCoursDeConnexion(null);
    }
  };

  // Soumission du formulaire de rapport (sans try-catch)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setRapportSauvegarde(null);
    setError(null);

    const response = await axios.post('https://akiba-bb4r.onrender.com/api/reports', {
      kioskId: kioskIdTechnique,
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
    if (voirTousLesTickets) setTicketSelectionne(response.data);
    chargerHistorique();
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      moment: 'Soir',
      soldeAM1: 0, soldeAM2: 0, soldePrincipalLibertis: 0, soldeCashoutLibertis: 0,
      soldeExpress: 0, soldeEspeces: 0, venteSim: 0, divers: 0,
      comAM1: 0, comAM2: 0, comMC: 0, note: ''
    });
  };

  return (
    <div className="app-container">
      
      {/* ÉCRAN D'ACCUEIL : SÉLECTION DU KIOSQUE */}
      {!kioskConnecte ? (
        <div className="home-screen">
          <div className="welcome-header">
            <h1>AKIBA</h1>
            <p>Gestion de Caisse Terrains — Libreville</p>
          </div>
          <h2 className="home-subtitle">Sélectionnez votre Kiosque :</h2>
          <div className="kiosks-grid">
            {kiosksData.map(kiosk => (
              <KioskCard 
                key={kiosk.id} 
                name={kiosk.name} 
                id={kiosk.id} 
                onSelect={handleSelectKiosk} 
              />
            ))}
          </div>
        </div>
      ) : (
        
        /* ÉCRAN DE TRAVAIL (FORMULAIRE & TICKETS) */
        <>
          <div className="header-akiba">
            <div className="brand-zone">
              <h1>Akiba</h1>
              <button 
                className="logout-btn" 
                onClick={() => { 
                  setKioskConnecte(null); 
                  setKioskConnecteId(null); 
                  setKioskIdTechnique(null); 
                }}
              >
                ◀ Changer de kiosque
              </button>
            </div>
            <button 
              className={`kiosk-account-btn ${voirTousLesTickets ? 'active' : ''}`}
              onClick={() => {
                setVoirTousLesTickets(!voirTousLesTickets);
                setTicketSelectionne(null);
              }}
            >
              📁 Compte du Kiosque
            </button>
          </div>
          
          <div className="welcome-kiosk-bar">
            <span>🏪 Espace connecté :</span> <strong>{kioskConnecte}</strong>
          </div>

          {error && <div className="alert error">{error}</div>}

          {voirTousLesTickets ? (
            <div className="kiosk-panel-container">
              <div className="panel-header">
                <h2>📜 Liste de tous les tickets créés</h2>
                <button className="close-panel-btn" onClick={() => setVoirTousLesTickets(false)}>✕ Fermer</button>
              </div>
              <div className="panel-body">
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
                <div className="ticket-view-display">
                  {ticketSelectionne ? (
                    <div className="receipt-ticket">
                      <div className="receipt-header">
                        <h3>🧾 REÇU DE CAISSE AKIBA</h3>
                        <p className="receipt-kiosk">{ticketSelectionne.kioskName}</p>
                        <p className="receipt-meta">
                          <span>Date : {new Date(ticketSelectionne.date).toLocaleDateString('fr-FR')}</span>
                          <span>Moment : {ticketSelectionne.moment}</span>
                        </p>
                      </div>
                      <div className="receipt-divider"></div>
                      <div className="receipt-section">
                        <h4>📱 FLUX AIRTEL MONEY</h4>
                        <div className="receipt-row"><span>Solde AM1 :</span> <span>{ticketSelectionne.soldeAM1?.toLocaleString('fr-FR')} FCFA</span></div>
                        <div className="receipt-row"><span>Solde AM2 :</span> <span>{ticketSelectionne.soldeAM2?.toLocaleString('fr-FR')} FCFA</span></div>
                      </div>
                      <div className="receipt-section">
                        <h4>📞 FLUX LIBERTIS</h4>
                        <div className="receipt-row"><span>Solde Principal :</span> <span>{ticketSelectionne.soldePrincipalLibertis?.toLocaleString('fr-FR')} FCFA</span></div>
                        <div className="receipt-row"><span>Solde Cashout :</span> <span>{ticketSelectionne.soldeCashoutLibertis?.toLocaleString('fr-FR')} FCFA</span></div>
                      </div>
                      <div className="receipt-section">
                        <h4>💵 ESPÈCES & EXPRESS</h4>
                        <div className="receipt-row"><span>Solde Espèces :</span> <span>{ticketSelectionne.soldeEspeces?.toLocaleString('fr-FR')} FCFA</span></div>
                        <div className="receipt-row"><span>Solde Express :</span> <span>{ticketSelectionne.soldeExpress?.toLocaleString('fr-FR')} FCFA</span></div>
                      </div>
                      <div className="receipt-section">
                        <h4>💰 COMMISSIONS</h4>
                        <div className="receipt-row"><span>Com AM1 :</span> <span>{ticketSelectionne.comAM1?.toLocaleString('fr-FR')} FCFA</span></div>
                        <div className="receipt-row"><span>Com AM2 :</span> <span>{ticketSelectionne.comAM2?.toLocaleString('fr-FR')} FCFA</span></div>
                        <div className="receipt-row"><span>Com MC :</span> <span>{ticketSelectionne.comMC?.toLocaleString('fr-FR')} FCFA</span></div>
                      </div>
                      <div className="receipt-section">
                        <h4>📦 AUTRES FLUX</h4>
                        <div className="receipt-row"><span>Divers :</span> <span>{ticketSelectionne.divers?.toLocaleString('fr-FR')} FCFA</span></div>
                        <div className="receipt-row"><span>Vente SIM :</span> <span>{ticketSelectionne.venteSim?.toLocaleString('fr-FR')} FCFA</span></div>
                      </div>
                      {ticketSelectionne.note && (
                        <div className="receipt-section">
                          <h4>📝 NOTE</h4>
                          <p style={{ fontStyle: 'italic', color: '#555', whiteSpace: 'pre-line' }}>{ticketSelectionne.note}</p>
                        </div>
                      )}
                      <div className="receipt-divider"></div>
                      <div className="receipt-footer">
                        <div className="receipt-total-row"><span>TOTAL :</span> <strong>{ticketSelectionne.totalCalcule?.toLocaleString('fr-FR')} FCFA</strong></div>
                      </div>
                    </div>
                  ) : (
                    <div className="select-prompt-box">👈 Sélectionnez un ticket pour afficher son reçu.</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
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
                <div className="form-group"><label>Solde AM1 :</label><input type="number" name="soldeAM1" value={formData.soldeAM1 === 0 ? '' : formData.soldeAM1} onChange={handleChange} /></div>
                <div className="form-group"><label>Solde AM2 :</label><input type="number" name="soldeAM2" value={formData.soldeAM2 === 0 ? '' : formData.soldeAM2} onChange={handleChange} /></div>
              </div>
              
              <h3 className="section-title">📞 Détail Libertis</h3>
              <div className="form-row">
                <div className="form-group"><label>Solde Principal :</label><input type="number" name="soldePrincipalLibertis" value={formData.soldePrincipalLibertis === 0 ? '' : formData.soldePrincipalLibertis} onChange={handleChange} /></div>
                <div className="form-group"><label>Solde Cashout :</label><input type="number" name="soldeCashoutLibertis" value={formData.soldeCashoutLibertis === 0 ? '' : formData.soldeCashoutLibertis} onChange={handleChange} /></div>
              </div>
              
              <h3 className="section-title">💵 Espèces & Express</h3>
              <div className="form-row">
                <div className="form-group"><label>Solde Espèces :</label><input type="number" name="soldeEspeces" value={formData.soldeEspeces === 0 ? '' : formData.soldeEspeces} onChange={handleChange} /></div>
                <div className="form-group"><label>Solde Express :</label><input type="number" name="soldeExpress" value={formData.soldeExpress === 0 ? '' : formData.soldeExpress} onChange={handleChange} /></div>
              </div>
              
              <h3 className="section-title">💰 Commissions</h3>
              <div className="form-row">
                <div className="form-group"><label>Com AM1 :</label><input type="number" name="comAM1" value={formData.comAM1 === 0 ? '' : formData.comAM1} onChange={handleChange} /></div>
                <div className="form-group"><label>Com AM2 :</label><input type="number" name="comAM2" value={formData.comAM2 === 0 ? '' : formData.comAM2} onChange={handleChange} /></div>
                <div className="form-group"><label>Com MC :</label><input type="number" name="comMC" value={formData.comMC === 0 ? '' : formData.comMC} onChange={handleChange} /></div>
              </div>
              
              <h3 className="section-title">📦 Autres Flux</h3>
              <div className="form-row">
                <div className="form-group"><label>Divers :</label><input type="number" name="divers" value={formData.divers === 0 ? '' : formData.divers} onChange={handleChange} /></div>
                <div className="form-group"><label>Vente SIM :</label><input type="number" name="venteSim" value={formData.venteSim === 0 ? '' : formData.venteSim} onChange={handleChange} /></div>
              </div>

              <h3 className="section-title">📝 Note / Observation</h3>
              <div className="form-row">
                <div className="form-group" style={{ width: '100%' }}>
                  <label>Commentaire additionnel :</label>
                  <textarea 
                    name="note" 
                    value={formData.note} 
                    onChange={handleChange} 
                    placeholder="Saisissez des remarques ou des observations sur la journée..." 
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* ✅ AFFICHAGE SÉCURISÉ CONTRE LES TRADUCTEURS DE NAVIGATEUR */}
              <div className="total-box">
                <span>Total Principal Calculé :</span>
                <strong className="notranslate" translate="no">
                  {calculerTotal()}
                </strong>
              </div>
              <button type="submit" className="submit-btn">Enregistrer la journée</button>
            </form>
          )}
        </>
      )}

      {/* Rendu du LoginModal s'il y a un kiosque en cours de connexion */}
      {kioskEnCoursDeConnexion && (
        <LoginModal
          kioskName={kioskEnCoursDeConnexion.name}
          onClose={() => setKioskEnCoursDeConnexion(null)}
          onConfirm={handlePinSubmit}
        />
      )}

    </div>
  );
}

export default App;