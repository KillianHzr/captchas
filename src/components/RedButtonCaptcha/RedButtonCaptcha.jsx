import React, { useState, useEffect, useCallback } from 'react';
import ReCaptchaTemplate from '../ReCaptchaTemplate';
import InfoModal from '../InfoModal';
import './RedButtonCaptcha.scss';

const RedButtonCaptcha = ({ onValidate, onSkip, onRefresh, onAudio, onInfo }) => {
  const [showAlert, setShowAlert] = useState({ show: false, isCorrect: false });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [currentColor, setCurrentColor] = useState('red');

  // Liste des couleurs disponibles
  const colors = [
    { name: 'red', display: 'red' },
    { name: 'blue', display: 'blue' },
    { name: 'green', display: 'green' },
    { name: 'yellow', display: 'yellow' },
    { name: 'purple', display: 'purple' },
    { name: 'orange', display: 'orange' },
    { name: 'pink', display: 'pink' },
    { name: 'cyan', display: 'cyan' },
    { name: 'lime', display: 'lime' },
    { name: 'indigo', display: 'indigo' }
  ];

  // Génération d'une couleur aléatoire
  const generateRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    setCurrentColor(colors[randomIndex].name);
  };

  // Détection du mode dev
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setIsDevMode(urlParams.get('devMode') === 'velvet');
  }, []);

  // Initialisation avec une couleur aléatoire
  useEffect(() => {
    generateRandomColor();
  }, []);

  // Gestion du clic sur la zone (solution)
  const handleAreaClick = useCallback((e) => {
    // Vérifier que ce n'est pas le bouton coloré qui a été cliqué
    if (!e.target.closest('.color-nuclear-button')) {
      setShowAlert({ show: true, isCorrect: true });
      setTimeout(() => {
        setShowAlert({ show: false, isCorrect: false });
      }, 3000);
      
      if (onValidate) {
        onValidate(true);
      }
    }
  }, [onValidate]);

  // Gestion du clic sur le bouton coloré (mauvaise réponse)
  const handleColorButtonClick = (e) => {
    e.stopPropagation(); // Empêcher la propagation vers la zone
    setShowAlert({ show: true, isCorrect: false });
    setTimeout(() => {
      setShowAlert({ show: false, isCorrect: false });
    }, 3000);
    
    if (onValidate) {
      onValidate(false);
    }
  };

  // Gestion du refresh
  const handleRefresh = () => {
    generateRandomColor();
    if (onRefresh) onRefresh();
  };

  // Gestion de l'info modal
  const handleInfo = () => {
    setShowInfoModal(true);
    if (onInfo) onInfo();
  };

  // Bouton personnalisé (skip seulement)
  const customButton = (
    <button 
      className="recaptcha-skip-btn"
      onClick={() => {
        console.log('Skip clicked');
        if (onSkip) onSkip();
      }}
    >
      SKIP
    </button>
  );

  // Obtenir la couleur actuelle pour l'affichage
  const currentColorDisplay = colors.find(color => color.name === currentColor)?.display || currentColor;

  return (
    <>
      <ReCaptchaTemplate
        titlePrefix="Do not click on"
        titleHighlight={`the ${currentColorDisplay} button`}
        subtitle=""
        showSkip={false}
        showRefresh={true}
        customButton={customButton}
        onSkip={onSkip}
        onRefresh={handleRefresh}
        onAudio={onAudio}
        onInfo={handleInfo}
      >
        <div className="red-button-captcha" onClick={handleAreaClick}>
          {isDevMode && (
            <div className="dev-hint">
              <span className="hint-text">Solution: Click anywhere in this area except the {currentColorDisplay} button</span>
            </div>
          )}
          
          <div className="captcha-content">
            <button 
              className={`color-nuclear-button ${currentColor}`}
              onClick={handleColorButtonClick}
            >
            </button>
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
        title="Color Button Captcha Hint"
      >
        <div className="red-button-hint">
          <p><strong>Hint:</strong></p>
          <p>Sometimes the instruction tells you exactly what NOT to do. Think about what you should do instead.</p>
        </div>
      </InfoModal>
    </>
  );
};

export default RedButtonCaptcha;