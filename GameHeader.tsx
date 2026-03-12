import React from 'react';
import { useGame } from '../context/GameContext';
import SpeedControl from './SpeedControl';
import { PressurePanel } from './PressurePanel';
import { BudgetPanel } from './BudgetPanel';

// Try to import tutorial context, but don't fail if not available
let useTutorialSafe: () => { isActive: boolean; completeAction: (action: string, target?: string) => void } | null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const tutorialContext = require('../context/TutorialContext');
  useTutorialSafe = () => {
    try {
      return tutorialContext.useTutorial();
    } catch {
      return null;
    }
  };
} catch {
  useTutorialSafe = () => null;
}

const GameHeader: React.FC = () => {
  const { state, advanceTime } = useGame();
  const tutorial = useTutorialSafe ? useTutorialSafe() : null;

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const handleElementClick = (elementId: string) => {
    if (tutorial?.isActive) {
      tutorial.completeAction('any_click', elementId);
      tutorial.completeAction('click', elementId);
    }
  };

  return (
    <header className="h-[110px] bg-[#0F1117]/95 border-b border-gray-800 px-6 flex items-center justify-between">
      {/* Left - Country Info */}
      <div className="flex items-center gap-4" id="game-header" data-tutorial="game-header">
        {/* Turkish flag */}
        <div className="w-12 h-8 bg-red-600 rounded shadow-lg flex items-center justify-center">
          <span className="text-white text-lg">☪</span>
        </div>
        <div>
          <h1 className="text-[#E8E7E4] font-semibold">Republic of Turkey</h1>
          <p className="text-xs text-gray-500">Министерство водных ресурсов</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
              {state.difficultySettings.name}
            </span>
            {state.emergencyState.isActive && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-red-900 text-red-300 animate-pulse">
                ЧП
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center - Date and Speed Control */}
      <div className="text-center">
        <p 
          id="header-date"
          data-tutorial="header-date"
          className="text-5xl font-extralight text-[#E8E7E4] tracking-wide cursor-pointer hover:text-yellow-300 transition-colors"
          onClick={() => handleElementClick('header-date')}
        >
          {monthNames[state.month - 1]} {state.year}
        </p>
        <div 
          id="speed-control"
          data-tutorial="speed-control"
          className="mt-2 flex items-center justify-center gap-3"
          onClick={() => handleElementClick('speed-control')}
        >
          <SpeedControl />
          {state.gameSpeed === 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                advanceTime();
              }}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors flex items-center gap-1"
              title="Или нажмите . (точка)"
            >
              <span>+1 месяц</span>
              <span className="text-gray-400">(.)</span>
            </button>
          )}
        </div>
      </div>

      {/* Right - Key Indicators */}
      <div className="flex items-center gap-4">
        {/* Dam Fill Level */}
        <div className="text-center">
          <div className="relative w-[80px] h-[80px]">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="#1f2937"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke={state.damFillLevel > 70 ? '#3B82F6' : state.damFillLevel > 30 ? '#F59E0B' : '#EF4444'}
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${state.damFillLevel * 2.01} 201`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-[#E8E7E4]">{Math.round(state.damFillLevel)}%</span>
              <span className="text-[9px] text-gray-500">Плотина</span>
            </div>
          </div>
        </div>

        {/* Water Release */}
        <div 
          className="text-center px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
          onClick={() => handleElementClick('water-release')}
        >
          <p className="text-xl font-bold text-blue-400">{state.waterRelease.toFixed(1)}</p>
          <p className="text-xs text-gray-500">млрд м³/год</p>
        </div>

        {/* Budget Panel (new) */}
        <BudgetPanel />

        {/* Pressure Panel (new) */}
        <PressurePanel />

        {/* Downstream Trust */}
        <div 
          id="header-trust"
          data-tutorial="header-trust"
          className="text-center px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
          onClick={() => handleElementClick('header-trust')}
        >
          <p className={`text-xl font-bold ${
            state.downstreamTrust > 30 ? 'text-green-400' : 
            state.downstreamTrust > 0 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {state.downstreamTrust > 0 ? '+' : ''}{state.downstreamTrust}
          </p>
          <p className="text-xs text-gray-500">доверие</p>
        </div>

        {/* Population */}
        <div className="text-center px-3 py-2">
          <p className="text-lg font-bold text-gray-300">{state.population.toFixed(1)}M</p>
          <p className="text-xs text-gray-500">население</p>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
