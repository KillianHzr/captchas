import React from 'react'
import ReCaptchaTemplate from './components/ReCaptchaTemplate'
import MorseCaptcha from './components/MorseCaptcha'
import ParadoxCaptcha from './components/ParadoxCaptcha'
import PatienceCaptcha from './components/PatienceCaptcha'
import RedButtonCaptcha from './components/RedButtonCaptcha'
import HangmanCaptcha from './components/HangmanCaptcha'
import WordleCaptcha from './components/WordleCaptcha'
import './App.css'

function App() {
  const handleSkip = () => {
    console.log('Skip clicked')
  }

  const handleRefresh = () => {
    console.log('Refresh clicked')
  }

  const handleAudio = () => {
    console.log('Audio clicked')
  }

  const handleInfo = () => {
    console.log('Info clicked')
  }

  const handleValidate = (isCorrect) => {
    console.log('Validation result:', isCorrect)
  }

  return (
    <div style={{ 
      padding: '40px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '40px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#3c4043', marginBottom: '20px' }}>
        Template reCAPTCHA Mockup
      </h1>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center' }}>
        {/* Exemple 1: Template de base */}
        <div>
          <h3 style={{ color: '#5f6368', marginBottom: '16px' }}>Template de base</h3>
          <ReCaptchaTemplate
            onSkip={handleSkip}
            onRefresh={handleRefresh}
            onAudio={handleAudio}
            onInfo={handleInfo}
          />
        </div>

        {/* Exemple 2: Avec contenu personnalisé */}
        <div>
          <h3 style={{ color: '#5f6368', marginBottom: '16px' }}>Avec contenu personnalisé</h3>
          <ReCaptchaTemplate
            titlePrefix="Select all images with"
            titleHighlight="cars"
            subtitle="Click verify once there are none left"
            showSkip={false}
            onRefresh={handleRefresh}
            onAudio={handleAudio}
            onInfo={handleInfo}
          >
            <div style={{
              width: '100%',
              height: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(3, 1fr)',
              gap: '2px',
              padding: '10px'
            }}>
              {Array.from({ length: 9 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#666'
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </ReCaptchaTemplate>
        </div>

        {/* Exemple 3: Template bicycles */}
        <div>
          <h3 style={{ color: '#5f6368', marginBottom: '16px' }}>Template bicycles</h3>
          <ReCaptchaTemplate
            titlePrefix="Select all squares with"
            titleHighlight="bicycles"
            subtitle="If there are none, click skip"
            onSkip={handleSkip}
            onRefresh={handleRefresh}
            onAudio={handleAudio}
            onInfo={handleInfo}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: '#666',
              backgroundColor: '#f8f9fa'
            }}>
              Zone de contenu personnalisé
            </div>
          </ReCaptchaTemplate>
        </div>

        {/* Exemple 4: Morse Captcha */}
        <div>
          <h3 style={{ color: '#5f6368', marginBottom: '16px' }}>Morse Captcha</h3>
          <MorseCaptcha
            onValidate={handleValidate}
            onSkip={handleSkip}
            onRefresh={handleRefresh}
            onAudio={handleAudio}
            onInfo={handleInfo}
          />
        </div>

        {/* Exemple 5: Paradox Captcha */}
        <div>
          <h3 style={{ color: '#5f6368', marginBottom: '16px' }}>Paradox Captcha</h3>
          <ParadoxCaptcha
            onValidate={handleValidate}
            onSkip={handleSkip}
            onRefresh={handleRefresh}
            onAudio={handleAudio}
            onInfo={handleInfo}
          />
        </div>

        {/* Exemple 6: Patience Captcha */}
        <div>
          <h3 style={{ color: '#5f6368', marginBottom: '16px' }}>Patience Captcha</h3>
          <PatienceCaptcha
            onValidate={handleValidate}
            onSkip={handleSkip}
            onRefresh={handleRefresh}
            onAudio={handleAudio}
            onInfo={handleInfo}
          />
        </div>

        {/* Exemple 7: Red Button Captcha */}
        <div>
          <h3 style={{ color: '#5f6368', marginBottom: '16px' }}>Red Button Captcha</h3>
          <RedButtonCaptcha
            onValidate={handleValidate}
            onSkip={handleSkip}
            onRefresh={handleRefresh}
            onAudio={handleAudio}
            onInfo={handleInfo}
          />
        </div>

        {/* Exemple 8: Hangman Captcha */}
        <div>
          <h3 style={{ color: '#5f6368', marginBottom: '16px' }}>Hangman Captcha</h3>
          <HangmanCaptcha
            onValidate={handleValidate}
            onSkip={handleSkip}
            onRefresh={handleRefresh}
            onAudio={handleAudio}
            onInfo={handleInfo}
          />
        </div>

        {/* Exemple 9: Wordle Captcha */}
        <div>
          <h3 style={{ color: '#5f6368', marginBottom: '16px' }}>Wordle Captcha</h3>
          <WordleCaptcha
            onValidate={handleValidate}
            onSkip={handleSkip}
            onRefresh={handleRefresh}
            onAudio={handleAudio}
            onInfo={handleInfo}
          />
        </div>
      </div>
    </div>
  )
}

export default App
