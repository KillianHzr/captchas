import React, { useState, useEffect } from 'react';
import ReCaptchaTemplate from '../ReCaptchaTemplate';
import InfoModal from '../InfoModal';
import './ParadoxCaptcha.scss';

const ParadoxCaptcha = ({ onValidate, onSkip, onRefresh, onAudio, onInfo }) => {
  const [isValid, setIsValid] = useState(false);
  const [showAlert, setShowAlert] = useState({ show: false, isCorrect: false });
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Gestion du clic sur les phrases du paradoxe
  const handleParadoxClick = () => {
    setShowAlert({ show: true, isCorrect: false });
    setTimeout(() => {
      setShowAlert({ show: false, isCorrect: false });
    }, 3000);
    
    if (onValidate) {
      onValidate(false);
    }
  };

  // Gestion du clic sur "la phrase vraie" dans la consigne
  const handleTruePhraseClick = () => {
    setIsValid(true);
    setShowAlert({ show: true, isCorrect: true });
    setTimeout(() => {
      setShowAlert({ show: false, isCorrect: false });
    }, 3000);
    
    if (onValidate) {
      onValidate(true);
    }
  };

  // Gestion de l'info modal
  const handleInfo = () => {
    setShowInfoModal(true);
    if (onInfo) onInfo();
  };

  // Pas de bouton personnalisé, on utilise le SKIP par défaut

  return (
    <>
      <ReCaptchaTemplate
        titlePrefix="Click on"
        titlePrefixUnderline=""
        titleHighlight="the true statement"
        subtitle=""
        showSkip={true}
        showRefresh={false}
        onSkip={onSkip}
        onRefresh={onRefresh}
        onAudio={onAudio}
        onInfo={handleInfo}
        onTruePhraseClick={handleTruePhraseClick}
        makeHighlightClickable={true}
      >
        <div className="paradox-captcha">
          <div className="phrases-container">
            <button 
              className="paradox-phrase"
              onClick={handleParadoxClick}
            >
              "This statement is false."
            </button>
            
            <button 
              className="paradox-phrase"
              onClick={handleParadoxClick}
            >
              "The previous statement is true but this one is false."
            </button>
          </div>
        </div>
      </ReCaptchaTemplate>
      
      {showAlert.show && (
        <div className={`result-alert ${showAlert.isCorrect ? 'correct' : 'incorrect'}`}>
          {showAlert.isCorrect ? '✓ Correct!' : '✗ Wrong!'}
        </div>
      )}
      
      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Paradox Captcha Hint"
      >
        <div className="paradox-hint">
          <p><strong>Hint:</strong></p>
          <p>The answer is in the instruction itself.</p>
        </div>
      </InfoModal>
    </>
  );
};

export default ParadoxCaptcha;