import React from 'react';
import { Region, useGame } from '../context/GameContext';

// Try to import tutorial context
let useTutorialSafe: () => { isActive: boolean; completeAction: (action: string, target?: string) => void; requiredTarget: string | null } | null;
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

interface RegionCardProps {
  region: Region;
}

const RegionCard: React.FC<RegionCardProps> = ({ region }) => {
  const { state, selectRegion } = useGame();
  const tutorial = useTutorialSafe ? useTutorialSafe() : null;
  const isSelected = state.selectedRegionId === region.id;
  const isCritical = region.socialTension > 85;
  const hasActiveInitiatives = region.activeInitiatives.length > 0;
  
  // Check if this region is the tutorial target
  const isTutorialTarget = tutorial?.isActive && (
    tutorial.requiredTarget === region.id ||
    tutorial.requiredTarget === `region-${region.id}` ||
    tutorial.requiredTarget?.toLowerCase() === region.name.toLowerCase()
  );

  const getStatusColor = (value: number, inverse: boolean = false) => {
    const effectiveValue = inverse ? 100 - value : value;
    if (effectiveValue > 70) return 'text-red-500';
    if (effectiveValue > 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProgressColor = (value: number, inverse: boolean = false) => {
    const effectiveValue = inverse ? 100 - value : value;
    if (effectiveValue > 70) return 'bg-red-500';
    if (effectiveValue > 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleClick = () => {
    selectRegion(isSelected ? null : region.id);
    
    // Complete tutorial action
    if (tutorial?.isActive) {
      tutorial.completeAction('select_region', region.id);
      tutorial.completeAction('select_region', region.name.toLowerCase());
      tutorial.completeAction('click', `region-${region.id}`);
      tutorial.completeAction('any_click', 'region-card');
    }
  };

  return (
    <div
      id={`region-${region.id}`}
      data-tutorial={`region-${region.id}`}
      onClick={handleClick}
      className={`
        relative p-4 rounded-lg cursor-pointer transition-all duration-300 transform
        ${isSelected 
          ? 'bg-[#1a1d27] ring-2 ring-[#FFB74D] scale-[1.02]' 
          : 'bg-[#12141a] hover:bg-[#1a1d27] hover:scale-[1.01]'
        }
        ${isCritical ? 'animate-pulse-critical' : ''}
        ${isTutorialTarget ? 'ring-2 ring-yellow-400 animate-pulse' : ''}
      `}
    >
      {/* Tutorial indicator */}
      {isTutorialTarget && (
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
      )}

      {/* Active initiatives badge */}
      {hasActiveInitiatives && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          {region.activeInitiatives.length} активных
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-[#E8E7E4]">{region.name}</h3>
          <p className="text-xs text-gray-500">{region.nameRu}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Население</p>
          <p className="text-sm font-medium text-[#E8E7E4]">{region.population}M</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div 
        id="region-card-stats"
        data-tutorial="region-card"
        className="grid grid-cols-2 gap-3"
      >
        {/* Water Stress */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">💧</span>
            <span className="text-xs text-gray-400">Водный стресс</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getProgressColor(region.waterStress)}`}
                style={{ width: `${region.waterStress}%` }}
              />
            </div>
            <span className={`text-sm font-bold ${getStatusColor(region.waterStress)}`}>
              {Math.round(region.waterStress)}%
            </span>
          </div>
        </div>

        {/* Social Tension */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <span className="text-xs text-gray-400">Напряжение</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getProgressColor(region.socialTension)}`}
                style={{ width: `${region.socialTension}%` }}
              />
            </div>
            <span className={`text-sm font-bold ${getStatusColor(region.socialTension)}`}>
              {Math.round(region.socialTension)}%
            </span>
          </div>
        </div>

        {/* Trust in Government */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">❤️</span>
            <span className="text-xs text-gray-400">Доверие</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getProgressColor(region.trustInGov, true)}`}
                style={{ width: `${region.trustInGov}%` }}
              />
            </div>
            <span className={`text-sm font-bold ${getStatusColor(region.trustInGov, true)}`}>
              {Math.round(region.trustInGov)}%
            </span>
          </div>
        </div>

        {/* Militias */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚔️</span>
            <span className="text-xs text-gray-400">Ополчения</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-4 h-4 rounded ${i < region.militias ? 'bg-red-500' : 'bg-gray-700'}`}
                />
              ))}
            </div>
            <span className={`text-sm font-bold ${region.militias > 2 ? 'text-red-500' : region.militias > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
              {region.militias}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isSelected && (
        <div className="mt-4 pt-4 border-t border-gray-700 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Сельское хозяйство</p>
              <p className="text-[#E8E7E4] font-medium">{region.agriculture}% экономики</p>
            </div>
            <div>
              <p className="text-gray-500">Рельеф</p>
              <p className="text-[#E8E7E4] font-medium">{region.isFlat ? 'Равнинный' : 'Горный'}</p>
            </div>
            <div>
              <p className="text-gray-500">Побережье</p>
              <p className="text-[#E8E7E4] font-medium">{region.isCoastal ? 'Есть выход к морю' : 'Нет'}</p>
            </div>
            <div>
              <p className="text-gray-500">Активных инициатив</p>
              <p className="text-[#E8E7E4] font-medium">{region.activeInitiatives.length}</p>
            </div>
          </div>

          {/* Region-specific warnings */}
          {region.waterStress > 80 && (
            <div className="p-2 bg-red-500/20 border border-red-500/50 rounded text-sm text-red-400">
              ⚠️ Критический водный стресс! Необходимы срочные меры.
            </div>
          )}
          {region.socialTension > 75 && (
            <div className="p-2 bg-orange-500/20 border border-orange-500/50 rounded text-sm text-orange-400">
              ⚠️ Высокое социальное напряжение. Риск беспорядков.
            </div>
          )}
          {region.militias >= 3 && (
            <div className="p-2 bg-red-500/20 border border-red-500/50 rounded text-sm text-red-400">
              ⚠️ Множественные вооружённые группировки. Риск гражданской войны!
            </div>
          )}
          {region.trustInGov < 25 && (
            <div className="p-2 bg-yellow-500/20 border border-yellow-500/50 rounded text-sm text-yellow-400">
              ⚠️ Крайне низкое доверие к власти. Инициативы будут менее эффективны.
            </div>
          )}

          <div className="text-center pt-2">
            <p className="text-xs text-[#FFB74D]">
              Выберите инициативу справа для применения к этому региону →
            </p>
          </div>
        </div>
      )}

      {/* Click hint */}
      {!isSelected && (
        <p className="text-xs text-gray-600 text-center mt-2">
          Нажмите для подробностей
        </p>
      )}
    </div>
  );
};

export default RegionCard;
