import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('https://akiba-bb4r.onrender.com/api/auth/admin-login', {
        password
      });

      if (response.data.success) {
        // Enregistre l'état de connexion administrateur
        localStorage.setItem('isAdmin', 'true');
        // Redirige vers le tableau de bord
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Erreur lors de la connexion admin :', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Impossible de se connecter au serveur.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '400px', marginTop: '60px' }}>
      <div className="welcome-header">
        <h1>AKIBA</h1>
        <p>Espace Administration</p>
      </div>

      <form onSubmit={handleLogin} className="report-form" style={{ marginTop: '20px' }}>
        {error && <div className="alert error" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="admin-password">Mot de passe Administrateur :</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez le mot de passe"
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? 'Vérification...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;