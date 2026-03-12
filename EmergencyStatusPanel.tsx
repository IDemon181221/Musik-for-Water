import React from 'react';
import { useGame } from '../context/GameContext';

export const EmergencyStatusPanel: React.FC = () => {
  const { state, cancelEmergencyState } = useGame();
  const { emergencyState } = state;
  
  if (!emergencyState.isActive) return null;
  
  const region = state.regions.find(r => r.id === emergencyState.regionId);
  if (!region) return null;
  
  const getPhaseInfo = () => {
    switch (emergencyState.phase) {
      case 'initial':
        return {
          color: '#22c55e',
          label: 'НАЧАЛЬНАЯ ФАЗА',
          description: 'Армия контролирует ситуацию. Напряжение снижено.',
          timeLeft: `${6 - emergencyState.monthsActive} мес до деградации`,
          icon: '🛡️',
        };
      case 'degrading':
        return {
          color: '#eab308',
          label: 'ФАЗА ДЕГРАДАЦИИ',
          description: '+8% напряжения/мес, -15 доверия/мес',
          timeLeft: `${18 - emergencyState.monthsActive} мес до критической фазы`,
          icon: '⚠️',
        };
      case 'critical':
        return {
          color: '#ef4444',
          label: 'КРИТИЧЕСКАЯ ФАЗА',
          description: 'Высокий риск появления ополчений!',
          timeLeft: 'Немедленно отмените ЧП!',
          icon: '🔥',
        };
    }
  };
  
  const phaseInfo = getPhaseInfo();
  
  return (
    <div 
      className="fixed bottom-4 left-4 w-80 rounded-lg shadow-xl z-50 overflow-hidden"
      style={{ 
        backgroundColor: '#1a1a2e',
        borderLeft: `4px solid ${phaseInfo.color}`,
      }}
    >
      {/* Header */}
      <div 
        className="px-4 py-2 flex items-center justify-between"
        style={{ backgroundColor: `${phaseInfo.color}20` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{phaseInfo.icon}</span>
          <div>
            <div className="text-sm font-bold" style={{ color: phaseInfo.color }}>
              ЧРЕЗВЫЧАЙНОЕ ПОЛОЖЕНИЕ
            </div>
            <div className="text-xs text-gray-400">{region.nameRu}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">{emergencyState.monthsActive}</div>
          <div className="text-xs text-gray-400">месяцев</div>
        </div>
      </div>
      
      {/* Phase indicator */}
      <div className="px-4 py-3">
        <div 
          className="text-xs font-bold mb-1"
          style={{ color: phaseInfo.color }}
        >
          {phaseInfo.label}
        </div>
        <div className="text-sm text-gray-300 mb-2">
          {phaseInfo.description}
        </div>
        <div className="text-xs text-gray-500">
          {phaseInfo.timeLeft}
        </div>
        
        {/* Progress bar showing phases */}
        <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-green-500"
            style={{ width: `${Math.min(emergencyState.monthsActive / 6 * 100, 100) * 0.33}%` }}
          />
          <div 
            className="h-full bg-yellow-500"
            style={{ 
              width: emergencyState.monthsActive > 6 
                ? `${Math.min((emergencyState.monthsActive - 6) / 12 * 100, 100) * 0.33}%` 
                : '0%' 
            }}
          />
          <div 
            className="h-full bg-red-500"
            style={{ 
              width: emergencyState.monthsActive > 18 
                ? `${Math.min((emergencyState.monthsActive - 18) / 18 * 100, 100) * 0.34}%` 
                : '0%' 
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>6 мес</span>
          <span>18 мес</span>
          <span>36+</span>
        </div>
        
        {/* Effects summary */}
        <div className="mt-3 space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className={emergencyState.phase === 'initial' ? 'text-green-400' : 'text-gray-500'}>
              ✓ Напряжение снижено на 55%
            </span>
          </div>
          {emergencyState.phase !== 'initial' && (
            <>
              <div className="flex items-center gap-2 text-yellow-400">
                ↗ +8% напряжения каждый месяц
              </div>
              <div className="flex items-center gap-2 text-yellow-400">
                ↘ -15 доверия каждый месяц
              </div>
            </>
          )}
          {emergencyState.phase === 'critical' && (
            <div className="flex items-center gap-2 text-red-400 animate-pulse">
              ⚠ 25% шанс появления ополчений!
            </div>
          )}
        </div>
        
        {/* Cancel button */}
        <button
          onClick={cancelEmergencyState}
          className={`mt-4 w-full py-2 rounded font-bold text-sm transition-colors ${
            emergencyState.phase === 'initial'
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
          }`}
        >
          {emergencyState.phase === 'initial' 
            ? 'Отменить ЧП (пока не поздно)'
            : '⚠️ СРОЧНО ОТМЕНИТЬ ЧП'
          }
        </button>
      </div>
      
      {/* Warning for critical phase */}
      {emergencyState.phase === 'critical' && (
        <div className="bg-red-900/50 px-4 py-2 text-xs text-red-300 border-t border-red-800">
          ⚠️ ЧП — это морфий. Сначала облегчение, потом ломка в 10 раз хуже.
        </div>
      )}
    </div>
  );
};
