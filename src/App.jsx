import React, { useState, useEffect, useRef } from 'react'
import MorseCaptcha from './components/MorseCaptcha'
import ParadoxCaptcha from './components/ParadoxCaptcha'
import PatienceCaptcha from './components/PatienceCaptcha'
import RedButtonCaptcha from './components/RedButtonCaptcha'
import HangmanCaptcha from './components/HangmanCaptcha'
import WordleCaptcha from './components/WordleCaptcha'
import CardGameCaptcha from './components/CardGameCaptcha'
import DesktopCleanupCaptcha from './components/DesktopCleanupCaptcha'
import './App.css'

// Ordre des captchas du moins étrange au plus étrange
const CAPTCHA_ORDER = [
  { id: 'wordle', name: 'Wordle', Component: WordleCaptcha, difficulty: 1 },
  { id: 'hangman', name: 'Hangman', Component: HangmanCaptcha, difficulty: 2 },
  { id: 'card', name: 'Card Game', Component: CardGameCaptcha, difficulty: 3 },
  { id: 'morse', name: 'Morse Code', Component: MorseCaptcha, difficulty: 4 },
  { id: 'patience', name: 'Patience', Component: PatienceCaptcha, difficulty: 5 },
  { id: 'desktop', name: 'Desktop Cleanup', Component: DesktopCleanupCaptcha, difficulty: 6 },
  { id: 'redbutton', name: 'Red Button', Component: RedButtonCaptcha, difficulty: 7 },
  { id: 'paradox', name: 'Paradox', Component: ParadoxCaptcha, difficulty: 8 },
]

const formatTime = (ms) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const remainingMs = Math.floor((ms % 1000) / 10)
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${remainingMs.toString().padStart(2, '0')}`
}

// Page d'introduction
function IntroPage({ onStart, bestScore }) {
  return (
    <div className="page intro-page">
      <div className="intro-content">
        <h1 className="intro-title">HUMAN?</h1>
        <p className="intro-subtitle">Identity Check</p>
        
        {bestScore && (
          <div className="best-score-badge">
            <span className="label">Best Performance</span>
            <span className="value">{formatTime(bestScore)}</span>
          </div>
        )}

        <p className="intro-description">
          Please prove your biological origin through a series of standard interactions.
        </p>
        <div className="wtf-meter">
          <div className="wtf-label-container">
            <span className="wtf-label">Organic</span>
            <span className="wtf-label">Synthetic</span>
          </div>
          <div className="wtf-bar">
            {CAPTCHA_ORDER.map((_, i) => (
              <div key={i} className="wtf-segment" style={{ opacity: 0.2 + (i * 0.1) }} />
            ))}
          </div>
        </div>
        <button className="start-button" onClick={onStart}>
          Enter Challenge
        </button>
      </div>
    </div>
  )
}

// Page de captcha individuel
function CaptchaPage({ captcha, currentIndex, total, onSuccess, onRefresh, currentTime }) {
  const { Component, name, difficulty } = captcha

  return (
    <div className="page captcha-page">
      <div className="captcha-sidebar">
        <div className="timer-display">
          <span className="timer-label">Session Duration</span>
          <span className="timer-value">{formatTime(currentTime)}</span>
        </div>

        <div className="progress-info">
          <span className="progress-label">Security Progress</span>
          <div className="progress-bar-container">
            <div
              className="progress-fill"
              style={{ width: `${((currentIndex) / total) * 100}%` }}
            />
          </div>
          <div className="step-counter">
            {currentIndex + 1} <span className="step-total">/ {total}</span>
          </div>
        </div>
        
        <div className="wtf-indicator">
          <span className="wtf-text">Anomaly Level</span>
          <div className="wtf-dots">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className={`wtf-dot ${i < difficulty ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="captcha-main-area">
        <Component
          onValidate={(isCorrect) => {
            if (isCorrect) {
              onSuccess()
            }
          }}
          onRefresh={onRefresh}
          onSkip={() => {}}
          onAudio={() => {}}
          onInfo={() => {}}
        />
      </div>
    </div>
  )
}

