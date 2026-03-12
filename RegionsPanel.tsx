import React from 'react';
import RegionCard from './RegionCard';
import { useGame } from '../context/GameContext';

// Try to import tutorial context
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

const RegionsPanel: React.FC = () => {
  const { state } = useGame();
  const tutorial = useTutorialSafe ? useTutorialSafe() : null;

  const criticalRegions = state.regions.filter(r => r.socialTension > 85 || r.waterStress > 85);
  const warningRegions = state.regions.filter(r => 
    (r.socialTension > 65 || r.waterStress > 65) && 
    r.socialTension <= 85 && r.waterStress <= 85
  );
  const stableRegions = state.regions.filter(r => 
    r.socialTension <= 65 && r.waterStress <= 65
  );

  const avgWaterStress = Math.round(state.regions.reduce((sum, r) => sum + r.waterStress, 0) / state.regions.length);
  const avgSocialTension = Math.round(state.regions.reduce((sum, r) => sum + r.socialTension, 0) / state.regions.length);
  const totalMilitias = state.regions.reduce((sum, r) => sum + r.militias, 0);

  const handlePanelClick = () => {
    if (tutorial?.isActive) {
      tutorial.completeAction('open_panel', 'regions');
      tutorial.completeAction('any_click', 'regions-panel');
    }
  };

  return (
    <div 
      id="regions-panel"
      data-tutorial="regions-panel"
      className="h-full flex flex-col bg-[#0F1117]"
      onClick={handlePanelClick}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h2 
          id="regions-button"
          data-tutorial="regions-button"
          className="text-lg font-bold text-[#E8E7E4] mb-3"
        >
          Регионы Турции
        </h2>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-gray-800/50 rounded">
            <p className="text-xs text-gray-500">Ср. водный стресс</p>
            <p className={`text-lg font-bold ${avgWaterStress > 70 ? 'text-red-400' : avgWaterStress > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
              {avgWaterStress}%
            </p>
          </div>
          <div className="p-2 bg-gray-800/50 rounded">
            <p className="text-xs text-gray-500">Ср. напряжение</p>
            <p className={`text-lg font-bold ${avgSocialTension > 70 ? 'text-red-400' : avgSocialTension > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
              {avgSocialTension}%
            </p>
          </div>
          <div className="p-2 bg-gray-800/50 rounded">
            <p className="text-xs text-gray-500">Всего ополчений</p>
            <p className={`text-lg font-bold ${totalMilitias > 5 ? 'text-red-400' : totalMilitias > 2 ? 'text-yellow-400' : 'text-green-400'}`}>
              {totalMilitias}
            </p>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="px-4 py-2 flex gap-2 border-b border-gray-800 bg-gray-900/30">
        {criticalRegions.length > 0 && (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded animate-pulse">
            🔴 {criticalRegions.length} критических
          </span>
        )}
        {warningRegions.length > 0 && (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
            🟡 {warningRegions.length} под угрозой
          </span>
        )}
        {stableRegions.length > 0 && (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
            🟢 {stableRegions.length} стабильных
          </span>
        )}
      </div>

      {/* Regions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Critical Regions First */}
        {criticalRegions.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs text-red-400 font-semibold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              КРИТИЧЕСКИЕ РЕГИОНЫ
            </h3>
            <div className="space-y-3">
              {criticalRegions.map(region => (
                <RegionCard key={region.id} region={region} />
              ))}
            </div>
          </div>
        )}

        {/* Warning Regions */}
        {warningRegions.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs text-yellow-400 font-semibold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full" />
              ПОД УГРОЗОЙ
            </h3>
            <div className="space-y-3">
              {warningRegions.map(region => (
                <RegionCard key={region.id} region={region} />
              ))}
            </div>
          </div>
        )}

        {/* Stable Regions */}
        {stableRegions.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs text-green-400 font-semibold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              СТАБИЛЬНЫЕ
            </h3>
            <div className="space-y-3">
              {stableRegions.map(region => (
                <RegionCard key={region.id} region={region} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="p-4 border-t border-gray-800 bg-gray-900/50">
        <p className="text-xs text-gray-500 text-center">
          Нажмите на регион для выбора, затем выберите инициативу справа
        </p>
      </div>
    </div>
  );
};

export default RegionsPanel;
