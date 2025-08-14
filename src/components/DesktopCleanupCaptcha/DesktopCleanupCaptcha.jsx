import React, { useState, useEffect, useCallback } from 'react';
import ReCaptchaTemplate from '../ReCaptchaTemplate';
import InfoModal from '../InfoModal';
import './DesktopCleanupCaptcha.scss';

const DesktopCleanupCaptcha = ({ onValidate, onSkip, onRefresh, onAudio, onInfo }) => {
  const [showAlert, setShowAlert] = useState({ show: false, isCorrect: false });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [desktopItems, setDesktopItems] = useState([]);
  const [trashItems, setTrashItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Icônes disponibles pour le bureau
  const availableIcons = [
    { id: 'word', name: 'Word.exe', icon: '📄', type: 'app' },
    { id: 'excel', name: 'Excel.exe', icon: '📊', type: 'app' },
    { id: 'chrome', name: 'Chrome.exe', icon: '🌐', type: 'app' },
    { id: 'folder1', name: 'Documents', icon: '📁', type: 'folder' },
    { id: 'folder2', name: 'Photos', icon: '📁', type: 'folder' },
    { id: 'file1', name: 'readme.txt', icon: '📝', type: 'file' },
    { id: 'file2', name: 'report.pdf', icon: '📋', type: 'file' },
    { id: 'game', name: 'Game.exe', icon: '🎮', type: 'app' },
    { id: 'music', name: 'Spotify.exe', icon: '🎵', type: 'app' },
    { id: 'image', name: 'photo.jpg', icon: '🖼️', type: 'file' }
  ];

  // Générer des éléments de bureau aléatoires
  const generateDesktopItems = useCallback(() => {
    const shuffled = [...availableIcons].sort(() => Math.random() - 0.5);
    const numberOfItems = Math.floor(Math.random() * 4) + 5; // 5 à 8 éléments
    const selectedItems = shuffled.slice(0, numberOfItems);
    
    // Grille 5x5 = 25 emplacements possibles
    const gridSize = 5;
    const totalSlots = gridSize * gridSize;
    const availableSlots = Array.from({ length: totalSlots }, (_, i) => ({
      x: i % gridSize,
      y: Math.floor(i / gridSize)
    }));
    
    // Exclure la position de la corbeille et les cases autour (3x3 autour de la position 4,4)
    const trashZone = [
      {x: 3, y: 3}, {x: 4, y: 3},
      {x: 3, y: 4}, {x: 4, y: 4}
    ];
    
    const availableSlotsWithoutTrash = availableSlots.filter(
      slot => !trashZone.some(trash => trash.x === slot.x && trash.y === slot.y)
    );
    
    // Mélanger les emplacements disponibles
    const shuffledSlots = availableSlotsWithoutTrash.sort(() => Math.random() - 0.5);
    
    const itemsWithPositions = selectedItems.map((item, index) => ({
      ...item,
      gridX: shuffledSlots[index].x,
      gridY: shuffledSlots[index].y,
      isDragging: false
    }));
    
    setDesktopItems(itemsWithPositions);
    setTrashItems([]);
    setGameCompleted(false);
  }, []);

  // Détection du mode dev
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setIsDevMode(urlParams.get('devMode') === 'velvet');
  }, []);

  // Initialisation
  useEffect(() => {
    generateDesktopItems();
  }, [generateDesktopItems]);

  // Vérifier si le jeu est terminé
  useEffect(() => {
    if (desktopItems.length === 0 && trashItems.length > 0 && !gameCompleted) {
      setGameCompleted(true);
      setShowAlert({ show: true, isCorrect: true });
      setTimeout(() => {
        setShowAlert({ show: false, isCorrect: false });
      }, 3000);
      
      if (onValidate) {
        onValidate(true);
      }
    }
  }, [desktopItems.length, trashItems.length, gameCompleted, onValidate]);

  // Gestion du drag start
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    setDesktopItems(prev => prev.map(i => 
      i.id === item.id ? { ...i, isDragging: true } : i
    ));
    e.dataTransfer.effectAllowed = 'move';
  };

  // Gestion du drag end
  const handleDragEnd = (e) => {
    setDraggedItem(null);
    setDesktopItems(prev => prev.map(i => ({ ...i, isDragging: false })));
  };

  // Gestion du drop sur la corbeille
  const handleTrashDrop = (e) => {
    e.preventDefault();
    if (draggedItem) {
      // Retirer l'élément du bureau
      setDesktopItems(prev => prev.filter(item => item.id !== draggedItem.id));
      // Ajouter l'élément à la corbeille
      setTrashItems(prev => [...prev, draggedItem]);
      setDraggedItem(null);
    }
  };

  // Gestion du dragover sur la corbeille
  const handleTrashDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Gestion du refresh
  const handleRefresh = () => {
    generateDesktopItems();
    if (onRefresh) onRefresh();
  };

  // Gestion de l'info modal
  const handleInfo = () => {
    setShowInfoModal(true);
    if (onInfo) onInfo();
  };

  return (
    <>
      <ReCaptchaTemplate
        titlePrefix="Clean up"
        titleHighlight="the desktop"
        subtitle="Drag all icons to the trash bin"
        showSkip={false}
        showRefresh={true}
        onSkip={onSkip}
        onRefresh={handleRefresh}
        onAudio={onAudio}
        onInfo={handleInfo}
      >
        <div className="desktop-cleanup-captcha">
          {isDevMode && (
            <div className="dev-info">
              <span className="dev-label">Items left:</span>
              <span className="dev-text">{desktopItems.length}</span>
              <span className="dev-label">In trash:</span>
              <span className="dev-text">{trashItems.length}</span>
            </div>
          )}
          
          <div className="desktop-container">
            {/* Bureau Windows avec fond bleu */}
            <div className="desktop-background">
              {/* Éléments du bureau */}
              <div className="desktop-grid">
                {/* Grille de debug en mode développeur */}
                {isDevMode && (() => {
                  const containerSize = window.innerWidth <= 480 ? 210 : 260;
                  const cellSize = containerSize / 5;
                  const gridCells = [];
                  
                  for (let y = 0; y < 5; y++) {
                    for (let x = 0; x < 5; x++) {
                      gridCells.push(
                        <div
                          key={`grid-${x}-${y}`}
                          className="debug-grid-cell"
                          style={{
                            position: 'absolute',
                            left: `${x * cellSize}px`,
                            top: `${y * cellSize}px`,
                            width: `${cellSize}px`,
                            height: `${cellSize}px`,
                            border: '1px dashed rgba(255, 255, 255, 0.3)',
                            boxSizing: 'border-box',
                            fontSize: '10px',
                            color: 'rgba(255, 255, 255, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {x},{y}
                        </div>
                      );
                    }
                  }
                  return gridCells;
                })()}
                
                {desktopItems.map((item) => {
                  // Calcul dynamique de la taille de cellule (260px pour desktop, 210px pour mobile après padding)
                  const containerSize = window.innerWidth <= 480 ? 210 : 260; // 250-40 = 210, 300-40 = 260
                  const cellSize = containerSize / 5; // Grille 5x5
                  const left = item.gridX * cellSize;
                  const top = item.gridY * cellSize;
                  
                  return (
                    <div
                      key={item.id}
                      className={`desktop-item ${item.isDragging ? 'dragging' : ''}`}
                      style={{
                        position: 'absolute',
                        left: `${left}px`,
                        top: `${top}px`,
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        zIndex: 10
                      }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="icon">{item.icon}</div>
                      <div className="label">{item.name}</div>
                    </div>
                  );
                })}
              </div>
              
              {/* Corbeille (toujours en bas à droite) */}
              {(() => {
                const containerSize = window.innerWidth <= 480 ? 210 : 260; // 250-40 = 210, 300-40 = 260
                const cellSize = containerSize / 5;
                const trashLeft = 4 * cellSize; // Colonne 4 (index 4 = 5ème colonne)
                const trashTop = 4 * cellSize;  // Ligne 4 (index 4 = 5ème ligne)
                
                return (
                  <div 
                    className={`trash-bin ${draggedItem ? 'drag-over' : ''}`}
                    style={{
                      position: 'absolute',
                      left: `${trashLeft}px`,
                      top: `${trashTop}px`,
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      zIndex: 20
                    }}
                    onDrop={handleTrashDrop}
                    onDragOver={handleTrashDragOver}
                  >
                    <div className="trash-icon">🗑️</div>
                    <div className="trash-label">Recycle Bin</div>
                    {trashItems.length > 0 && (
                      <div className="trash-count">{trashItems.length}</div>
                    )}
                  </div>
                );
              })()}
            </div>
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
        title="Desktop Cleanup Instructions"
      >
        <div className="desktop-cleanup-hint">
          <p><strong>How to clean the desktop:</strong></p>
          <ul>
            <li>Drag each icon from the desktop</li>
            <li>Drop them into the Recycle Bin</li>
            <li>Continue until the desktop is completely clean</li>
            <li>Only the Recycle Bin should remain on the desktop</li>
          </ul>
          <p><em>Tip: Click and hold an icon, then drag it to the trash!</em></p>
        </div>
      </InfoModal>
    </>
  );
};

export default DesktopCleanupCaptcha;