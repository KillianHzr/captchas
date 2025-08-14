import React, { useState, useEffect, useCallback } from 'react';
import ReCaptchaTemplate from '../ReCaptchaTemplate';
import InfoModal from '../InfoModal';
import './CardGameCaptcha.scss';

const CardGameCaptcha = ({ onValidate, onSkip, onRefresh, onAudio, onInfo }) => {
  const [gameState, setGameState] = useState('ready'); // 'ready', 'memorizing', 'shuffling', 'playing', 'won'
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAlert, setShowAlert] = useState({ show: false, isCorrect: false });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [memoryTimer, setMemoryTimer] = useState(3);
  const [targetSymbol, setTargetSymbol] = useState('');

  // Symboles disponibles pour les cartes
  const symbols = ['♠', '♥', '♦', '♣', '★', '♪', '♫', '☀', '☽'];

  // Détection du mode dev
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setIsDevMode(urlParams.get('devMode') === 'velvet');
  }, []);

  // Génération des cartes initiales
  const generateCards = useCallback(() => {
    const shuffledSymbols = [...symbols].sort(() => Math.random() - 0.5);
    const targetSymbol = shuffledSymbols[Math.floor(Math.random() * 9)];
    setTargetSymbol(targetSymbol);
    
    // Positions exactes selon le HTML fourni
    const newCards = shuffledSymbols.map((symbol, index) => ({
      id: index,
      symbol,
      isRevealed: false, // Cartes retournées de base
      x: (index % 3) * 140, // Positions: 0%, 140%, 280%
      y: Math.floor(index / 3) * 140, // Positions: 0%, 140%, 280%
      originalX: (index % 3) * 140,
      originalY: Math.floor(index / 3) * 140
    }));
    
    setCards(newCards);
    setGameState('ready');
    setSelectedCard(null);
    setMemoryTimer(3);
  }, []);

  // Initialisation
  useEffect(() => {
    generateCards();
  }, [generateCards]);

  // Démarrage du jeu
  const handleStart = () => {
    setGameState('memorizing');
    
    // Révéler les cartes immédiatement
    setCards(prev => prev.map(card => ({ ...card, isRevealed: true })));
    
    // Timer de 3 secondes pour mémoriser
    let timer = 3;
    const interval = setInterval(() => {
      timer--;
      setMemoryTimer(timer);
      
      if (timer === 0) {
        clearInterval(interval);
        // Cacher les cartes
        setCards(prev => prev.map(card => ({ ...card, isRevealed: false })));
        // Démarrer le mélange
        setTimeout(() => shuffleCards(), 500);
      }
    }, 1000);
  };

  // Animation de mélange des cartes
  const shuffleCards = () => {
    setGameState('shuffling');
    
    // Phase 1: Toutes les cartes vont au centre
    setCards(prev => prev.map(card => ({
      ...card,
      x: 140, // Centre par rapport aux positions de base (140%)
      y: 140  // Centre par rapport aux positions de base (140%)
    })));
    
    // Phase 2: Après 1 seconde, redistribuer aléatoirement
    setTimeout(() => {
      const shuffledPositions = [];
      for (let i = 0; i < 9; i++) {
        shuffledPositions.push({
          x: (i % 3) * 140, // Positions: 0%, 140%, 280%
          y: Math.floor(i / 3) * 140
        });
      }
      
      // Mélanger les positions
      for (let i = shuffledPositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPositions[i], shuffledPositions[j]] = [shuffledPositions[j], shuffledPositions[i]];
      }
      
      setCards(prev => prev.map((card, index) => ({
        ...card,
        x: shuffledPositions[index].x,
        y: shuffledPositions[index].y,
        // TRUC: Tous les symboles deviennent le symbole cible
        symbol: targetSymbol
      })));
      
      // Après l'animation, permettre les clics
      setTimeout(() => {
        setGameState('playing');
      }, 1000);
    }, 1000);
  };

  // Gestion du clic sur une carte
  const handleCardClick = (cardId) => {
    if (gameState !== 'playing' || selectedCard !== null) return;
    
    setSelectedCard(cardId);
    
    // Révéler la carte cliquée
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isRevealed: true } : card
    ));
    
    // Succès automatique puisque toutes les cartes ont le bon symbole
    setTimeout(() => {
      setGameState('won');
      setShowAlert({ show: true, isCorrect: true });
      setTimeout(() => {
        setShowAlert({ show: false, isCorrect: false });
      }, 3000);
    }, 1000);
    
    // Appeler onValidate immédiatement comme les autres captchas
    if (onValidate) {
      onValidate(true);
    }
  };

  // Gestion du refresh
  const handleRefresh = () => {
    generateCards();
    if (onRefresh) onRefresh();
  };

  // Gestion de l'info modal
  const handleInfo = () => {
    setShowInfoModal(true);
    if (onInfo) onInfo();
  };

  // Bouton personnalisé
  const getCustomButton = () => {
    if (gameState === 'ready') {
      return (
        <button className="recaptcha-skip-btn" onClick={handleStart}>
          START
        </button>
      );
    } else if (gameState === 'memorizing') {
      return (
        <button className="recaptcha-skip-btn disabled">
          {memoryTimer}
        </button>
      );
    } else {
      return (
        <button className="recaptcha-skip-btn disabled">
          PLAYING
        </button>
      );
    }
  };

  return (
    <>
      <ReCaptchaTemplate
        titlePrefix="Memorize the cards, find"
        titleHighlight={`the ${targetSymbol} card`}
        subtitle={gameState === 'ready' ? 'Click START to begin' : 'You have 3 seconds to memorize'}
        showSkip={false}
        showRefresh={true}
        customButton={getCustomButton()}
        onSkip={onSkip}
        onRefresh={handleRefresh}
        onAudio={onAudio}
        onInfo={handleInfo}
      >
        <div className="card-game-captcha">
          {isDevMode && (
            <div className="dev-info">
              <span className="dev-label">Target:</span>
              <span className="dev-text">{targetSymbol}</span>
              <span className="dev-label">State:</span>
              <span className="dev-text">{gameState}</span>
            </div>
          )}
          
          
          <div className="cards-container">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`card ${!card.isRevealed ? 'hidden' : ''} ${selectedCard === card.id ? 'selected' : ''} ${gameState !== 'playing' ? 'disabled' : ''}`}
                style={{
                  '--card-x': `${card.x}%`,
                  '--card-y': `${card.y}%`,
                  transform: `translate(${card.x}%, ${card.y}%)`,
                  transition: gameState === 'shuffling' ? 'transform 1s ease-in-out' : 'transform 0.3s ease'
                }}
                onClick={() => handleCardClick(card.id)}
              >
                <div className="card-inner">
                  <div className="card-face card-front">
                    <span className="card-symbol">{card.symbol}</span>
                  </div>
                  <div className="card-face card-back">
                    <div className="card-pattern"></div>
                  </div>
                </div>
              </div>
            ))}
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
        title="Card Memory Game Rules"
      >
        <div className="card-game-hint">
          <p><strong>How to play:</strong></p>
          <ul>
            <li>Click START to begin the game</li>
            <li>Memorize the target symbol and its position</li>
            <li>After 3 seconds, cards will flip and shuffle</li>
            <li>Click on the card you think has the target symbol</li>
            <li>Trust your memory and make your choice!</li>
          </ul>
        </div>
      </InfoModal>
    </>
  );
};

export default CardGameCaptcha;