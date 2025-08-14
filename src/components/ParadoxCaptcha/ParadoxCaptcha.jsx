import React, { useState, useEffect } from 'react';
import ReCaptchaTemplate from '../ReCaptchaTemplate';
import InfoModal from '../InfoModal';
import useCaptchaState from '../../hooks/useCaptchaState';
import './ParadoxCaptcha.scss';

const ParadoxCaptcha = ({ onValidate, onSkip, onRefresh, onAudio, onInfo }) => {
  const [isValid, setIsValid] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { isDevMode, triggerValidation, AlertComponent, DevModeIndicator } = useCaptchaState(onValidate);

  // Gestion du clic sur les phrases du paradoxe
  const handleParadoxClick = () => {
    triggerValidation(false);
  };

  // Gestion du clic sur "la phrase vraie" dans la consigne
  const handleTruePhraseClick = () => {
    setIsValid(true);
    triggerValidation(true);
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
      
      {DevModeIndicator}
      
      {AlertComponent}
      
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