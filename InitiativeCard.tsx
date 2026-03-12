import React, { useState } from 'react';
import { useGame, InitiativeEffects } from '../context/GameContext';

export interface Initiative {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  cost: number;
  costUnit: string;
  duration: number;
  category: 'civil' | 'diplomatic' | 'military' | 'social';
  effects: InitiativeEffects;
  hiddenEffects?: string;
  requirements?: string[]; // массив требуемых инициатив
  requires?: string; // одна требуемая инициатива (для совместимости)
  image?: string;
  requiresRegion?: boolean;
  requiresCoastal?: boolean;
  requiresFlat?: boolean;
  level?: number;
  maxLevel?: number;
  maintenanceCost?: number;
  isRecurring?: boolean;
  recurringCost?: number;
}

interface InitiativeCardProps {
  initiative: Initiative;
}

// Словарь для отображения требуемых инициатив на русском
const REQUIREMENT_NAMES: Record<string, string> = {
  'drip_irrigation_1': 'Капельное орошение уровня 1',
  'drip_irrigation_2': 'Капельное орошение уровня 2',
  'wetland_restoration_1': 'Восстановление болот уровня 1',
  'joint_monitoring_1': 'Совместный мониторинг уровня 1',
  'joint_monitoring_2': 'Совместный мониторинг уровня 2',
  'joint_monitoring_3': 'Совместный мониторинг уровня 3',
  'joint_monitoring_4': 'Совместный мониторинг уровня 4',
  'infrastructure_guard_1': 'Охрана инфраструктуры уровня 1',
  'infrastructure_guard_2': 'Охрана инфраструктуры уровня 2',
  'infrastructure_guard_3': 'Охрана инфраструктуры уровня 3',
  'propaganda_1': 'Пропаганда «Мы контролируем воду» уровня 1',
  'propaganda_2': 'Пропаганда «Мы контролируем воду» уровня 2',
  'propaganda_3': 'Пропаганда «Мы контролируем воду» уровня 3',
  'propaganda_4': 'Пропаганда «Мы контролируем воду» уровня 4',
  'celebration_subsidies_1': 'Субсидии на праздники уровня 1',
  'celebration_subsidies_2': 'Субсидии на праздники уровня 2',
  'celebration_subsidies_3': 'Субсидии на праздники уровня 3',
  'celebration_subsidies_4': 'Субсидии на праздники уровня 4',
  'water_fair_1': 'Ярмарка «Вода для всех» уровня 1',
  'water_fair_2': 'Ярмарка «Вода для всех» уровня 2',
  'water_fair_3': 'Ярмарка «Вода для всех» уровня 3',
  'water_fair_4': 'Ярмарка «Вода для всех» уровня 4',
  'temple_fountains_1': 'Храм с фонтаном уровня 1',
  'temple_fountains_2': 'Храм с фонтаном уровня 2',
  'temple_fountains_3': 'Храм с фонтаном уровня 3',
  'temple_fountains_4': 'Храм с фонтаном уровня 4',
  'national_hero_1': 'Программа «Герой нации» уровня 1',
  'national_hero_2': 'Программа «Герой нации» уровня 2',
  'national_hero_3': 'Программа «Герой нации» уровня 3',
  'small_desalination': 'Малая десалинизация',
};

const getRequirementName = (reqId: string): string => {
  return REQUIREMENT_NAMES[reqId] || reqId.replace(/_/g, ' ');
};

