import React from 'react';
import './ReCaptchaTemplate.scss';

const ReCaptchaTemplate = ({
  titlePrefix = "Select all squares with",
  titleHighlight = "traffic lights", 
  subtitle = "If there are none, click skip",
  children,
  showSkip = true,
  onSkip,
  onRefresh,
  onAudio,
  onInfo
}) => {
  return (
    <div className="recaptcha-container">
      <div className="recaptcha-header">
        <div className="recaptcha-title-prefix">{titlePrefix}</div>
        <div className="recaptcha-title-highlight">{titleHighlight}</div>
        <div className="recaptcha-subtitle">{subtitle}</div>
      </div>
      
      <div className="recaptcha-content">
        {children}
      </div>
      
      <div className="recaptcha-toolbar">
        <div className="recaptcha-toolbar-left">
          <button 
            className="recaptcha-icon-btn" 
            onClick={onRefresh}
            title="Refresh"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
          
          <button 
            className="recaptcha-icon-btn" 
            onClick={onAudio}
            title="Audio challenge"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          </button>
          
          <button 
            className="recaptcha-icon-btn" 
            onClick={onInfo}
            title="Info"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </button>
        </div>
        
        {showSkip && (
          <div className="recaptcha-toolbar-right">
            <button 
              className="recaptcha-skip-btn" 
              onClick={onSkip}
            >
              SKIP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReCaptchaTemplate;