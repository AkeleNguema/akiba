import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreKiosque, setFiltreKiosque] = useState('tous');
  const [filtreDate, setFiltreDate] = useState('');
  const [ticketSelectionne, setTicketSelectionne] = useState(null);

  // État pour la modification du PIN
  const [selectedKioskForPin, setSelectedKioskForPin] = useState('akibacharbonnage');
  const [newPin, setNewPin] = useState('');
  const [pinMessage, setPinMessage] = useState(null);
  const [pinLoading, setPinLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'https://akiba-bb4r.onrender.com';

  const kiosksList = [
    { id: 'akibacharbonnage', name: 'Kiosque Charbonnages' },
    { id: 'akibaalibandeng', name: 'Kiosque Alibandeng' },
    { id: 'akibaondogo', name: 'Kiosque Ondogo' }
  ];

  const chargerTousLesRapports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/api/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRapports(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerTousLesRapports();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Modification du PIN
  const handleUpdatePin = async (e) => {
    e.preventDefault();
    setPinMessage(null);

    if (newPin.length !== 4) {
      setPinMessage({ type: 'error', text: 'Le code PIN doit comporter 4 chiffres.' });
      return;
    }

    try {
      setPinLoading(true);
      const token = localStorage.getItem('adminToken');

      const response = await axios.put(
        `${API_URL}/api/auth/kiosk/${selectedKioskForPin}/pin`,
        { newPin },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPinMessage({ type: 'success', text: response.data.message });
        setNewPin('');
      }
    } catch (error) {
      setPinMessage({
        type: 'error',
        text: error.response?.data?.message || 'Erreur lors de la modification.'
      });
    } finally {
      setPinLoading(false);
    }
  };

  // Filtrage des rapports
  const rapportsFiltres = rapports.filter((r) => {
    const kId = (r.kioskId || '').toLowerCase();
    const kName = (r.kioskName || '').toLowerCase();
    const target = filtreKiosque.toLowerCase();

    const matchKiosk = filtreKiosque === 'tous' || kId === target || kName.includes(target);
    const matchDate = !filtreDate || new Date(r.date).toISOString().split('T')[0] === filtreDate;

    return matchKiosk && matchDate;
  });

  const totalCumule = rapportsFiltres.reduce((sum, r) => sum + (r.totalCalcule || 0), 0);

  // Fonction d'exportation en CSV (Excel)
  const exporterEnCSV = () => {
    if (rapportsFiltres.length === 0) {
      alert("Aucun rapport à exporter.");
      return;
    }

    const enTetes = ["Date", "Kiosque", "Moment", "AM1", "AM2", "Libertis Principal", "Libertis Cashout", "Espèces", "Express", "Com AM1", "Com AM2", "Com MC", "Divers", "Vente SIM", "Total (FCFA)", "Note"];
    
    const lignes = rapportsFiltres.map(r => [
      new Date(r.date).toLocaleDateString('fr-FR'),
      `"${r.kioskName || r.kioskId}"`,
      r.moment || '',
      r.soldeAM1 || 0,
      r.soldeAM2 || 0,
      r.soldePrincipalLibertis || 0,
      r.soldeCashoutLibertis || 0,
      r.soldeEspeces || 0,
      r.soldeExpress || 0,
      r.comAM1 || 0,
      r.comAM2 || 0,
      r.comMC || 0,
      r.divers || 0,
      r.venteSim || 0,
      r.totalCalcule || 0,
      `"${(r.note || '').replace(/"/g, '""')}"`
    ]);

    const contenuCSV = "\uFEFF" + [enTetes.join(";"), ...lignes.map(e => e.join(";"))].join("\n");
    const blob = new Blob([contenuCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `rapports_akiba_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container" style={{ maxWidth: '1100px' }}>
      
      <div className="header-akiba" style={{ marginBottom: '20px' }}>
        <div className="brand-zone">
          <h1>Akiba Admin</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Supervision et gestion</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Déconnexion
        </button>
      </div>

      {/* Bloc Modification de PIN */}
      <div style={{
        background: '#fff',
        border: '1px solid #e0e0e0',
        padding: '15px 20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333' }}>
          🔑 Modification du Code PIN d'un Kiosque
        </h3>
        <form onSubmit={handleUpdatePin} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Kiosque :</label>
            <select
              value={selectedKioskForPin}
              onChange={(e) => setSelectedKioskForPin(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {kiosksList.map((k) => (
                <option key={k.id} value={k.id}>{k.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Nouveau PIN (4 chiffres) :</label>
            <input
              type="password"
              maxLength="4"
              placeholder="Ex: 1234"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc', width: '120px' }}
              required
            />
          </div>

          <div style={{ marginTop: '16px' }}>
            <button
              type="submit"
              disabled={pinLoading}
              style={{
                backgroundColor: '#1976d2',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {pinLoading ? 'Mise à jour...' : 'Enregistrer le nouveau PIN'}
            </button>
          </div>
        </form>

        {pinMessage && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '13px',
            backgroundColor: pinMessage.type === 'success' ? '#e8f5e9' : '#ffebee',
            color: pinMessage.type === 'success' ? '#2e7d32' : '#c62828'
          }}>
            {pinMessage.text}
          </div>
        )}
      </div>

      {/* Bloc Filtres, Export et Total */}
      <div style={{
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Filtrer par Kiosque :</label>
            <select 
              value={filtreKiosque} 
              onChange={(e) => setFiltreKiosque(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="tous">Tous les kiosques</option>
              <option value="charbonnages">Kiosque Charbonnages</option>
              <option value="alibandeng">Kiosque Alibandeng</option>
              <option value="ondogo">Kiosque Ondogo</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Filtrer par Date :</label>
            <input 
              type="date" 
              value={filtreDate} 
              onChange={(e) => setFiltreDate(e.target.value)}
              style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            {filtreDate && (
              <button 
                onClick={() => setFiltreDate('')} 
                style={{ marginLeft: '5px', padding: '7px 10px', cursor: 'pointer' }}
              >
                Réinitialiser
              </button>
            )}
          </div>

          <button
            onClick={exporterEnCSV}
            style={{
              backgroundColor: '#2e7d32',
              color: '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📊 Exporter (Excel / CSV)
          </button>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '13px', color: '#555' }}>
            Total Cumulé ({rapportsFiltres.length} rapport(s)) :
          </span>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2e7d32' }} className="notranslate" translate="no">
            {totalCumule.toLocaleString('fr-FR')} FCFA
          </div>
        </div>
      </div>

      {/* Liste des tickets et Reçu */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px' }}>Chargement des données en cours...</p>
      ) : (
        <div className="kiosk-panel-container" style={{ marginTop: '0' }}>
          <div className="panel-body">
            
            <div className="tickets-list-sidebar">
              {rapportsFiltres.length === 0 ? (
                <p className="no-data-msg">Aucun rapport trouvé pour ces critères.</p>
              ) : (
                rapportsFiltres.map((ticket) => (
                  <div 
                    key={ticket._id} 
                    className={`ticket-item-row ${ticketSelectionne?._id === ticket._id ? 'selected' : ''}`}
                    onClick={() => setTicketSelectionne(ticket)}
                  >
                    <div className="ticket-item-meta">
                      <strong>{ticket.kioskName || ticket.kioskId}</strong>
                      <span className="ticket-item-date">{new Date(ticket.date).toLocaleDateString('fr-FR')}</span>
                      <span className={`badge ${ticket.moment === 'Matin' ? 'badge-matin' : 'badge-soir'}`}>
                        {ticket.moment}
                      </span>
                    </div>
                    <div className="ticket-item-total">
                      {ticket.totalCalcule?.toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="ticket-view-display">
              {ticketSelectionne ? (
                <div className="receipt-ticket">
                  <div className="receipt-header">
                    <h3>🧾 REÇU DE CAISSE AKIBA</h3>
                    <p className="receipt-kiosk">{ticketSelectionne.kioskName || ticketSelectionne.kioskId}</p>
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
                    <div className="receipt-total-row">
                      <span>TOTAL :</span> 
                      <strong>{ticketSelectionne.totalCalcule?.toLocaleString('fr-FR')} FCFA</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="select-prompt-box">👈 Sélectionnez un rapport dans la liste pour consulter ses détails.</div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;