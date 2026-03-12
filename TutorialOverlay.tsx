import React from 'react';
import { useTutorial } from '../../context/TutorialContext';

export const TutorialOverlay: React.FC = () => {
  const tutorial = useTutorial();
  const currentStep = tutorial.getCurrentStep();
  const currentChapter = tutorial.getCurrentChapter();

  if (!currentStep || tutorial.showChapterIntro || tutorial.showBlackSwan || tutorial.showFinalScreen) {
    return null;
  }

  return (
    <>
      {/* Semi-transparent overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          background: 'rgba(0,0,0,0.3)'
        }}
      />

      {/* Instruction panel - fixed at bottom center */}
      <div className="fixed bottom-[160px] left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <div className="bg-[#1a1a2e] border-2 border-yellow-500/50 rounded-xl p-6 shadow-2xl">
          {/* Voice text (main instruction) */}
          <div className="flex items-start gap-4">
            {/* Speaker icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <span className="text-2xl">🎙️</span>
            </div>
            
            <div className="flex-1">
              {/* Chapter & step indicator */}
              <div className="text-xs text-gray-500 mb-1">
                Глава {currentChapter?.id}: {currentChapter?.titleRu} — Шаг {tutorial.currentStep + 1}/{currentChapter?.steps.length}
              </div>
              
              {/* Instruction title */}
              <h3 className="text-yellow-400 font-semibold text-lg mb-2">
                {currentStep.instruction}
              </h3>
              
              {/* Voice text */}
              <p className="text-gray-300 text-base leading-relaxed">
                {currentStep.voiceText}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2">
              {tutorial.waitingForAction && !tutorial.canProceed && (
                <span className="text-orange-400 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                  {currentStep.requiredAction === 'click' && 'Нажмите на выделенный элемент'}
                  {currentStep.requiredAction === 'select_region' && 'Выберите указанный регион'}
                  {currentStep.requiredAction === 'open_panel' && 'Откройте указанную панель'}
                  {currentStep.requiredAction === 'launch_initiative' && 'Активируйте инициативу'}
                  {currentStep.requiredAction === 'any_click' && 'Нажмите в любом месте для продолжения'}
                  {!currentStep.requiredAction && 'Выполните действие'}
                </span>
              )}
              {tutorial.canProceed && (
                <span className="text-green-400 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                  Готово! Нажмите "Далее"
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {tutorial.currentStep > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    tutorial.previousStep();
                  }}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  ← Назад
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (tutorial.canProceed || !tutorial.waitingForAction) {
                    tutorial.nextStep();
                  }
                }}
                disabled={!tutorial.canProceed && tutorial.waitingForAction}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  tutorial.canProceed || !tutorial.waitingForAction
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400 cursor-pointer'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Далее →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pulsing highlight styles - injected dynamically based on highlighted element */}
      {tutorial.highlightedElement && (
        <style>{`
          /* Highlight by data-tutorial attribute */
          [data-tutorial="${tutorial.highlightedElement}"] {
            position: relative !important;
            z-index: 45 !important;
            box-shadow: 0 0 0 4px rgba(255, 183, 77, 0.8), 0 0 20px rgba(255, 183, 77, 0.5) !important;
            border-radius: 8px;
            animation: tutorial-highlight-pulse 1.5s ease-in-out infinite !important;
          }
          
          /* Highlight by ID */
          #${tutorial.highlightedElement} {
            position: relative !important;
            z-index: 45 !important;
            box-shadow: 0 0 0 4px rgba(255, 183, 77, 0.8), 0 0 20px rgba(255, 183, 77, 0.5) !important;
            border-radius: 8px;
            animation: tutorial-highlight-pulse 1.5s ease-in-out infinite !important;
          }
          
          /* Also try with region- prefix for regions */
          #region-${tutorial.highlightedElement} {
            position: relative !important;
            z-index: 45 !important;
            box-shadow: 0 0 0 4px rgba(255, 183, 77, 0.8), 0 0 20px rgba(255, 183, 77, 0.5) !important;
            border-radius: 8px;
            animation: tutorial-highlight-pulse 1.5s ease-in-out infinite !important;
          }
          
          /* Handle gaziantep specifically */
          ${tutorial.highlightedElement.includes('gaziantep') ? `
            [id*="gaziantep"],
            [data-tutorial*="gaziantep"],
            [data-region-id="gaziantep"] {
              position: relative !important;
              z-index: 45 !important;
              box-shadow: 0 0 0 4px rgba(255, 183, 77, 0.8), 0 0 20px rgba(255, 183, 77, 0.5) !important;
              border-radius: 8px;
              animation: tutorial-highlight-pulse 1.5s ease-in-out infinite !important;
            }
          ` : ''}
          
          /* Handle sanliurfa specifically */
          ${tutorial.highlightedElement.includes('sanliurfa') ? `
            [id*="sanliurfa"],
            [data-tutorial*="sanliurfa"],
            [data-region-id="sanliurfa"] {
              position: relative !important;
              z-index: 45 !important;
              box-shadow: 0 0 0 4px rgba(255, 183, 77, 0.8), 0 0 20px rgba(255, 183, 77, 0.5) !important;
              border-radius: 8px;
              animation: tutorial-highlight-pulse 1.5s ease-in-out infinite !important;
            }
          ` : ''}
          
          /* Handle dam specifically */
          ${tutorial.highlightedElement.includes('dam') ? `
            [id*="dam"],
            [data-tutorial*="dam"],
            .dam-marker {
              position: relative !important;
              z-index: 45 !important;
            }
            [id*="dam"] circle,
            .dam-marker circle {
              filter: drop-shadow(0 0 10px rgba(255, 183, 77, 1)) !important;
              animation: tutorial-highlight-pulse 1.5s ease-in-out infinite !important;
            }
          ` : ''}
          
          /* Handle regions-panel */
          ${tutorial.highlightedElement.includes('regions') ? `
            #regions-panel,
            [data-tutorial="regions-panel"] {
              box-shadow: 0 0 0 4px rgba(255, 183, 77, 0.8), 0 0 20px rgba(255, 183, 77, 0.5) !important;
              animation: tutorial-highlight-pulse 1.5s ease-in-out infinite !important;
            }
          ` : ''}
          
          /* Handle initiatives-panel */
          ${tutorial.highlightedElement.includes('initiatives') ? `
            #initiatives-panel,
            [data-tutorial="initiatives-panel"] {
              box-shadow: 0 0 0 4px rgba(255, 183, 77, 0.8), 0 0 20px rgba(255, 183, 77, 0.5) !important;
              animation: tutorial-highlight-pulse 1.5s ease-in-out infinite !important;
            }
          ` : ''}
          
          /* Handle map-container */
          ${tutorial.highlightedElement.includes('map') ? `
            #map-container,
            [data-tutorial="map-container"],
            .map-view {
              box-shadow: inset 0 0 0 4px rgba(255, 183, 77, 0.8) !important;
              animation: tutorial-highlight-pulse 1.5s ease-in-out infinite !important;
            }
          ` : ''}
          
          /* Handle header elements */
          ${tutorial.highlightedElement.includes('header') || 
            tutorial.highlightedElement.includes('budget') || 
            tutorial.highlightedElement.includes('pressure') ||
            tutorial.highlightedElement.includes('speed') ||
            tutorial.highlightedElement.includes('trust') ? `
            #game-header,
            [data-tutorial="game-header"],
            #budget-display,
            [data-tutorial="budget-display"],
            #pressure-display,
            [data-tutorial="pressure-display"],
            #speed-control,
            [data-tutorial="speed-control"],
            #header-trust,
            [data-tutorial="header-trust"] {
              position: relative !important;
              z-index: 45 !important;
            }
            #${tutorial.highlightedElement},
            [data-tutorial="${tutorial.highlightedElement}"] {
              box-shadow: 0 0 0 4px rgba(255, 183, 77, 0.8), 0 0 20px rgba(255, 183, 77, 0.5) !important;
              border-radius: 8px;
              animation: tutorial-highlight-pulse 1.5s ease-in-out infinite !important;
            }
          ` : ''}
          
          @keyframes tutorial-highlight-pulse {
            0%, 100% { 
              box-shadow: 0 0 0 4px rgba(255, 183, 77, 0.8), 0 0 20px rgba(255, 183, 77, 0.5);
            }
            50% { 
              box-shadow: 0 0 0 6px rgba(255, 183, 77, 1), 0 0 30px rgba(255, 183, 77, 0.8);
            }
          }
        `}</style>
      )}
    </>
  );
};
