import React, { useState } from 'react';
import InitiativeCard from './InitiativeCard';
import { useGame, ALL_INITIATIVES, Initiative } from '../context/GameContext';

const InitiativesPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'civil' | 'social' | 'diplomatic' | 'military'>('civil');
  const { state, getSelectedRegion, activateEmergencyState, cancelEmergencyState } = useGame();
  const selectedRegion = getSelectedRegion();

  // Group initiatives by category
  const civilInitiatives = ALL_INITIATIVES.filter(i => i.category === 'civil');
  const socialInitiatives = ALL_INITIATIVES.filter(i => i.category === 'social');
  const diplomaticInitiatives = ALL_INITIATIVES.filter(i => i.category === 'diplomatic');
  const militaryInitiatives = ALL_INITIATIVES.filter(i => i.category === 'military');

  const tabs = [
    { id: 'civil' as const, name: 'Гражданские', color: 'blue', count: civilInitiatives.length, icon: '🏗️' },
    { id: 'social' as const, name: 'Социальные', color: 'purple', count: socialInitiatives.length, icon: '🎉' },
    { id: 'diplomatic' as const, name: 'Дипломатия', color: 'yellow', count: diplomaticInitiatives.length, icon: '🤝' },
    { id: 'military' as const, name: 'Военные', color: 'red', count: militaryInitiatives.length, icon: '⚔️' },
  ];

  const getInitiatives = (): Initiative[] => {
    switch (activeTab) {
      case 'civil': return civilInitiatives;
      case 'social': return socialInitiatives;
      case 'diplomatic': return diplomaticInitiatives;
      case 'military': return militaryInitiatives;
      default: return [];
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case 'civil': return 'Инфраструктурные проекты: орошение, каналы, опреснение';
      case 'social': return 'Снижение напряжения: праздники, субсидии, пропаганда, награды';
      case 'diplomatic': return 'Международные соглашения и переговоры';
      case 'military': return '⚠️ Высокий риск войны и санкций';
      default: return '';
    }
  };

  const activeCount = state.activeInitiatives.filter(i => !i.completed).length;
  const completedCount = state.completedInitiatives.length;

  // Convert GameContext initiative to InitiativeCard format
  // ВАЖНО: передаём requirements правильно!
  const convertInitiative = (init: Initiative) => ({
    id: init.id,
    name: init.name,
    nameRu: init.nameRu,
    description: init.hiddenEffects || getDefaultDescription(init),
    cost: init.cost,
    costUnit: init.isRecurring ? 'млн $/год' : 'млн $',
    duration: init.duration,
    category: init.category,
    effects: init.effects,
    hiddenEffects: init.hiddenEffects,
    requirements: init.requirements, // Массив требований
    requires: init.requirements && init.requirements.length > 0 ? init.requirements[0] : undefined, // Для совместимости
    requiresRegion: ['civil', 'social'].includes(init.category) && !init.id.includes('monitoring') && !init.id.includes('tv_broadcast'),
    level: init.level,
    maxLevel: init.maxLevel,
    maintenanceCost: init.maintenanceCost,
    isRecurring: init.isRecurring,
    recurringCost: init.recurringCost,
  });

  // Генерируем описание для инициатив
  const getDefaultDescription = (init: Initiative): string => {
    const descriptions: Record<string, string> = {
      'drip_irrigation_1': 'Установка систем капельного орошения в регионе. Снижает расход воды на 30-40%.',
      'drip_irrigation_2': 'Израильские технологии орошения. Максимальная эффективность использования воды.',
      'laser_leveling': 'Выравнивание полей лазером для равномерного распределения воды.',
      'canal_lining': 'Облицовка каналов бетоном для предотвращения потерь воды на фильтрацию.',
      'wetland_restoration_1': 'Восстановление естественных водно-болотных угодий.',
      'wetland_restoration_2': 'Масштабное восстановление экосистем для улучшения качества воды.',
      'virtual_water_import': 'Импорт зерна вместо выращивания — экономия воды.',
      'population_resettlement': 'Переселение населения из засушливых регионов.',
      'small_desalination': 'Строительство 10 малых опреснительных установок.',
      'large_desalination': 'Крупнейший опреснительный завод в регионе.',
      
      'public_fountains': 'Строительство фонтанов и парков в столице региона. Поднимает настроение.',
      'water_trucks': 'Бесплатная раздача воды по деревням автоцистернами.',
      'river_day': 'Народный праздник с бесплатной водой и едой.',
      'public_pools': 'Строительство бассейнов и аквапарков для населения.',
      'tv_broadcast': 'Прямая трансляция заполнения плотины по национальному ТВ.',
      'propaganda_1': 'Билборды «Мы контролируем воду» по всей стране.',
      'propaganda_2': 'Массовая раздача листовок и брошюр о водной политике.',
      'propaganda_3': 'Радиопрограммы о достижениях в водном хозяйстве.',
      'propaganda_4': 'ТВ-программы и документальные фильмы.',
      'propaganda_5': 'Полнометражный блокбастер о строительстве плотины.',
      
      'joint_monitoring_1': 'Начало совместного мониторинга речного стока.',
      'joint_monitoring_2': 'Обмен данными о водных ресурсах.',
      'joint_monitoring_3': 'Совместные исследования и прогнозы.',
      'joint_monitoring_4': 'Полная прозрачность данных между странами.',
      'ecosystem_payments': 'Ежегодные платежи верхней стране за сохранение экосистем.',
      'international_arbitration': 'Подача дела в Международный суд в Гааге.',
      'secret_agreement': 'Секретное соглашение с соседней страной.',
      
      'infrastructure_guard_1': 'Базовая охрана плотин и каналов.',
      'infrastructure_guard_2': 'Вооружённая охрана с патрулями.',
      'infrastructure_guard_3': 'Спецназ и противодиверсионные подразделения.',
      'emergency_state': 'Введение чрезвычайного положения в регионе.',
      'cyber_attack': 'Кибератака на системы управления плотиной врага.',
      'sabotage': 'Диверсионная операция против инфраструктуры врага.',
      'full_river_cutoff': 'Полное перекрытие реки для нижних стран.',
    };
    
    return descriptions[init.id] || `${init.nameRu} - стратегическая инициатива.`;
  };

  return (
    <div className="h-full flex flex-col bg-[#0F1117]">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-[#E8E7E4]">Инициативы</h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
              {activeCount} активных
            </span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
              {completedCount} завершено
            </span>
          </div>
        </div>

        {/* Selected Region Indicator */}
        {selectedRegion ? (
          <div className="p-2 bg-[#FFB74D]/20 border border-[#FFB74D]/50 rounded text-sm">
            <span className="text-[#FFB74D]">Выбран: </span>
            <span className="text-white font-semibold">{selectedRegion.nameRu}</span>
            {selectedRegion.hasEmergency && (
              <span className="ml-2 text-red-400 animate-pulse">⚠️ ЧП</span>
            )}
          </div>
        ) : (
          <div className="p-2 bg-gray-800/50 border border-gray-700 rounded text-sm text-gray-400">
            ← Выберите регион для региональных инициатив
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-2 px-3 text-xs font-medium transition-all relative whitespace-nowrap
              ${activeTab === tab.id 
                ? `text-white bg-gray-800` 
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
              }
            `}
            style={{
              borderBottom: activeTab === tab.id 
                ? `2px solid ${tab.color === 'blue' ? '#3b82f6' : tab.color === 'purple' ? '#a855f7' : tab.color === 'yellow' ? '#eab308' : '#ef4444'}` 
                : 'none'
            }}
          >
            <span className="mr-1">{tab.icon}</span>
            <span>{tab.name}</span>
            <span className="ml-1 opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Tab Description */}
      <div className="px-4 py-2 bg-gray-900/50 border-b border-gray-800">
        <p className="text-xs text-gray-500">{getTabDescription()}</p>
      </div>

      {/* Emergency State Controls for Military tab */}
      {activeTab === 'military' && selectedRegion && (
        <div className="p-3 border-b border-gray-800 bg-red-900/20">
          {state.emergencyState.isActive ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-400">
                  ⚠️ ЧП активно в {state.regions.find(r => r.id === state.emergencyState.regionId)?.nameRu}
                </span>
                <span className="text-xs text-gray-400">
                  {state.emergencyState.monthsActive} мес
                </span>
              </div>
              <button
                onClick={cancelEmergencyState}
                className="w-full py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded font-bold"
              >
                ОТМЕНИТЬ ЧП
              </button>
            </div>
          ) : (
            <button
              onClick={() => selectedRegion && activateEmergencyState(selectedRegion.id)}
              className="w-full py-2 bg-red-800 hover:bg-red-700 text-white text-sm rounded"
            >
              ⚠️ Ввести ЧП в {selectedRegion.nameRu}
            </button>
          )}
        </div>
      )}

      {/* Initiatives List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {getInitiatives().map(initiative => {
          const converted = convertInitiative(initiative);
          
          return (
            <InitiativeCard 
              key={initiative.id}
              initiative={converted}
            />
          );
        })}
      </div>

      {/* Budget Info */}
      <div className="p-3 border-t border-gray-800 bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">Бюджет:</span>
            <span className={`ml-2 font-bold ${state.budget > 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${state.budget.toFixed(1)}B
            </span>
          </div>
          {state.budgetBreakdown.deficit > 0 && (
            <span className="text-xs text-red-400 animate-pulse">
              Дефицит: ${state.budgetBreakdown.deficit.toFixed(2)}B/мес
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitiativesPanel;
