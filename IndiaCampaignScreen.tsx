import { useState, useEffect } from 'react';
import { useIndiaGame } from '../../contexts/IndiaGameContext';
import PauseMenu from '../PauseMenu';
import { IndiaHeader } from './IndiaHeader';
import { IndiaMap } from './IndiaMap';
import { IndiaRegionsPanel } from './IndiaRegionsPanel';
import { IndiaInitiativesPanel } from './IndiaInitiativesPanel';
import { IndiaStartScreen } from './IndiaStartScreen';
import { IndiaVictoryScreen } from './IndiaVictoryScreen';
import { IndiaDefeatScreen } from './IndiaDefeatScreen';
import { IndiaEventPopup } from './IndiaEventPopup';

interface Props {
  onExit: () => void;
}

export function IndiaCampaignScreen({ onExit }: Props) {
  const { state, dispatch, setSpeed } = useIndiaGame();
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showInitiatives, setShowInitiatives] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // ESC opens pause menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showStartScreen) {
        const newPaused = !isPaused;
        setIsPaused(newPaused);
        setSpeed(newPaused ? 0 : 2);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, setSpeed, showStartScreen]);
  
  // Screen shake effect
  const shakeStyle = state.screenShake ? {
    animation: 'shake 0.5s ease-in-out infinite'
  } : {};
  
  // Red border effect when timer is low
  const borderStyle = state.nuclearTimer < 30 ? {
    boxShadow: `inset 0 0 ${100 - state.nuclearTimer * 3}px rgba(220, 38, 38, ${0.3 + (30 - state.nuclearTimer) * 0.02})`
  } : {};
  
  // Handle start screen
  if (showStartScreen) {
    return <IndiaStartScreen onStart={() => setShowStartScreen(false)} onExit={onExit} />;
  }
  
  // Handle victory
  if (state.gameOver && state.victory) {
    return <IndiaVictoryScreen state={state} onExit={onExit} />;
  }
  
  // Handle defeat (nuclear flash)
  if (state.gameOver && !state.victory) {
    return <IndiaDefeatScreen state={state} onExit={onExit} />;
  }
  
  return (
    <div 
      className="h-screen w-screen bg-[#0F1117] text-[#E8E7E4] overflow-hidden flex flex-col"
      style={{ ...shakeStyle, ...borderStyle }}
    >
      {/* CSS for shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        @keyframes pulse-red {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
      
      {/* Header with nuclear timer */}
      <IndiaHeader onExit={onExit} />
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel - Regions */}
        <IndiaRegionsPanel />
        
        {/* Center - Map */}
        <div className="flex-1 relative">
          <IndiaMap />
        </div>
        
        {/* Right panel - Initiatives */}
        <div className="w-[400px] bg-[#0F1117]/90 border-l border-gray-800 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Инициативы</h2>
            <button
              onClick={() => setShowInitiatives(!showInitiatives)}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm"
            >
              {showInitiatives ? 'Скрыть' : 'Показать'}
            </button>
          </div>
          {showInitiatives && <IndiaInitiativesPanel />}
          {!showInitiatives && (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p className="text-center px-4">
                Нажмите "Показать" для просмотра доступных инициатив
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Event popup */}
      {state.currentEvent && (
        <IndiaEventPopup
          event={state.currentEvent}
          onDismiss={() => dispatch({ type: 'DISMISS_EVENT' })}
        />
      )}

      {/* Pause Button */}
      <button
        onClick={() => {
          setIsPaused(true);
          setSpeed(0);
        }}
        className="fixed top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        ⏸️ Пауза
      </button>

      {/* Pause Menu */}
      <PauseMenu
        isOpen={isPaused}
        onClose={() => {
          setIsPaused(false);
          setSpeed(2);
        }}
        onExit={onExit}
        gameName="Инд — Индия"
      />
    </div>
  );
}
