import React, { useEffect, useState, createContext, useContext } from 'react';
import { useTutorial } from '../../context/TutorialContext';
import { useGame } from '../../context/GameContext';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialQAPanel } from './TutorialQAPanel';
import { TutorialChapterIntro } from './TutorialChapterIntro';
import { TutorialBlackSwan } from './TutorialBlackSwan';
import { TutorialFinalScreen } from './TutorialFinalScreen';
import GameHeader from '../GameHeader';
import RegionsPanel from '../RegionsPanel';
import MapView from '../MapView';
import InitiativesPanel from '../InitiativesPanel';
import EventTimeline from '../EventTimeline';

// Create a context for onExit callback
interface TutorialExitContextType {
  onExit: () => void;
}

const TutorialExitContext = createContext<TutorialExitContextType | null>(null);

export const useTutorialExit = () => {
  const context = useContext(TutorialExitContext);
  return context?.onExit || (() => {});
};

interface TutorialScreenProps {
  onExit?: () => void;
}

export const TutorialScreen: React.FC<TutorialScreenProps> = ({ onExit }) => {
  const tutorial = useTutorial();
  const game = useGame();
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'civilian' | 'diplomatic' | 'military'>('civilian');

  // Handle exit with callback
  const handleExit = () => {
    console.log('[TutorialScreen] handleExit called');
    if (onExit) {
      console.log('[TutorialScreen] Calling onExit callback');
      onExit();
    }
    tutorial.exitTutorial();
  };

  // Track tutorial actions for regions panel
  useEffect(() => {
    if (leftPanelOpen && tutorial.requiredAction === 'open_panel' && tutorial.requiredTarget === 'regions') {
      tutorial.completeAction('open_panel', 'regions');
    }
  }, [leftPanelOpen, tutorial]);

  // Track tutorial actions for initiatives panel
  useEffect(() => {
    if (rightPanelOpen && tutorial.requiredAction === 'open_panel' && tutorial.requiredTarget === 'initiatives') {
      tutorial.completeAction('open_panel', 'initiatives');
    }
  }, [rightPanelOpen, tutorial]);

  // Track tutorial actions for tabs
  useEffect(() => {
    if (activeTab === 'diplomatic' && tutorial.requiredAction === 'open_panel' && tutorial.requiredTarget === 'diplomatic') {
      tutorial.completeAction('open_panel', 'diplomatic');
    }
    if (activeTab === 'military' && tutorial.requiredAction === 'open_panel' && tutorial.requiredTarget === 'military') {
      tutorial.completeAction('open_panel', 'military');
    }
  }, [activeTab, tutorial]);

  // Handle region selection for tutorial
  useEffect(() => {
    if (game.state.selectedRegionId && tutorial.requiredAction === 'select_region') {
      const regionId = game.state.selectedRegionId.toLowerCase();
      if (tutorial.requiredTarget === 'any' || tutorial.requiredTarget === regionId || 
          regionId.includes(tutorial.requiredTarget || '')) {
        tutorial.completeAction('select_region', regionId);
      }
    }
  }, [game.state.selectedRegionId, tutorial]);

  // Handle time advancement for tutorial
  useEffect(() => {
    if (tutorial.requiredAction === 'advance_time' && tutorial.requiredTarget) {
      const [targetYear, targetMonth] = tutorial.requiredTarget.split('-').map(Number);
      if (game.state.year >= targetYear && (game.state.month >= targetMonth || game.state.year > targetYear)) {
        tutorial.completeAction('advance_time', tutorial.requiredTarget);
      }
    }
  }, [game.state.year, game.state.month, tutorial]);

  // Provide onExit to all child components
  const exitContextValue = { onExit: handleExit };

  // Show chapter intro
  if (tutorial.showChapterIntro) {
    return (
      <TutorialExitContext.Provider value={exitContextValue}>
        <TutorialChapterIntro onExit={handleExit} />
      </TutorialExitContext.Provider>
    );
  }

  // Show black swan event
  if (tutorial.showBlackSwan) {
    return (
      <TutorialExitContext.Provider value={exitContextValue}>
        <TutorialBlackSwan onExit={handleExit} />
      </TutorialExitContext.Provider>
    );
  }

  // Show final screen
  if (tutorial.showFinalScreen) {
    return (
      <TutorialExitContext.Provider value={exitContextValue}>
        <TutorialFinalScreen onExit={handleExit} />
      </TutorialExitContext.Provider>
    );
  }

  const handleGlobalClick = () => {
    if (tutorial.requiredAction === 'any_click') {
      tutorial.completeAction('any_click');
    }
  };

  return (
    <TutorialExitContext.Provider value={exitContextValue}>
      <div className="h-screen w-screen bg-[#0F1117] overflow-hidden flex flex-col" onClick={handleGlobalClick}>
        {/* Tutorial progress bar at very top */}
        <div className="h-1 bg-gray-800 w-full">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${tutorial.progress}%` }}
          />
        </div>
        
        {/* Tutorial chapter indicator */}
        <div className="bg-[#1a1a2e] border-b border-gray-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-yellow-400 text-sm font-medium">
              📖 ОБУЧЕНИЕ
            </span>
            <span className="text-gray-400 text-sm">
              Глава {tutorial.currentChapter}/10: {tutorial.getCurrentChapter()?.titleRu}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm">
              Прогресс: {tutorial.progress}%
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                tutorial.toggleQA();
              }}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                tutorial.showQA 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ❓ Вопросы (87)
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleExit();
              }}
              className="px-4 py-2 rounded text-sm bg-red-900/50 text-red-400 hover:bg-red-800 hover:text-red-300 transition-colors cursor-pointer select-none"
              type="button"
            >
              ✕ Выйти из обучения
            </button>
          </div>
        </div>

        {/* Game header */}
        <GameHeader />

        {/* Main game area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left panel - Regions */}
          <div 
            id="regions-panel"
            className={`transition-all duration-300 ${leftPanelOpen ? 'w-[420px]' : 'w-12'} bg-[#0F1117]/95 border-r border-gray-800 flex flex-col`}
          >
            <button
              id="regions-button"
              onClick={(e) => {
                e.stopPropagation();
                setLeftPanelOpen(!leftPanelOpen);
                if (!leftPanelOpen && tutorial.requiredAction === 'open_panel' && tutorial.requiredTarget === 'regions') {
                  setTimeout(() => tutorial.completeAction('open_panel', 'regions'), 100);
                }
              }}
              className={`p-3 border-b border-gray-800 text-left hover:bg-gray-800/50 transition-colors ${
                tutorial.highlightedElement === 'regions-button' ? 'ring-2 ring-yellow-400 animate-pulse' : ''
              }`}
            >
              {leftPanelOpen ? '◀ Регионы' : '▶'}
            </button>
            {leftPanelOpen && <RegionsPanel />}
          </div>

          {/* Center - Map */}
          <div className="flex-1 relative">
            <MapView />
          </div>

          {/* Right panel - Initiatives */}
          <div 
            id="initiatives-panel"
            className={`transition-all duration-300 ${rightPanelOpen ? 'w-[400px]' : 'w-12'} bg-[#0F1117]/95 border-l border-gray-800 flex flex-col`}
          >
            <button
              id="initiatives-button"
              onClick={(e) => {
                e.stopPropagation();
                setRightPanelOpen(!rightPanelOpen);
                if (!rightPanelOpen && tutorial.requiredAction === 'open_panel' && tutorial.requiredTarget === 'initiatives') {
                  setTimeout(() => tutorial.completeAction('open_panel', 'initiatives'), 100);
                }
              }}
              className={`p-3 border-b border-gray-800 text-left hover:bg-gray-800/50 transition-colors ${
                tutorial.highlightedElement === 'initiatives-button' ? 'ring-2 ring-yellow-400 animate-pulse' : ''
              }`}
            >
              {rightPanelOpen ? 'Инициативы ▶' : '◀'}
            </button>
            {rightPanelOpen && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Initiative tabs */}
                <div 
                  id="initiatives-tabs"
                  className="flex border-b border-gray-800"
                >
                  <button
                    id="initiatives-civilian"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('civilian');
                    }}
                    className={`flex-1 py-2 text-xs font-medium transition-colors ${
                      activeTab === 'civilian' 
                        ? 'bg-blue-900/50 text-blue-400 border-b-2 border-blue-500' 
                        : 'text-gray-500 hover:text-gray-300'
                    } ${tutorial.highlightedElement === 'initiatives-civilian' ? 'ring-2 ring-yellow-400' : ''}`}
                  >
                    Гражданские
                  </button>
                  <button
                    id="initiatives-diplomatic"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('diplomatic');
                      if (tutorial.requiredAction === 'open_panel' && tutorial.requiredTarget === 'diplomatic') {
                        setTimeout(() => tutorial.completeAction('open_panel', 'diplomatic'), 100);
                      }
                    }}
                    className={`flex-1 py-2 text-xs font-medium transition-colors ${
                      activeTab === 'diplomatic' 
                        ? 'bg-yellow-900/50 text-yellow-400 border-b-2 border-yellow-500' 
                        : 'text-gray-500 hover:text-gray-300'
                    } ${tutorial.highlightedElement === 'initiatives-diplomatic' ? 'ring-2 ring-yellow-400' : ''}`}
                  >
                    Дипломатия
                  </button>
                  <button
                    id="initiatives-military"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('military');
                      if (tutorial.requiredAction === 'open_panel' && tutorial.requiredTarget === 'military') {
                        setTimeout(() => tutorial.completeAction('open_panel', 'military'), 100);
                      }
                    }}
                    className={`flex-1 py-2 text-xs font-medium transition-colors ${
                      activeTab === 'military' 
                        ? 'bg-red-900/50 text-red-400 border-b-2 border-red-500' 
                        : 'text-gray-500 hover:text-gray-300'
                    } ${tutorial.highlightedElement === 'initiatives-military' ? 'ring-2 ring-yellow-400' : ''}`}
                  >
                    Военные
                  </button>
                </div>
                <InitiativesPanel />
              </div>
            )}
          </div>

          {/* Q&A Panel - slides in from right */}
          {tutorial.showQA && <TutorialQAPanel />}
        </div>

        {/* Bottom - Event Timeline */}
        <div id="event-timeline" className="h-[140px] border-t border-gray-800 bg-[#0F1117]/95">
          <EventTimeline />
        </div>

        {/* Tutorial Overlay with instructions */}
        <TutorialOverlay />
      </div>
    </TutorialExitContext.Provider>
  );
};

export default TutorialScreen;
