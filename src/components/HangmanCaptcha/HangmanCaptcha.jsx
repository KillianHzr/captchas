import React, { useState, useEffect, useCallback } from 'react';
import ReCaptchaTemplate from '../ReCaptchaTemplate';
import InfoModal from '../InfoModal';
import useCaptchaState from '../../hooks/useCaptchaState';
import './HangmanCaptcha.scss';

const HangmanCaptcha = ({ onValidate, onSkip, onRefresh, onAudio, onInfo }) => {
  const { isDevMode, triggerValidation, AlertComponent, DevModeIndicator } = useCaptchaState(onValidate);
  const [currentWord, setCurrentWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Liste de mots pour le pendu
  const wordList = [
    'COMPUTER', 'KEYBOARD', 'MONITOR', 'INTERNET', 'WEBSITE', 'BROWSER', 'NETWORK',
    'SECURITY', 'PASSWORD', 'DATABASE', 'SOFTWARE', 'HARDWARE', 'DOCUMENT', 'DOWNLOAD',
    'PROGRAMMING', 'ALGORITHM', 'FUNCTION', 'VARIABLE', 'LANGUAGE', 'FRAMEWORK',
    'ELEPHANT', 'GIRAFFE', 'PENGUIN', 'DOLPHIN', 'BUTTERFLY', 'KANGAROO', 'CROCODILE',
    'MOUNTAIN', 'RAINBOW', 'THUNDER', 'LIGHTNING', 'SUNSHINE', 'ADVENTURE', 'TREASURE',
    'GARDEN', 'FLOWER', 'NATURE', 'OCEAN', 'FOREST', 'DESERT', 'VOLCANO', 'ISLAND',
    'GUITAR', 'PIANO', 'VIOLIN', 'TRUMPET', 'SAXOPHONE', 'ORCHESTRA', 'MELODY',
    'KITCHEN', 'BATHROOM', 'BEDROOM', 'GARAGE', 'BALCONY', 'BASEMENT', 'LIBRARY'
  ];

  const maxErrors = 5;


  // Génération d'un nouveau mot
  const generateNewWord = useCallback(() => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setCurrentWord(randomWord);
    setGuessedLetters([]);
    setWrongLetters([]);
    setUserInput('');
    setGameStatus('playing');
  }, []);

  // Initialisation
  useEffect(() => {
    generateNewWord();
  }, [generateNewWord]);

  // Affichage du mot avec lettres devinées
  const getDisplayWord = () => {
    return currentWord
      .split('')
      .map(letter => guessedLetters.includes(letter) ? letter : '_')
      .join(' ');
  };

  // Vérifier si le mot est complètement deviné
  const isWordComplete = () => {
    return currentWord.split('').every(letter => guessedLetters.includes(letter));
  };

  // Gestion de l'input utilisateur
  const handleInputChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    
    // Garder seulement le dernier caractère
    if (value.length > 1) {
      value = value.slice(-1);
    }
    
    setUserInput(value);
  };

  // Gestion de la soumission d'une lettre
  const handleSubmitLetter = () => {
    if (!userInput || gameStatus !== 'playing') return;

    const letter = userInput.toUpperCase();
    
    // Vérifier si la lettre a déjà été essayée
    if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
      setUserInput('');
      return;
    }

    if (currentWord.includes(letter)) {
      // Bonne lettre
      const newGuessedLetters = [...guessedLetters, letter];
      setGuessedLetters(newGuessedLetters);
      
      // Vérifier si le mot est complet
      if (currentWord.split('').every(l => newGuessedLetters.includes(l))) {
        setGameStatus('won');
        triggerValidation(true);
      }
    } else {
      // Mauvaise lettre
      const newWrongLetters = [...wrongLetters, letter];
      setWrongLetters(newWrongLetters);
      
      // Vérifier si trop d'erreurs
      if (newWrongLetters.length >= maxErrors) {
        setGameStatus('lost');
        triggerValidation(false);
      }
    }
    
    setUserInput('');
  };

  // Gestion de la touche Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && userInput) {
      handleSubmitLetter();
    }
  };

  // Gestion du refresh
  const handleRefresh = () => {
    generateNewWord();
    if (onRefresh) onRefresh();
  };

  // Gestion de l'info modal
  const handleInfo = () => {
    setShowInfoModal(true);
    if (onInfo) onInfo();
  };

  // Bouton personnalisé
  const customButton = gameStatus === 'lost' ? (
    <button 
      className="recaptcha-skip-btn"
      onClick={handleRefresh}
    >
      RETRY
    </button>
  ) : (
    <button 
      className={`recaptcha-skip-btn ${!userInput || gameStatus !== 'playing' ? 'disabled' : ''}`}
      onClick={handleSubmitLetter}
      disabled={!userInput || gameStatus !== 'playing'}
    >
      GUESS
    </button>
  );

  return (
    <>
      <ReCaptchaTemplate
        titlePrefix="Guess the"
        titleHighlight="hidden word"
        subtitle="Enter one letter at a time"
        showSkip={false}
        showRefresh={true}
        customButton={customButton}
        onSkip={onSkip}
        onRefresh={handleRefresh}
        onAudio={onAudio}
        onInfo={handleInfo}
      >
        <div className="hangman-captcha">
          {isDevMode && (
            <div className="dev-word">
              <span className="dev-label">Word:</span>
              <span className="dev-text">{currentWord}</span>
            </div>
          )}
          
          <div className="word-display">
            <div className="word-letters">
              {getDisplayWord()}
            </div>
          </div>
          
          <div className="game-info">
            <div className="errors-display">
              <span className="errors-label">Errors:</span>
              <span className="errors-count">{wrongLetters.length}/{maxErrors}</span>
              {wrongLetters.length > 0 && (
                <div className="wrong-letters">
                  {wrongLetters.join(', ')}
                </div>
              )}
            </div>
          </div>
          
          <div className="input-section">
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type letter..."
              className="letter-input"
              disabled={gameStatus !== 'playing'}
            />
          </div>
          
          {gameStatus === 'won' && (
            <div className="game-result success">
              ✓ Word found: {currentWord}
            </div>
          )}
          
          {gameStatus === 'lost' && (
            <div className="game-result failure">
              ✗ Word was: {currentWord}
            </div>
          )}
        </div>
      </ReCaptchaTemplate>
      
      {DevModeIndicator}
      {AlertComponent}
      
      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Hangman Captcha Hint"
      >
        <div className="hangman-hint">
          <p><strong>How to play:</strong></p>
          <ul>
            <li>Guess the hidden word by entering one letter at a time</li>
            <li>Correct letters will reveal their positions</li>
            <li>You have {maxErrors} wrong guesses before the word resets</li>
            <li>Find the complete word to succeed</li>
          </ul>
        </div>
      </InfoModal>
    </>
  );
};

export default HangmanCaptcha;