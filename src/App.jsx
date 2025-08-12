import React from 'react'
import ReCaptchaTemplate from './components/ReCaptchaTemplate'
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

        {/* Exemple 4: Template crosswalks */}
        <div>
          <h3 style={{ color: '#5f6368', marginBottom: '16px' }}>Template crosswalks</h3>
          <ReCaptchaTemplate
            titlePrefix="Click on all images with"
            titleHighlight="crosswalks"
            subtitle="Skip if there are none"
            showSkip={true}
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