// Page finale avec tous les captchas
function FinalPage({ onRestart, finalTime, isNewRecord }) {
  return (
    <div className="page final-page">
      <div className="final-header">
        <h1 className="final-title">Verified</h1>
        <p className="final-subtitle">Identity confirmed in {formatTime(finalTime)}</p>
        {isNewRecord && <div className="new-record-tag">NEW RECORD</div>}
      </div>

      <h2 className="gallery-title">Session History</h2>
      <div className="captcha-gallery">
        {CAPTCHA_ORDER.map((captcha) => (
          <div key={captcha.id} className="gallery-item">
            <div className="gallery-item-header">
              <span className="gallery-item-name">{captcha.name}</span>
              <span className="gallery-item-wtf">
                <span style={{ fontSize: '12px', color: '#64748b', marginRight: '6px' }}>ANOMALY</span>
                {'●'.repeat(captcha.difficulty)}
                <span style={{ opacity: 0.1 }}>{'●'.repeat(8 - captcha.difficulty)}</span>
              </span>
            </div>
            <div className="gallery-captcha">
              <captcha.Component
                onValidate={() => {}}
                onRefresh={() => {}}
                onSkip={() => {}}
                onAudio={() => {}}
                onInfo={() => {}}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="restart-container">
        <button className="restart-button" onClick={onRestart}>
          Re-initialize Protocol
        </button>
      </div>
    </div>
  )
}

function App() {
  const [currentStep, setCurrentStep] = useState(-1) // -1 = intro, 0-7 = captchas, 8 = final
  const [captchaKeys, setCaptchaKeys] = useState(
    CAPTCHA_ORDER.reduce((acc, c) => ({ ...acc, [c.id]: 0 }), {})
  )
  
  // Timer state
  const [time, setTime] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [finalTime, setFinalTime] = useState(0)
  const [bestScore, setBestScore] = useState(null)
  const [isNewRecord, setIsNewRecord] = useState(false)
  const timerRef = useRef(null)

  // Load best score on mount
  useEffect(() => {
    const saved = localStorage.getItem('uncanny-captcha-best-score')
    if (saved) setBestScore(parseInt(saved))
  }, [])

  // Timer logic
  useEffect(() => {
    if (currentStep >= 0 && currentStep < CAPTCHA_ORDER.length) {
      if (!startTime) setStartTime(Date.now())
      
      timerRef.current = setInterval(() => {
        setTime(Date.now() - (startTime || Date.now()))
      }, 50)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [currentStep, startTime])

  const handleStart = () => {
    setTime(0)
    setStartTime(Date.now())
    setIsNewRecord(false)
    setCurrentStep(0)
  }

  const handleSuccess = () => {
    setTimeout(() => {
      if (currentStep < CAPTCHA_ORDER.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        const totalTime = Date.now() - startTime
        setFinalTime(totalTime)
        
        // Update best score
        const savedBest = localStorage.getItem('uncanny-captcha-best-score')
        if (!savedBest || totalTime < parseInt(savedBest)) {
          localStorage.setItem('uncanny-captcha-best-score', totalTime.toString())
          setBestScore(totalTime)
          setIsNewRecord(true)
        }
        
        setCurrentStep(CAPTCHA_ORDER.length)
      }
    }, 1500)
  }

  const handleRefresh = () => {
    const captcha = CAPTCHA_ORDER[currentStep]
    if (captcha) {
      setCaptchaKeys(prev => ({
        ...prev,
        [captcha.id]: prev[captcha.id] + 1
      }))
    }
  }

  const handleRestart = () => {
    setCurrentStep(-1)
    setTime(0)
    setStartTime(null)
    setCaptchaKeys(CAPTCHA_ORDER.reduce((acc, c) => ({ ...acc, [c.id]: 0 }), {}))
  }

  return (
    <div className="app">
      {/* Pages */}
      {currentStep === -1 && (
        <IntroPage onStart={handleStart} bestScore={bestScore} />
      )}

      {currentStep >= 0 && currentStep < CAPTCHA_ORDER.length && (
        <CaptchaPage
          key={`${CAPTCHA_ORDER[currentStep].id}-${captchaKeys[CAPTCHA_ORDER[currentStep].id]}`}
          captcha={CAPTCHA_ORDER[currentStep]}
          currentIndex={currentStep}
          total={CAPTCHA_ORDER.length}
          onSuccess={handleSuccess}
          onRefresh={handleRefresh}
          currentTime={time}
        />
      )}

      {currentStep === CAPTCHA_ORDER.length && (
        <FinalPage 
          onRestart={handleRestart} 
          finalTime={finalTime} 
          isNewRecord={isNewRecord}
        />
      )}
    </div>
  )
}

export default App
