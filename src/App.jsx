import React, { useState } from 'react'
import MorseCaptcha from './components/MorseCaptcha'
import ParadoxCaptcha from './components/ParadoxCaptcha'
import PatienceCaptcha from './components/PatienceCaptcha'
import RedButtonCaptcha from './components/RedButtonCaptcha'
import HangmanCaptcha from './components/HangmanCaptcha'
import WordleCaptcha from './components/WordleCaptcha'
import CardGameCaptcha from './components/CardGameCaptcha'
import DesktopCleanupCaptcha from './components/DesktopCleanupCaptcha'
import './App.css'

// Ordre des captchas du moins WTF au plus WTF
const CAPTCHA_ORDER = [
  { id: 'hangman', name: 'Hangman', Component: HangmanCaptcha, wtfLevel: 1 },
  { id: 'wordle', name: 'Wordle', Component: WordleCaptcha, wtfLevel: 2 },
  { id: 'card', name: 'Card Game', Component: CardGameCaptcha, wtfLevel: 3 },
  { id: 'morse', name: 'Morse Code', Component: MorseCaptcha, wtfLevel: 4 },
  { id: 'patience', name: 'Patience', Component: PatienceCaptcha, wtfLevel: 5 },
  { id: 'desktop', name: 'Desktop Cleanup', Component: DesktopCleanupCaptcha, wtfLevel: 6 },
  { id: 'redbutton', name: 'Red Button', Component: RedButtonCaptcha, wtfLevel: 7 },
  { id: 'paradox', name: 'Paradox', Component: ParadoxCaptcha, wtfLevel: 8 },
]

// Page d'introduction
function IntroPage({ onStart }) {
  return (
    <div className="page intro-page">
      <div className="intro-content">
        <h1 className="intro-title">reCAPTCHA Challenge</h1>
        <p className="intro-subtitle">Prouvez que vous êtes humain...</p>
        <p className="intro-description">
          Résolvez {CAPTCHA_ORDER.length} captchas de plus en plus étranges.
          <br />
          Bonne chance.
        </p>
        <div className="wtf-meter">
          <span className="wtf-label">Normal</span>
          <div className="wtf-bar">
            {CAPTCHA_ORDER.map((_, i) => (
              <div key={i} className="wtf-segment" style={{ opacity: 0.3 + (i * 0.1) }} />
            ))}
          </div>
          <span className="wtf-label">WTF</span>
        </div>
        <button className="start-button" onClick={onStart}>
          Commencer
        </button>
      </div>
    </div>
  )
}

// Page de captcha individuel
function CaptchaPage({ captcha, currentIndex, total, onSuccess, onRefresh }) {
  const { Component, name, wtfLevel } = captcha

  return (
    <div className="page captcha-page">
      <div className="captcha-header">
        <div className="progress-info">
          <span className="progress-text">{currentIndex + 1} / {total}</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            />
          </div>
        </div>
        <div className="wtf-indicator">
          <span className="wtf-text">WTF Level:</span>
          <div className="wtf-dots">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className={`wtf-dot ${i < wtfLevel ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="captcha-container">
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
function FinalPage({ onRestart }) {
  return (
    <div className="page final-page">
      <div className="final-header">
        <h1 className="final-title">Félicitations!</h1>
        <p className="final-subtitle">Vous avez prouvé que vous êtes humain</p>
        <p className="final-description">(ou un robot très sophistiqué)</p>
      </div>

      <div className="final-trophy">
        <div className="trophy-icon">🏆</div>
        <p className="trophy-text">Tous les captchas complétés!</p>
      </div>

      <h2 className="gallery-title">Galerie des captchas WTF</h2>
      <div className="captcha-gallery">
        {CAPTCHA_ORDER.map((captcha) => (
          <div key={captcha.id} className="gallery-item">
            <div className="gallery-item-header">
              <span className="gallery-item-name">{captcha.name}</span>
              <span className="gallery-item-wtf">
                {'🔥'.repeat(Math.ceil(captcha.wtfLevel / 2))}
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

      <button className="restart-button" onClick={onRestart}>
        Recommencer
      </button>
    </div>
  )
}

function App() {
  const [currentStep, setCurrentStep] = useState(-1) // -1 = intro, 0-7 = captchas, 8 = final
  const [captchaKeys, setCaptchaKeys] = useState(
    CAPTCHA_ORDER.reduce((acc, c) => ({ ...acc, [c.id]: 0 }), {})
  )

  const handleStart = () => {
    setCurrentStep(0)
  }

  const handleSuccess = () => {
    // Attendre que l'alerte du captcha soit visible avant de passer au suivant
    setTimeout(() => {
      if (currentStep < CAPTCHA_ORDER.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        setCurrentStep(CAPTCHA_ORDER.length) // Go to final page
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
    setCaptchaKeys(CAPTCHA_ORDER.reduce((acc, c) => ({ ...acc, [c.id]: 0 }), {}))
  }

  return (
    <div className="app">
      {/* Pages */}
      {currentStep === -1 && (
        <IntroPage onStart={handleStart} />
      )}

      {currentStep >= 0 && currentStep < CAPTCHA_ORDER.length && (
        <CaptchaPage
          key={`${CAPTCHA_ORDER[currentStep].id}-${captchaKeys[CAPTCHA_ORDER[currentStep].id]}`}
          captcha={CAPTCHA_ORDER[currentStep]}
          currentIndex={currentStep}
          total={CAPTCHA_ORDER.length}
          onSuccess={handleSuccess}
          onRefresh={handleRefresh}
        />
      )}

      {currentStep === CAPTCHA_ORDER.length && (
        <FinalPage onRestart={handleRestart} />
      )}
    </div>
  )
}

export default App
