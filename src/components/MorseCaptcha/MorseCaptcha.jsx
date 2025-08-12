import React, { useState, useEffect } from 'react';
import ReCaptchaTemplate from '../ReCaptchaTemplate';
import './MorseCaptcha.scss';

const MorseCaptcha = ({ onValidate, onSkip, onRefresh, onAudio, onInfo }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [targetLetterIndex, setTargetLetterIndex] = useState(0);
  const [morseCode, setMorseCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [showAlert, setShowAlert] = useState({ show: false, isCorrect: false });

  // Dictionnaire morse
  const morseDict = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..'
  };

  // Liste de mots de 2 à 5 lettres (alphabet de base uniquement)
  const wordList = [
    'CAT', 'DOG', 'BIRD', 'FISH', 'TREE', 'BOOK', 'CHAIR', 'TABLE', 'PHONE',
    'WATER', 'FIRE', 'LIGHT', 'MUSIC', 'SMILE', 'DANCE', 'HAPPY', 'STONE',
    'BEACH', 'CLOUD', 'RIVER', 'FIELD', 'HOUSE', 'APPLE', 'BREAD', 'CHESS',
    'DRAMA', 'EAGLE', 'FROST', 'GRACE', 'HEART', 'IMAGE', 'JOKE', 'MAGIC',
    'NIGHT', 'OCEAN', 'PEACE', 'QUICK', 'RADIO', 'SPACE', 'TRAIN', 'UNITY',
    'VOICE', 'WHALE', 'YOUTH', 'ZEBRA', 'ART', 'BEE', 'CUP', 'EGG', 'FUN',
    'GEM', 'HAT', 'ICE', 'JAM', 'KEY', 'LAMP', 'MAP', 'NET', 'OWL', 'PEN',
    'QUIZ', 'RING', 'SUN', 'TOY', 'URN', 'VAN', 'WEB', 'BOX', 'YES', 'ZOO'
  ];

  // Conversion texte vers morse
  const textToMorse = (text) => {
    return text.split('').map(char => morseDict[char.toUpperCase()] || '').join(' ');
  };

  // Génération d'un nouveau défi
  const generateChallenge = () => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    const randomIndex = Math.floor(Math.random() * randomWord.length);
    const morse = textToMorse(randomWord);
    
    setCurrentWord(randomWord);
    setTargetLetterIndex(randomIndex);
    setMorseCode(morse);
    setUserInput('');
    setIsValid(false);
  };

  // Détection du mode dev
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setIsDevMode(urlParams.get('devMode') === 'velvet');
  }, []);

  // Initialisation
  useEffect(() => {
    generateChallenge();
  }, []);

  // Gestion de l'input utilisateur
  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    if (value.length <= 1) {
      setUserInput(value);
      const targetLetter = currentWord[targetLetterIndex];
      setIsValid(value === targetLetter);
    }
  };

  // Gestion de la touche Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && userInput) {
      handleValidate();
    }
  };

  // Gestion de la validation
  const handleValidate = () => {
    setShowAlert({ show: true, isCorrect: isValid });
    // Masquer l'alerte après 3 secondes
    setTimeout(() => {
      setShowAlert({ show: false, isCorrect: false });
    }, 3000);
    
    if (onValidate) {
      onValidate(isValid);
    }
  };

  // Gestion du refresh
  const handleRefresh = () => {
    generateChallenge();
    if (onRefresh) onRefresh();
  };

  // Position ordinale
  const getOrdinal = (num) => {
    const ordinals = ['first', 'second', 'third', 'fourth', 'fifth'];
    return ordinals[num] || `${num + 1}th`;
  };

  // Bouton personnalisé pour le template
  const customButton = (
    <button 
      className={`recaptcha-skip-btn ${!userInput ? 'disabled' : ''}`}
      onClick={handleValidate}
      disabled={!userInput}
    >
      VERIFY
    </button>
  );

  return (
    <>
      <ReCaptchaTemplate
        titlePrefix="Type the "
        titlePrefixUnderline={`${getOrdinal(targetLetterIndex)} letter`}
        titlePrefixSuffix=" of the word in"
        titleHighlight="Morse code"
        subtitle="Enter the corresponding letter below"
        showSkip={false}
        customButton={customButton}
        onSkip={onSkip}
        onRefresh={handleRefresh}
        onAudio={onAudio}
        onInfo={onInfo}
      >
        <div className="morse-captcha">
          {isDevMode ? (
            <div className="morse-display">
              <div className="word-display">
                <span className="word-label">Word:</span>
                <span className="word-text">{currentWord}</span>
              </div>
              
              <div className="morse-code-display">
                <span className="morse-label">Morse:</span>
                <span className="morse-text">{morseCode}</span>
              </div>
              
              <div className="target-info">
                Target: <strong>{getOrdinal(targetLetterIndex)} letter</strong> = 
                <strong className="target-letter"> {currentWord[targetLetterIndex]}</strong>
              </div>
            </div>
          ) : (
            <div className="morse-only-display">
              <div className="morse-text-large">{morseCode}</div>
            </div>
          )}
          
          <div className="input-section">
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type letter..."
              className="letter-input"
              maxLength="1"
            />
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
    </>
  );
};

export default MorseCaptcha;