import { useState } from 'react';
import { useIndiaGame, IndiaInitiative } from '../../contexts/IndiaGameContext';

type Category = 'unique' | 'civil' | 'diplomatic' | 'military';

const CATEGORY_INFO: Record<Category, { name: string; color: string; borderColor: string }> = {
  unique: { name: 'Уникальные (Инд)', color: 'bg-purple-900/50', borderColor: 'border-purple-600' },
  civil: { name: 'Гражданские', color: 'bg-blue-900/50', borderColor: 'border-blue-600' },
  diplomatic: { name: 'Дипломатические', color: 'bg-yellow-900/50', borderColor: 'border-yellow-600' },
  military: { name: 'Военные', color: 'bg-red-900/50', borderColor: 'border-red-600' },
};

function InitiativeCard({ initiative, onActivate, canAfford, selectedRegion }: {
  initiative: IndiaInitiative;
  onActivate: () => void;
  canAfford: boolean;
  selectedRegion: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activating, setActivating] = useState(false);
  
  const categoryInfo = CATEGORY_INFO[initiative.category];
  const needsRegion = initiative.effects.waterStress !== undefined || 
                      initiative.effects.socialTension !== undefined ||
                      initiative.effects.trust !== undefined;
  const canActivate = canAfford && (!needsRegion || selectedRegion) && (!initiative.cooldown || initiative.cooldown === 0);
  
  const handleActivate = () => {
    if (!canActivate) return;
    setActivating(true);
    setTimeout(() => {
      onActivate();
      setActivating(false);
      setExpanded(false);
    }, 500);
  };
  
  return (
    <div 
      className={`rounded-lg border transition-all ${categoryInfo.color} ${categoryInfo.borderColor} ${
        expanded ? 'ring-2 ring-white/20' : ''
      }`}
    >
      <div 
        className="p-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm">{initiative.nameRu}</h3>
          {initiative.cooldown && initiative.cooldown > 0 && (
            <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">
              ⏱ {initiative.cooldown} мес.
            </span>
          )}
        </div>
        
        <p className="text-xs text-gray-400 mb-2">{initiative.descriptionRu}</p>
        
        <div className="flex gap-3 text-xs">
          <span className={`${initiative.cost > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
            💰 {initiative.cost > 0 ? `$${initiative.cost}B` : 'Бесплатно'}
          </span>
          <span className="text-gray-400">
            ⏱ {initiative.duration > 0 ? `${initiative.duration} мес.` : 'Мгновенно'}
          </span>
        </div>
      </div>
      
      {expanded && (
        <div className="px-3 pb-3 border-t border-gray-700/50 pt-2">
          {/* Effects */}
          <div className="text-xs space-y-1 mb-3">
            <div className="text-gray-500 uppercase text-[10px]">Эффекты:</div>
            {initiative.effects.waterStress && (
              <div className={initiative.effects.waterStress < 0 ? 'text-green-400' : 'text-red-400'}>
                💧 Водный стресс: {initiative.effects.waterStress > 0 ? '+' : ''}{initiative.effects.waterStress}%
              </div>
            )}
            {initiative.effects.nuclearTimer && (
              <div className={initiative.effects.nuclearTimer > 0 ? 'text-green-400' : 'text-red-400'}>
                ☢️ Ядерный таймер: {initiative.effects.nuclearTimer > 0 ? '+' : ''}{initiative.effects.nuclearTimer} дней
              </div>
            )}
            {initiative.effects.internationalPressure && (
              <div className={initiative.effects.internationalPressure < 0 ? 'text-green-400' : 'text-red-400'}>
                🌍 Давление: {initiative.effects.internationalPressure > 0 ? '+' : ''}{initiative.effects.internationalPressure}%
              </div>
            )}
            {initiative.effects.pakistanWaterLoss && (
              <div className="text-orange-400">
                🇵🇰 Пакистан теряет: {initiative.effects.pakistanWaterLoss} млрд м³
              </div>
            )}
            {initiative.effects.pakistanTension && (
              <div className="text-red-400">
                🇵🇰 Напряжение Пакистана: +{initiative.effects.pakistanTension}%
              </div>
            )}
          </div>
          
          {/* Hidden effects */}
          {initiative.hiddenEffectsRu && (
            <div className="text-xs text-red-400/80 mb-3 p-2 bg-red-900/30 rounded">
              ⚠️ {initiative.hiddenEffectsRu}
            </div>
          )}
          
          {/* Region requirement */}
          {needsRegion && !selectedRegion && (
            <div className="text-xs text-yellow-400 mb-2">
              ⚠️ Выберите регион для применения
            </div>
          )}
          
          {/* Activate button */}
          <button
            onClick={handleActivate}
            disabled={!canActivate || activating}
            className={`w-full py-2 rounded font-medium text-sm transition-all ${
              canActivate && !activating
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {activating ? (
              <span className="animate-pulse">Активация...</span>
            ) : !canAfford ? (
              'Недостаточно средств'
            ) : needsRegion && !selectedRegion ? (
              'Выберите регион'
            ) : initiative.cooldown && initiative.cooldown > 0 ? (
              'На перезарядке'
            ) : (
              'Активировать'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export function IndiaInitiativesPanel() {
  const { state, activateInitiative } = useIndiaGame();
  const [activeCategory, setActiveCategory] = useState<Category>('unique');
  
  const filteredInitiatives = state.initiatives.filter(i => i.category === activeCategory);
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Category tabs */}
      <div className="flex border-b border-gray-800">
        {(Object.keys(CATEGORY_INFO) as Category[]).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? `${CATEGORY_INFO[cat].color} border-b-2 ${CATEGORY_INFO[cat].borderColor}`
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {CATEGORY_INFO[cat].name}
          </button>
        ))}
      </div>
      
      {/* Active initiatives */}
      {state.activeInitiatives.length > 0 && (
        <div className="p-3 border-b border-gray-800 bg-green-900/20">
          <div className="text-xs text-green-400 font-medium mb-2">
            Активные ({state.activeInitiatives.length}):
          </div>
          <div className="space-y-1">
            {state.activeInitiatives.map(init => (
              <div key={init.id} className="text-xs flex justify-between">
                <span>{init.nameRu}</span>
                <span className="text-green-400">{init.monthsRemaining} мес.</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Initiative list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredInitiatives.map(initiative => (
          <InitiativeCard
            key={initiative.id}
            initiative={initiative}
            onActivate={() => activateInitiative(initiative.id, state.selectedRegion || undefined)}
            canAfford={state.budget >= initiative.cost}
            selectedRegion={state.selectedRegion}
          />
        ))}
      </div>
    </div>
  );
}
