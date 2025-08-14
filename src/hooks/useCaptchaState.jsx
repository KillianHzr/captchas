import { useState, useEffect } from 'react';

const useCaptchaState = (onValidate) => {
  const [isDevMode, setIsDevMode] = useState(false);
  const [showAlert, setShowAlert] = useState({ show: false, isCorrect: false });

  // Détection du mode dev
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setIsDevMode(urlParams.get('devMode') === 'velvet');
  }, []);

  // Fonction pour déclencher la validation
  const triggerValidation = (isCorrect) => {
    setShowAlert({ show: true, isCorrect });
    
    // Masquer l'alerte après 3 secondes
    setTimeout(() => {
      setShowAlert({ show: false, isCorrect: false });
    }, 3000);
    
    // Appeler le callback parent
    if (onValidate) {
      onValidate(isCorrect);
    }
  };

  // Composant d'alerte réutilisable
  const AlertComponent = showAlert.show ? (
    <div className={`result-alert ${showAlert.isCorrect ? 'correct' : 'incorrect'}`}>
      {showAlert.isCorrect ? '✓ Correct!' : '✗ Wrong!'}
    </div>
  ) : null;

  // Indicateur de mode dev réutilisable
  const DevModeIndicator = isDevMode ? (
    <div className="dev-mode-indicator">
      DEV
    </div>
  ) : null;

  return {
    isDevMode,
    showAlert,
    triggerValidation,
    AlertComponent,
    DevModeIndicator
  };
};

export default useCaptchaState;