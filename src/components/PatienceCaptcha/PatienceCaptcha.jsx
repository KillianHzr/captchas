import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReCaptchaTemplate from '../ReCaptchaTemplate';
import InfoModal from '../InfoModal';
import './PatienceCaptcha.scss';

const PatienceCaptcha = ({ onValidate, onSkip, onRefresh, onAudio, onInfo }) => {
  const [blurLevel, setBlurLevel] = useState(15); // Niveau de flou initial (15px = 75%)
  const [isDeblurred, setIsDeblurred] = useState(false);
  const [showAlert, setShowAlert] = useState({ show: false, isCorrect: false });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const hiddenMessage = "Wait patiently without moving until this text becomes clear";

  // Détection du mode dev
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setIsDevMode(urlParams.get('devMode') === 'velvet');
  }, []);

  // Démarrer le processus de déflouage
  const startDeblurring = useCallback(() => {
    // Nettoyer l'ancien intervalle s'il existe
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // S'assurer que le blur est à son maximum
    setBlurLevel(15);
    setIsDeblurred(false);
    
    // Démarrer après un petit délai pour s'assurer du reset complet
    setTimeout(() => {
      const start = Date.now();
      startTimeRef.current = start;

      const id = setInterval(() => {
        // Vérifier si cet intervalle est encore valide
        if (intervalRef.current !== id) {
          clearInterval(id);
          return;
        }
        
        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.min(elapsed / 5000, 1); // 5 secondes
        const currentBlur = 15 * (1 - progress);
        
        setBlurLevel(currentBlur);
        
        // Mise à jour du countdown en mode dev
        if (isDevMode) {
          const remainingTime = Math.ceil((5000 - elapsed) / 1000);
          setCountdown(Math.max(0, remainingTime));
        }
        
        if (progress >= 1) {
          clearInterval(id);
          setBlurLevel(0);
          setIsDeblurred(true);
          intervalRef.current = null;
        }
      }, 50);

      intervalRef.current = id;
    }, 50);
  }, [isDevMode]);

  // Arrêter le déflouage et reflouter
  const resetBlur = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setBlurLevel(15);
    setIsDeblurred(false);
    setCountdown(5);
    startTimeRef.current = null;
  }, []);

  // Détection des interactions utilisateur
  const handleUserInteraction = useCallback((e) => {
    // Si le texte est déjà complètement déflouté, ne plus détecter les interactions
    if (isDeblurred) {
      return;
    }
    
    // Vérifier que e.target existe et a la méthode closest
    if (e.target && typeof e.target.closest === 'function') {
      // Ignorer les événements sur les boutons de la toolbar et la modal
      if (e.target.closest('.recaptcha-toolbar') || e.target.closest('.info-modal-overlay')) {
        return;
      }
    }
    
    // Reset et redémarrage automatique
    resetBlur();
    setTimeout(() => {
      startDeblurring();
    }, 200);
  }, [resetBlur, isDeblurred, startDeblurring]);

  // Gestion de la validation
  const handleValidate = () => {
    if (isDeblurred) {
      setShowAlert({ show: true, isCorrect: true });
      setTimeout(() => {
        setShowAlert({ show: false, isCorrect: false });
      }, 3000);
      
      if (onValidate) {
        onValidate(true);
      }
    }
  };

  // Gestion de l'info modal
  const handleInfo = () => {
    setShowInfoModal(true);
    if (onInfo) onInfo();
  };

  // Gestion du refresh
  const handleRefresh = () => {
    resetBlur();
    setTimeout(startDeblurring, 100); // Petit délai pour éviter le conflit
    if (onRefresh) onRefresh();
  };

  // Initialisation et nettoyage
  useEffect(() => {
    startDeblurring();
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startDeblurring]);

  // Event listeners pour détecter les interactions
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'click', 'scroll', 'touchstart', 'touchmove'];
    
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, true);
    });

    // Détection du changement d'onglet
    const handleVisibilityChange = () => {
      if (document.hidden) {
        resetBlur();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction, true);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleUserInteraction, resetBlur]);

  // Bouton personnalisé
  const customButton = (
    <button 
      className={`recaptcha-skip-btn ${!isDeblurred ? 'disabled' : ''}`}
      onClick={handleValidate}
      disabled={!isDeblurred}
    >
      VERIFY
    </button>
  );

  return (
    <>
      <ReCaptchaTemplate
        titlePrefix="Follow the instruction"
        titleHighlight="shown below"
        subtitle=""
        showSkip={false}
        showRefresh={false}
        customButton={customButton}
        onSkip={onSkip}
        onRefresh={handleRefresh}
        onAudio={onAudio}
        onInfo={handleInfo}
      >
        <div className="patience-captcha">
          {isDevMode && (
            <div className="dev-countdown">
              <span className="countdown-label">Countdown:</span>
              <span className="countdown-time">{countdown}s</span>
            </div>
          )}
          
          <div className="blurred-message-container">
            <div 
              className="blurred-message"
              style={{ 
                filter: `blur(${blurLevel}px)`,
                transition: blurLevel === 15 ? 'none' : 'filter 0.05s linear'
              }}
            >
              {hiddenMessage}
            </div>
          </div>
        </div>
      </ReCaptchaTemplate>
      
      {isDevMode && (
        <div className="dev-mode-indicator">
          DEV
        </div>
      )}
      
      {showAlert.show && (
        <div className={`result-alert ${showAlert.isCorrect ? 'correct' : 'incorrect'}`}>
          {showAlert.isCorrect ? '✓ Correct!' : '✗ Wrong!'}
        </div>
      )}
      
      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Patience Captcha Hint"
      >
        <div className="patience-hint">
          <p><strong>Hint:</strong></p>
          <p>Sometimes the best action is no action at all. Let time reveal the answer.</p>
        </div>
      </InfoModal>
    </>
  );
};

export default PatienceCaptcha;