import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

export const BudgetPanel: React.FC = () => {
  const { state, calculateBudget } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  
  const budget = calculateBudget();
  const isDeficit = budget.netIncome < 0;
  const annualDeficit = budget.netIncome * 12;
  const bankruptcyThreshold = -80 * state.difficultySettings.startingBudgetModifier;
  const bankruptcyProgress = state.budget < 0 ? Math.min(100, (Math.abs(state.budget) / Math.abs(bankruptcyThreshold)) * 100) : 0;
  
  return (
    <div className="relative">
      {/* Budget indicator button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:bg-white/10 ${
          isDeficit ? 'bg-red-900/30' : 'bg-green-900/30'
        }`}
        style={{ borderLeft: `3px solid ${isDeficit ? '#ef4444' : '#22c55e'}` }}
      >
        <span className="text-xs text-gray-400">Бюджет</span>
        <span className={`text-lg font-bold ${state.budget >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {state.budget >= 0 ? '' : '-'}${Math.abs(state.budget).toFixed(1)}B
        </span>
        {isDeficit && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-red-600 text-white animate-pulse">
            −{Math.abs(annualDeficit).toFixed(0)}B/год
          </span>
        )}
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span>💰</span>
              Бюджет — {state.year} год
            </h3>
            
            {/* Current balance */}
            <div className={`text-center p-3 rounded-lg mb-4 ${
              state.budget >= 0 ? 'bg-green-900/30' : 'bg-red-900/30'
            }`}>
              <div className="text-sm text-gray-400">Текущий баланс</div>
              <div className={`text-2xl font-bold ${
                state.budget >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                ${state.budget.toFixed(1)} млрд
              </div>
              {state.budget < 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>До банкротства</span>
                    <span>{bankruptcyProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${bankruptcyProgress}%`,
                        backgroundColor: bankruptcyProgress > 80 ? '#ef4444' : bankruptcyProgress > 50 ? '#f97316' : '#eab308'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Monthly breakdown */}
            <div className="space-y-1.5 mb-3">
              <h4 className="text-sm font-semibold text-green-400 mb-1">📈 Доходы (в месяц):</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Базовый доход</span>
                <span className="text-green-400">+${budget.baseIncome.toFixed(2)}B</span>
              </div>
            </div>

            <div className="space-y-1.5 mb-3">
              <h4 className="text-sm font-semibold text-red-400 mb-1">📉 Расходы (в месяц):</h4>
              
              {budget.pressurePenalty > 0.001 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">🌍 Санкции</span>
                  <span className="text-red-400">-${budget.pressurePenalty.toFixed(2)}B</span>
                </div>
              )}
              
              {budget.corruptionLoss > 0.001 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">🐀 Коррупция ({Math.round(state.difficultySettings.corruptionRange[0]*100)}-{Math.round(state.difficultySettings.corruptionRange[1]*100)}%)</span>
                  <span className="text-red-400">-${budget.corruptionLoss.toFixed(2)}B</span>
                </div>
              )}
              
              {budget.debtService > 0.001 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">🏦 Обслуживание долга (${state.debt.toFixed(0)}B)</span>
                  <span className="text-red-400">-${budget.debtService.toFixed(2)}B</span>
                </div>
              )}
              
              {budget.infrastructureMaintenance > 0.001 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">🔧 Эксплуатация + население</span>
                  <span className="text-red-400">-${budget.infrastructureMaintenance.toFixed(2)}B</span>
                </div>
              )}
              
              {budget.virtualWaterImport > 0.001 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">🚢 Импорт виртуальной воды</span>
                  <span className="text-red-400">-${budget.virtualWaterImport.toFixed(2)}B</span>
                </div>
              )}
              
              {budget.activeInitiativesCost > 0.001 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">📋 Инициативы (повторяющиеся)</span>
                  <span className="text-red-400">-${budget.activeInitiativesCost.toFixed(2)}B</span>
                </div>
              )}
            </div>

            {/* Net income */}
            <div className={`border-t border-gray-700 pt-3 space-y-2`}>
              <div className={`flex justify-between font-bold text-lg ${
                budget.netIncome >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                <span>В месяц:</span>
                <span>{budget.netIncome >= 0 ? '+' : ''}{budget.netIncome.toFixed(2)}B</span>
              </div>
              <div className={`flex justify-between font-bold ${
                annualDeficit >= 0 ? 'text-green-300' : 'text-red-300'
              }`}>
                <span>В год:</span>
                <span>{annualDeficit >= 0 ? '+' : ''}{annualDeficit.toFixed(1)}B</span>
              </div>
            </div>

            {/* Difficulty info */}
            <div className="mt-4 pt-3 border-t border-gray-700 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Сложность</span>
                <span className="text-gray-400">{state.difficultySettings.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Банкротство при</span>
                <span className="text-red-400">${bankruptcyThreshold.toFixed(0)}B</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">{state.difficultySettings.description}</span>
              </div>
            </div>

            {/* Warning */}
            {bankruptcyProgress > 50 && (
              <div className="mt-3 p-2 bg-red-900/50 rounded text-sm text-red-300 animate-pulse">
                ⚠️ Приближается банкротство! ({bankruptcyProgress.toFixed(0)}%)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
