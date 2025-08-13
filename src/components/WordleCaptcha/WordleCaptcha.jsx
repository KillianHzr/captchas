import React, { useState, useEffect, useCallback } from 'react';
import ReCaptchaTemplate from '../ReCaptchaTemplate';
import InfoModal from '../InfoModal';
import './WordleCaptcha.scss';

const WordleCaptcha = ({ onValidate, onSkip, onRefresh, onAudio, onInfo }) => {
  const [targetWord, setTargetWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [showAlert, setShowAlert] = useState({ show: false, isCorrect: false });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);

  const maxGuesses = 4;
  const wordLength = 4;

  // Liste de mots simples de 4 lettres pour Wordle
  const wordList = [
    'ABLE', 'ACID', 'AGED', 'ALSO', 'AREA', 'ARMY', 'AWAY', 'BABY', 'BACK', 'BALL', 'BAND',
    'BANK', 'BASE', 'BEAT', 'BEEN', 'BELL', 'BEST', 'BIKE', 'BILL', 'BIRD', 'BLOW', 'BLUE',
    'BOAT', 'BODY', 'BONE', 'BOOK', 'BORN', 'BOTH', 'BOWL', 'BULK', 'BURN', 'BUSH', 'BUSY',
    'CAKE', 'CALL', 'CALM', 'CAME', 'CAMP', 'CARD', 'CARE', 'CART', 'CASE', 'CASH', 'CAST',
    'CELL', 'CHAT', 'CHIP', 'CITY', 'CLUB', 'COAL', 'COAT', 'CODE', 'COLD', 'COME', 'COOK',
    'COOL', 'COPE', 'COPY', 'CORD', 'CORN', 'COST', 'CREW', 'CROP', 'DARK', 'DATA', 'DATE',
    'DAWN', 'DAYS', 'DEAD', 'DEAL', 'DEAR', 'DEBT', 'DEEP', 'DESK', 'DIET', 'DISH', 'DOCK',
    'DOES', 'DONE', 'DOOR', 'DOSE', 'DOWN', 'DRAW', 'DREW', 'DROP', 'DRUG', 'DUAL', 'DUCK',
    'DULL', 'DUST', 'DUTY', 'EACH', 'EARN', 'EASE', 'EAST', 'EASY', 'ECHO', 'EDGE', 'ELSE',
    'EMIT', 'EVEN', 'EVER', 'EVIL', 'EXIT', 'FACE', 'FACT', 'FAIL', 'FAIR', 'FALL', 'FARM',
    'FAST', 'FATE', 'FEAR', 'FEED', 'FEEL', 'FEET', 'FELL', 'FELT', 'FILE', 'FILL', 'FILM',
    'FIND', 'FINE', 'FIRE', 'FIRM', 'FISH', 'FIST', 'FIVE', 'FLAG', 'FLAT', 'FLEW', 'FLOW',
    'FOOD', 'FOOT', 'FORD', 'FORM', 'FORT', 'FOUR', 'FREE', 'FROM', 'FUEL', 'FULL', 'FUND',
    'GAIN', 'GAME', 'GATE', 'GAVE', 'GEAR', 'GIFT', 'GIRL', 'GIVE', 'GLAD', 'GOAL', 'GOES',
    'GOLD', 'GOLF', 'GONE', 'GOOD', 'GRAB', 'GRAY', 'GREW', 'GRID', 'GROW', 'GULF', 'HAIR',
    'HALF', 'HALL', 'HAND', 'HANG', 'HARD', 'HARM', 'HATE', 'HAVE', 'HEAD', 'HEAR', 'HEAT',
    'HELD', 'HELL', 'HELP', 'HERE', 'HERO', 'HERS', 'HIDE', 'HIGH', 'HILL', 'HIRE', 'HOLD',
    'HOLE', 'HOME', 'HOPE', 'HOST', 'HOUR', 'HUGE', 'HUNG', 'HUNT', 'HURT', 'IDEA', 'IDLE',
    'INCH', 'INTO', 'IRON', 'ITEM', 'JACK', 'JAIL', 'JANE', 'JAZZ', 'JOIN', 'JOKE', 'JUMP',
    'JUNE', 'JURY', 'JUST', 'KEEN', 'KEEP', 'KEPT', 'KICK', 'KILL', 'KIND', 'KING', 'KNEE',
    'KNEW', 'KNOW', 'LACK', 'LADY', 'LAID', 'LAKE', 'LAND', 'LANE', 'LAST', 'LATE', 'LAWN',
    'LEAD', 'LEAF', 'LEFT', 'LEND', 'LENS', 'LESS', 'LIED', 'LIFE', 'LIFT', 'LIKE', 'LINE',
    'LINK', 'LIST', 'LIVE', 'LOAD', 'LOAN', 'LOCK', 'LONE', 'LONG', 'LOOK', 'LORD', 'LOSE',
    'LOSS', 'LOST', 'LOUD', 'LOVE', 'LUCK', 'MADE', 'MAIL', 'MAIN', 'MAKE', 'MALE', 'MALL',
    'MANY', 'MARK', 'MASS', 'MATE', 'MATH', 'MEAL', 'MEAN', 'MEAT', 'MEET', 'MENU', 'MERE',
    'MESS', 'MICE', 'MILD', 'MILE', 'MILK', 'MIND', 'MINE', 'MISS', 'MODE', 'MOOD', 'MOON',
    'MORE', 'MOST', 'MOVE', 'MUCH', 'MUST', 'NAME', 'NAVY', 'NEAR', 'NECK', 'NEED', 'NEWS',
    'NEXT', 'NICE', 'NINE', 'NODE', 'NONE', 'NOON', 'NORM', 'NOSE', 'NOTE', 'NOUN', 'NULL',
    'ODDS', 'OKAY', 'ONCE', 'ONLY', 'ONTO', 'OPEN', 'ORAL', 'OVER', 'PACE', 'PACK', 'PAGE',
    'PAID', 'PAIN', 'PAIR', 'PALE', 'PALM', 'PARK', 'PART', 'PASS', 'PAST', 'PATH', 'PEAK',
    'PICK', 'PILE', 'PINK', 'PIPE', 'PLAN', 'PLAY', 'PLOT', 'PLUS', 'POEM', 'POET', 'POLL',
    'POOL', 'POOR', 'PORT', 'POST', 'POUR', 'PRAY', 'PULL', 'PURE', 'PUSH', 'QUIT', 'RACE',
    'RAIN', 'RANK', 'RATE', 'READ', 'REAL', 'REAR', 'RELY', 'RENT', 'REST', 'RICE', 'RICH',
    'RIDE', 'RING', 'RISE', 'RISK', 'ROAD', 'ROCK', 'ROLE', 'ROLL', 'ROOF', 'ROOM', 'ROOT',
    'ROPE', 'ROSE', 'RULE', 'RUSH', 'SAFE', 'SAID', 'SAIL', 'SAKE', 'SALE', 'SALT', 'SAME',
    'SAND', 'SAVE', 'SEAT', 'SEED', 'SEEK', 'SEEM', 'SEEN', 'SELF', 'SELL', 'SEND', 'SENT',
    'SHIP', 'SHOP', 'SHOT', 'SHOW', 'SHUT', 'SICK', 'SIDE', 'SIGN', 'SILK', 'SING', 'SINK',
    'SIZE', 'SKIN', 'SLIP', 'SLOW', 'SNAP', 'SNOW', 'SOAP', 'SOFT', 'SOIL', 'SOLD', 'SOLE',
    'SOME', 'SONG', 'SOON', 'SORT', 'SOUL', 'SOUP', 'SPOT', 'STAR', 'STAY', 'STEP', 'STOP',
    'SUCH', 'SUIT', 'SURE', 'SWIM', 'TAKE', 'TALE', 'TALK', 'TALL', 'TANK', 'TAPE', 'TASK',
    'TEAM', 'TEAR', 'TELL', 'TEND', 'TERM', 'TEST', 'TEXT', 'THAN', 'THAT', 'THEM', 'THEN',
    'THEY', 'THIN', 'THIS', 'THUS', 'TIDE', 'TIED', 'TIME', 'TINY', 'TOLD', 'TONE', 'TOOK',
    'TOOL', 'TOPS', 'TORN', 'TOUR', 'TOWN', 'TREE', 'TRIP', 'TRUE', 'TUNE', 'TURN', 'TYPE',
    'UNIT', 'UPON', 'USED', 'USER', 'VARY', 'VAST', 'VIEW', 'VISA', 'VOID', 'VOTE', 'WAGE',
    'WAIT', 'WAKE', 'WALK', 'WALL', 'WANT', 'WARD', 'WARM', 'WARN', 'WASH', 'WAVE', 'WAYS',
    'WEAR', 'WEEK', 'WELL', 'WENT', 'WERE', 'WEST', 'WHAT', 'WHEN', 'WILD', 'WILL', 'WIND',
    'WINE', 'WING', 'WIRE', 'WISE', 'WISH', 'WITH', 'WOLF', 'WOOD', 'WOOL', 'WORD', 'WORE',
    'WORK', 'WORN', 'YARD', 'YEAH', 'YEAR', 'YOUR', 'ZERO', 'ZONE'
  ];

  // Détection du mode dev
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setIsDevMode(urlParams.get('devMode') === 'velvet');
  }, []);

  // Génération d'un nouveau mot
  const generateNewWord = useCallback(() => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setTargetWord(randomWord);
    setCurrentGuess('');
    setGuesses([]);
    setCurrentRow(0);
    setGameStatus('playing');
  }, []);

  // Initialisation
  useEffect(() => {
    generateNewWord();
  }, [generateNewWord]);

  // Fonction pour obtenir la couleur d'une lettre
  const getLetterStatus = (letter, position, word) => {
    if (targetWord[position] === letter) {
      return 'correct'; // Vert - bonne lettre, bonne position
    } else if (targetWord.includes(letter)) {
      return 'present'; // Jaune - bonne lettre, mauvaise position
    } else {
      return 'absent'; // Gris - lettre pas dans le mot
    }
  };

  // Gestion de l'input
  const handleInputChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    
    // Limiter à 4 lettres
    if (value.length > wordLength) {
      value = value.slice(0, wordLength);
    }
    
    setCurrentGuess(value);
  };

  // Soumission d'une tentative
  const handleSubmitGuess = () => {
    if (currentGuess.length !== wordLength || gameStatus !== 'playing') return;

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);

    // Vérifier si c'est le bon mot
    if (currentGuess === targetWord) {
      setGameStatus('won');
      setShowAlert({ show: true, isCorrect: true });
      setTimeout(() => {
        setShowAlert({ show: false, isCorrect: false });
      }, 3000);
      
      if (onValidate) {
        onValidate(true);
      }
    } else if (newGuesses.length >= maxGuesses) {
      // Toutes les tentatives épuisées
      setGameStatus('lost');
      setShowAlert({ show: true, isCorrect: false });
      setTimeout(() => {
        setShowAlert({ show: false, isCorrect: false });
      }, 3000);
      
      if (onValidate) {
        onValidate(false);
      }
    } else {
      // Continuer le jeu
      setCurrentRow(currentRow + 1);
    }

    setCurrentGuess('');
  };

  // Gestion de la touche Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentGuess.length === wordLength) {
      handleSubmitGuess();
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

  // Rendu de la grille
  const renderGrid = () => {
    const grid = [];
    
    for (let row = 0; row < maxGuesses; row++) {
      const rowCells = [];
      const guess = guesses[row] || '';
      const isCurrentRow = row === currentRow && gameStatus === 'playing';
      const displayWord = isCurrentRow ? currentGuess : guess;
      
      for (let col = 0; col < wordLength; col++) {
        const letter = displayWord[col] || '';
        let status = '';
        
        if (guess && row < guesses.length) {
          // Ligne complétée
          status = getLetterStatus(letter, col, guess);
        } else if (isCurrentRow && letter) {
          // Ligne en cours
          status = 'typing';
        }
        
        rowCells.push(
          <div key={`${row}-${col}`} className={`grid-cell ${status}`}>
            {letter}
          </div>
        );
      }
      
      grid.push(
        <div key={row} className="grid-row">
          {rowCells}
        </div>
      );
    }
    
    return grid;
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
      className={`recaptcha-skip-btn ${currentGuess.length !== wordLength || gameStatus !== 'playing' ? 'disabled' : ''}`}
      onClick={handleSubmitGuess}
      disabled={currentGuess.length !== wordLength || gameStatus !== 'playing'}
    >
      SUBMIT
    </button>
  );

  return (
    <>
      <ReCaptchaTemplate
        titlePrefix="Guess the"
        titleHighlight="4-letter word"
        subtitle="You have 4 attempts"
        showSkip={false}
        showRefresh={true}
        customButton={customButton}
        onSkip={onSkip}
        onRefresh={handleRefresh}
        onAudio={onAudio}
        onInfo={handleInfo}
      >
        <div className="wordle-captcha">
          {isDevMode && (
            <div className="dev-word">
              <span className="dev-label">Word:</span>
              <span className="dev-text">{targetWord}</span>
            </div>
          )}
          
          <div className="wordle-grid">
            {renderGrid()}
          </div>
          
          {gameStatus === 'playing' ? (
            <div className="input-section">
              <div className="attempt-counter">
                Attempt {Math.min(currentRow + 1, maxGuesses)}/{maxGuesses}
              </div>
              <input
                type="text"
                value={currentGuess}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type word..."
                className="word-input"
                disabled={gameStatus !== 'playing'}
                maxLength={wordLength}
              />
            </div>
          ) : (
            <div className="input-section">
              {gameStatus === 'won' && (
                <div className="game-result success">
                  ✓ Correct! The word was {targetWord}
                </div>
              )}
              
              {gameStatus === 'lost' && (
                <div className="game-result failure">
                  ✗ The word was: {targetWord}
                </div>
              )}
            </div>
          )}
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
        title="Wordle Captcha Rules"
      >
        <div className="wordle-hint">
          <p><strong>How to play:</strong></p>
          <ul>
            <li>Guess the 4-letter word in 4 attempts</li>
            <li><span className="color-hint correct">Green</span> = correct letter in correct position</li>
            <li><span className="color-hint present">Yellow</span> = correct letter in wrong position</li>
            <li><span className="color-hint absent">Gray</span> = letter not in the word</li>
            <li>Each guess must be a valid 4-letter word</li>
          </ul>
        </div>
      </InfoModal>
    </>
  );
};

export default WordleCaptcha;