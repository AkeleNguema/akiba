import { useState, useRef, useEffect } from 'react';
import './LoginModal.css'; // On va créer ce fichier style juste après !

function LoginModal({ kioskName, onClose, onConfirm }) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Focus automatique sur la première case à l'ouverture
  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  // Gérer la saisie des chiffres
  const handleChange = (index, value) => {
    // On n'accepte que les chiffres
    if (isNaN(value)) return;

    const newPin = [...pin];
    newPin[index] = value.substring(value.length - 1); // Garder uniquement le dernier caractère saisi
    setPin(newPin);
    setError('');

    // Focus automatique sur la case suivante si on a tapé un chiffre
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Gérer la touche "Retour arrière" (Backspace) pour effacer et reculer
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  // Soumission du code PIN
  const handleSubmit = (e) => {
    e.preventDefault();
    const pinString = pin.join('');
    
    if (pinString.length < 4) {
      setError('Veuillez saisir les 4 chiffres de votre code PIN.');
      return;
    }

    onConfirm(pinString);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-pop">
        <button className="modal-close-corner" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <span className="modal-icon">🔐</span>
          <h2>Accès Sécurisé</h2>
          <p className="modal-subtitle">Saisissez le code PIN pour le <strong>{kioskName}</strong></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pin-inputs-container">
            {pin.map((digit, index) => (
              <input
              key={index}
              ref={inputRefs[index]}
              type="password"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="pin-box"
              autoComplete="new-password" /* 🆕 Force le navigateur à ne rien suggérer */
            />
            ))}
          </div>

          {error && <div className="modal-error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-submit">
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;