const InitiativeCard: React.FC<InitiativeCardProps> = ({ initiative }) => {
  const { state, activateInitiative, addNotification, getSelectedRegion } = useGame();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const selectedRegion = getSelectedRegion();
  const canAfford = state.budget >= initiative.cost / 1000;
  const hasRegionSelected = !initiative.requiresRegion || selectedRegion !== null;
  
  // Собираем все требования (из requirements[] и requires)
  const getAllRequirements = (): string[] => {
    const reqs: string[] = [];
    if (initiative.requirements) {
      reqs.push(...initiative.requirements);
    }
    if (initiative.requires) {
      reqs.push(initiative.requires);
    }
    return reqs;
  };

  // Проверяем, выполнены ли ВСЕ требования
  const getMissingRequirements = (): string[] => {
    const allReqs = getAllRequirements();
    const missing: string[] = [];
    
    for (const req of allReqs) {
      const isCompleted = state.completedInitiatives.includes(req);
      if (!isCompleted) {
        missing.push(req);
      }
    }
    
    return missing;
  };

  const missingRequirements = getMissingRequirements();
  const isLocked = missingRequirements.length > 0;
  
  const meetsRequirements = () => {
    if (isLocked) return false;
    if (!selectedRegion) return !initiative.requiresRegion;
    if (initiative.requiresCoastal && !selectedRegion.isCoastal) return false;
    if (initiative.requiresFlat && !selectedRegion.isFlat) return false;
    if (selectedRegion.activeInitiatives.includes(initiative.id)) return false;
    return true;
  };

  const canActivate = !isLocked && canAfford && hasRegionSelected && meetsRequirements();

  const getCategoryColor = () => {
    if (isLocked) return 'border-gray-600';
    switch (initiative.category) {
      case 'civil': return 'border-blue-500';
      case 'social': return 'border-purple-500';
      case 'diplomatic': return 'border-yellow-500';
      case 'military': return 'border-red-500';
      default: return 'border-gray-500';
    }
  };

  const getCategoryBg = () => {
    if (isLocked) return 'bg-gray-900/80';
    switch (initiative.category) {
      case 'civil': return 'bg-blue-500/10';
      case 'social': return 'bg-purple-500/10';
      case 'diplomatic': return 'bg-yellow-500/10';
      case 'military': return 'bg-red-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  const handleCardClick = () => {
    // Заблокированные карточки нельзя раскрывать
    if (isLocked || isActivating) return;
    setIsExpanded(!isExpanded);
  };

  const handleActivate = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Никогда не активируем заблокированные инициативы
    if (isLocked) {
      console.warn('Cannot activate locked initiative:', initiative.id);
      return;
    }
    
    if (initiative.category === 'military' && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsActivating(true);
    setShowConfirm(false);

    setTimeout(() => {
      const regionId = selectedRegion?.id || 'global';
      activateInitiative(
        initiative.id,
        regionId,
        initiative.cost,
        initiative.duration,
        initiative.effects
      );

      addNotification({
        type: initiative.category === 'military' ? 'warning' : 'success',
        title: 'Инициатива активирована',
        message: `${initiative.nameRu} ${selectedRegion ? `в регионе ${selectedRegion.nameRu}` : ''}`,
      });

      setIsActivating(false);
      setIsExpanded(false);
    }, 1500);
  };

  const formatCost = (cost: number) => {
    if (cost >= 1000) {
      return `${(cost / 1000).toFixed(1)} млрд $`;
    }
    return `${cost} млн $`;
  };

  const formatDuration = (months: number) => {
    if (months === 0) return 'Мгновенно';
    if (months < 12) return `${months} мес.`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}`;
    return `${years} г. ${remainingMonths} мес.`;
  };

  const renderEffects = () => {
    const effects = initiative.effects;
    const items = [];

    if (effects.waterStress) {
      items.push(
        <div key="water" className={`flex items-center gap-2 ${effects.waterStress < 0 ? 'text-green-400' : 'text-red-400'}`}>
          <span>💧</span>
          <span>{effects.waterStress > 0 ? '+' : ''}{effects.waterStress}% водный стресс</span>
        </div>
      );
    }
    if (effects.socialTension) {
      items.push(
        <div key="tension" className={`flex items-center gap-2 ${effects.socialTension < 0 ? 'text-green-400' : 'text-red-400'}`}>
          <span>🔥</span>
          <span>{effects.socialTension > 0 ? '+' : ''}{effects.socialTension}% напряжение</span>
        </div>
      );
    }
    if (effects.trustInGov) {
      items.push(
        <div key="trust" className={`flex items-center gap-2 ${effects.trustInGov > 0 ? 'text-green-400' : 'text-red-400'}`}>
          <span>❤️</span>
          <span>{effects.trustInGov > 0 ? '+' : ''}{effects.trustInGov}% доверие</span>
        </div>
      );
    }
    if (effects.internationalPressure) {
      items.push(
        <div key="pressure" className={`flex items-center gap-2 ${effects.internationalPressure < 0 ? 'text-green-400' : 'text-red-400'}`}>
          <span>🌍</span>
          <span>{effects.internationalPressure > 0 ? '+' : ''}{effects.internationalPressure} межд. давление</span>
        </div>
      );
    }
    if (effects.militias) {
      items.push(
        <div key="militias" className={`flex items-center gap-2 ${effects.militias < 0 ? 'text-green-400' : 'text-red-400'}`}>
          <span>⚔️</span>
          <span>{effects.militias > 0 ? '+' : ''}{effects.militias} ополчений</span>
        </div>
      );
    }

    return items;
  };

  return (
    <div
      className={`
        relative rounded-lg overflow-hidden transition-all duration-300 border-l-4
        ${getCategoryColor()} ${getCategoryBg()}
        ${isActivating ? 'animate-shimmer' : ''}
        ${isExpanded ? 'ring-2 ring-white/20' : ''}
      `}
    >
      {/* LOCKED OVERLAY - Полностью блокирует карточку */}
      {isLocked && (
        <div 
          className="absolute inset-0 z-20 bg-black/60 flex flex-col items-center justify-center cursor-not-allowed"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-red-900/90 px-4 py-2 rounded-lg border-2 border-red-500 mb-2">
            <p className="text-red-200 text-sm font-bold flex items-center gap-2">
              <span className="text-lg">🔒</span>
              <span>ЗАБЛОКИРОВАНО</span>
            </p>
          </div>
          <div className="bg-black/80 px-3 py-2 rounded max-w-[90%]">
            <p className="text-yellow-400 text-xs text-center font-medium">
              ⚠️ Сначала нужно купить:
            </p>
            {missingRequirements.map((req, idx) => (
              <p key={idx} className="text-white text-xs text-center mt-1 font-bold">
                {getRequirementName(req)}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Main Card Content */}
      <div 
        className={`p-4 ${isLocked ? 'opacity-40' : 'cursor-pointer hover:bg-white/5'}`}
        onClick={handleCardClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className={`font-semibold text-sm leading-tight ${isLocked ? 'text-gray-500' : 'text-[#E8E7E4]'}`}>
              {initiative.nameRu}
              {initiative.level && (
                <span className="ml-2 text-xs bg-white/10 px-1.5 py-0.5 rounded">
                  Ур. {initiative.level}
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{initiative.name}</p>
          </div>
          <div className="text-right">
            <p className={`text-sm font-bold ${isLocked ? 'text-gray-500' : canAfford ? 'text-green-400' : 'text-red-400'}`}>
              {formatCost(initiative.cost)}
            </p>
            <p className="text-xs text-gray-500">{formatDuration(initiative.duration)}</p>
          </div>
        </div>

        {/* Description */}
        <p className={`text-xs mb-3 line-clamp-2 ${isLocked ? 'text-gray-600' : 'text-gray-400'}`}>
          {initiative.description}
        </p>

        {/* Quick Effects */}
        <div className={`flex flex-wrap gap-2 text-xs ${isLocked ? 'opacity-30' : ''}`}>
          {renderEffects().slice(0, 2)}
        </div>

        {!isExpanded && !isLocked && (
          <p className="text-xs text-gray-600 text-center mt-2">
            Нажмите для подробностей
          </p>
        )}
      </div>

      {/* Expanded Content - ONLY if NOT locked */}
      {isExpanded && !isLocked && (
        <div className="px-4 pb-4 space-y-3 animate-fadeIn border-t border-white/10 pt-3">
          {/* All Effects */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Эффекты:</p>
            <div className="space-y-1 text-xs">
              {renderEffects()}
            </div>
          </div>

          {/* Hidden Effects */}
          {initiative.hiddenEffects && (
            <div className="p-2 bg-red-500/10 border border-red-500/30 rounded">
              <p className="text-xs text-red-400 flex items-start gap-2">
                <span>🔒</span>
                <span><strong>Скрытый эффект:</strong> {initiative.hiddenEffects}</span>
              </p>
            </div>
          )}

          {/* Maintenance Cost */}
          {initiative.maintenanceCost && (
            <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
              <p className="text-xs text-yellow-400 flex items-start gap-2">
                <span>🔧</span>
                <span><strong>Эксплуатация:</strong> ${initiative.maintenanceCost} млн/год навсегда</span>
              </p>
            </div>
          )}

          {/* Recurring Cost */}
          {initiative.isRecurring && initiative.recurringCost && (
            <div className="p-2 bg-orange-500/10 border border-orange-500/30 rounded">
              <p className="text-xs text-orange-400 flex items-start gap-2">
                <span>🔄</span>
                <span><strong>Повторяющиеся расходы:</strong> ${initiative.recurringCost} млн/год</span>
              </p>
            </div>
          )}

          {/* Region Selection Warning */}
          {initiative.requiresRegion && !selectedRegion && (
            <div className="p-2 bg-yellow-500/20 border border-yellow-500/50 rounded">
              <p className="text-xs text-yellow-400">
                ← Выберите регион слева для активации этой инициативы
              </p>
            </div>
          )}

          {/* Region Requirement Warnings */}
          {selectedRegion && initiative.requiresCoastal && !selectedRegion.isCoastal && (
            <div className="p-2 bg-red-500/20 border border-red-500/50 rounded">
              <p className="text-xs text-red-400">
                ❌ Требуется прибрежный регион. {selectedRegion.nameRu} не имеет выхода к морю.
              </p>
            </div>
          )}

          {selectedRegion && initiative.requiresFlat && !selectedRegion.isFlat && (
            <div className="p-2 bg-yellow-500/20 border border-yellow-500/50 rounded">
              <p className="text-xs text-yellow-400">
                ⚠️ Эффективность снижена на 70% в горном регионе {selectedRegion.nameRu}
              </p>
            </div>
          )}

          {selectedRegion?.activeInitiatives.includes(initiative.id) && (
            <div className="p-2 bg-blue-500/20 border border-blue-500/50 rounded">
              <p className="text-xs text-blue-400">
                ✓ Уже активировано в регионе {selectedRegion.nameRu}
              </p>
            </div>
          )}

          {/* Military Confirmation */}
          {showConfirm && initiative.category === 'military' && (
            <div className="p-3 bg-red-500/30 border border-red-500 rounded animate-pulse">
              <p className="text-sm text-red-400 font-bold mb-2">
                ⚠️ ПРЕДУПРЕЖДЕНИЕ
              </p>
              <p className="text-xs text-red-300 mb-3">
                Это действие может привести к войне, международным санкциям или гибели людей. Вы уверены?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleActivate}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition-colors"
                >
                  ПОДТВЕРДИТЬ
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
                  className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Activate Button - NEVER shown for locked initiatives */}
          {!showConfirm && (
            <button
              onClick={handleActivate}
              disabled={!canActivate || isActivating}
              className={`
                w-full py-3 rounded font-bold text-sm transition-all duration-300
                ${canActivate
                  ? initiative.category === 'military'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }
                ${isActivating ? 'animate-pulse' : ''}
              `}
            >
              {isActivating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Активация...
                </span>
              ) : !canAfford ? (
                'Недостаточно средств'
              ) : !hasRegionSelected ? (
                'Выберите регион'
              ) : selectedRegion?.activeInitiatives.includes(initiative.id) ? (
                'Уже активировано'
              ) : !meetsRequirements() ? (
                'Требования не выполнены'
              ) : selectedRegion ? (
                `Активировать в ${selectedRegion.nameRu}`
              ) : (
                'Активировать'
              )}
            </button>
          )}
        </div>
      )}

      {/* Activating Overlay */}
      {isActivating && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-white text-sm">Запуск инициативы...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InitiativeCard;
