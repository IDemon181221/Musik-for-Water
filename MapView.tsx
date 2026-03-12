import React from 'react';
import { useGame } from '../context/GameContext';
import { useTutorial } from '../context/TutorialContext';
import DamControlPanel from './DamControlPanel';

const MapView: React.FC = () => {
  const { state, selectRegion, openDamPanel, closeDamPanel, setDamMode, emergencyRelease } = useGame();
  
  // Get tutorial context safely
  let tutorial: ReturnType<typeof useTutorial> | null = null;
  try {
    tutorial = useTutorial();
  } catch {
    tutorial = null;
  }
  const [showSimpleDamPanel, setShowSimpleDamPanel] = React.useState(false);
  const showDamPanel = showSimpleDamPanel; // Alias for compatibility
  const setShowDamPanel = setShowSimpleDamPanel;

  // Turkish region positions for Tigris-Euphrates tutorial
  const regionPositions: Record<string, { x: number; y: number; width: number; height: number }> = {
    gaziantep: { x: 25, y: 8, width: 18, height: 12 },
    sanliurfa: { x: 45, y: 8, width: 20, height: 12 },
    diyarbakir: { x: 50, y: 22, width: 18, height: 12 },
    mardin: { x: 55, y: 36, width: 15, height: 10 },
    adiyaman: { x: 30, y: 22, width: 15, height: 10 },
    batman: { x: 65, y: 25, width: 12, height: 10 },
    siirt: { x: 72, y: 22, width: 12, height: 10 },
    sirnak: { x: 70, y: 35, width: 12, height: 10 },
    hakkari: { x: 80, y: 30, width: 12, height: 12 },
    elazig: { x: 38, y: 35, width: 14, height: 10 },
    malatya: { x: 22, y: 35, width: 14, height: 10 },
  };

  const getRegionColor = (region: typeof state.regions[0]) => {
    const stress = Math.max(region.waterStress, region.socialTension);
    if (stress > 85) return 'fill-red-600';
    if (stress > 70) return 'fill-orange-600';
    if (stress > 50) return 'fill-yellow-600';
    return 'fill-green-700';
  };

  const selectedRegion = state.regions.find(r => r.id === state.selectedRegionId);

  // Handle dam click
  const handleDamClick = () => {
    console.log('===== DAM CLICK =====');
    console.log('Tutorial state:', { 
      active: tutorial?.isActive,
      requiredAction: tutorial?.requiredAction,
      requiredTarget: tutorial?.requiredTarget 
    });
    
    setShowDamPanel(true);
    
    // Complete tutorial action if in tutorial - use setTimeout to ensure state is ready
    if (tutorial && tutorial.isActive) {
      console.log('Calling completeAction for dam...');
      // Call with the exact target that's expected
      setTimeout(() => {
        tutorial.completeAction('click', 'dam-ataturk');
      }, 50);
      setTimeout(() => {
        tutorial.completeAction('click', 'dam');
      }, 100);
      setTimeout(() => {
        tutorial.completeAction('click', 'ataturk');
      }, 150);
    }
  };

  // Handle river click
  const handleRiverClick = () => {
    if (tutorial?.isActive) {
      tutorial.completeAction('any_click', 'map-river');
    }
  };

  // Handle region click
  const handleRegionClick = (regionId: string) => {
    selectRegion(state.selectedRegionId === regionId ? null : regionId);
    
    // Complete tutorial action
    if (tutorial?.isActive) {
      tutorial.completeAction('select_region', regionId);
      tutorial.completeAction('click', `region-${regionId}`);
    }
  };

  // Handle any click on map for tutorial
  const handleMapClick = () => {
    if (tutorial?.isActive) {
      tutorial.completeAction('any_click');
    }
  };

  // Handle Iraq area click
  const handleIraqClick = () => {
    if (tutorial?.isActive) {
      tutorial.completeAction('any_click', 'map-iraq');
    }
  };

  return (
    <div className="h-full bg-[#0F1117] relative overflow-hidden" onClick={handleMapClick}>
      {/* Map Title */}
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-xl font-bold text-[#E8E7E4]">Карта Турции — Юго-Восток</h2>
        <p className="text-xs text-gray-500">Бассейн рек Тигр и Евфрат</p>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-3">
        <p className="text-xs text-gray-400 mb-2">Уровень кризиса:</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-700 rounded" />
            <span className="text-xs text-gray-300">Стабильный (&lt;50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-600 rounded" />
            <span className="text-xs text-gray-300">Напряжённый (50-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-600 rounded" />
            <span className="text-xs text-gray-300">Опасный (70-85%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded" />
            <span className="text-xs text-gray-300">Критический (&gt;85%)</span>
          </div>
        </div>
      </div>

      {/* SVG Map */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      >
        {/* Background */}
        <rect x="0" y="0" width="100" height="100" fill="#0F1117" />

        {/* Euphrates River */}
        <path
          id="map-river"
          data-tutorial="map-river"
          d="M 10 15 Q 25 18 35 20 Q 45 22 50 28 Q 55 35 58 45 Q 60 55 58 65 Q 55 75 50 85 Q 45 95 42 100"
          stroke="#3B82F6"
          strokeWidth={2 + state.waterRelease / 10}
          fill="none"
          opacity="0.7"
          className="transition-all duration-500 cursor-pointer hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            handleRiverClick();
          }}
        />
        {/* Tigris River */}
        <path
          d="M 75 5 Q 78 15 80 25 Q 82 35 82 45 Q 80 55 78 65 Q 75 75 72 85 Q 70 95 68 100"
          stroke="#3B82F6"
          strokeWidth={1.5 + state.waterRelease / 15}
          fill="none"
          opacity="0.6"
          className="transition-all duration-500"
        />

        {/* Ataturk Dam - on Euphrates */}
        <g 
          id="dam-ataturk"
          data-tutorial="dam-ataturk"
          transform="translate(30, 18)" 
          className="cursor-pointer"
          style={{ pointerEvents: 'all' }}
          onClick={(e) => {
            e.stopPropagation();
            console.log('Dam clicked!');
            handleDamClick();
          }}
        >
          {/* Larger invisible click area */}
          <rect x="-6" y="-6" width="24" height="24" fill="transparent" className="cursor-pointer" />
          
          {/* Dam structure */}
          <rect x="0" y="0" width="12" height="6" fill="#DC2626" className="hover:fill-red-400 transition-colors cursor-pointer" rx="1" />
          <rect 
            x="0" 
            y={6 - (state.damFillLevel / 100) * 6} 
            width="12" 
            height={(state.damFillLevel / 100) * 6} 
            fill="#3B82F6" 
            rx="1"
            className="transition-all duration-500 pointer-events-none"
          />
          <text x="6" y="12" textAnchor="middle" fill="#FFB74D" fontSize="3" fontWeight="bold" className="pointer-events-none">
            ПЛОТИНА АТАТЮРКА
          </text>
          <text x="6" y="15" textAnchor="middle" fill="#E8E7E4" fontSize="2" className="pointer-events-none">
            48.7 млрд м³
          </text>
          
          {/* Highlight ring for tutorial - always visible when dam is target */}
          {tutorial?.isActive && (tutorial.requiredTarget === 'dam-ataturk' || tutorial.requiredTarget === 'dam' || tutorial.requiredTarget?.includes('dam')) && (
            <>
              <circle 
                cx="6" 
                cy="3" 
                r="14" 
                fill="none" 
                stroke="#FFB74D" 
                strokeWidth="1.5"
                opacity="0.8"
              >
                <animate attributeName="r" values="12;18;12" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle 
                cx="6" 
                cy="3" 
                r="10" 
                fill="rgba(255, 183, 77, 0.15)" 
              />
            </>
          )}
        </g>
        
        {/* Keban Dam */}
        <g transform="translate(42, 32)">
          <rect x="0" y="0" width="6" height="3" fill="#B91C1C" rx="0.5" />
          <text x="3" y="7" textAnchor="middle" fill="#666" fontSize="1.8" className="pointer-events-none">Кебан</text>
        </g>
        
        {/* Karakaya Dam */}
        <g transform="translate(35, 38)">
          <rect x="0" y="0" width="5" height="2.5" fill="#B91C1C" rx="0.5" />
          <text x="2.5" y="6" textAnchor="middle" fill="#666" fontSize="1.5" className="pointer-events-none">Каракая</text>
        </g>

        {/* Regions */}
        {state.regions.map(region => {
          const pos = regionPositions[region.id];
          if (!pos) return null;

          const isSelected = state.selectedRegionId === region.id;
          const hasMilitias = region.militias > 0;
          const isTutorialTarget = tutorial?.isActive && 
            (tutorial.requiredTarget === region.id || tutorial.requiredTarget === `region-${region.id}`);

          return (
            <g key={region.id} id={`region-${region.id}`} data-tutorial={`region-${region.id}`}>
              {/* Tutorial highlight */}
              {isTutorialTarget && (
                <rect
                  x={pos.x - 1}
                  y={pos.y - 1}
                  width={pos.width + 2}
                  height={pos.height + 2}
                  rx="2"
                  fill="none"
                  stroke="#FFB74D"
                  strokeWidth="0.8"
                  className="animate-ping"
                  opacity="0.5"
                />
              )}
              
              {/* Region Shape */}
              <rect
                x={pos.x}
                y={pos.y}
                width={pos.width}
                height={pos.height}
                rx="1"
                className={`
                  ${getRegionColor(region)} 
                  cursor-pointer transition-all duration-300
                  ${isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-90'}
                  ${region.socialTension > 85 ? 'animate-pulse' : ''}
                `}
                stroke={isSelected ? '#FFB74D' : isTutorialTarget ? '#FFB74D' : '#1f2937'}
                strokeWidth={isSelected || isTutorialTarget ? '1' : '0.3'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRegionClick(region.id);
                }}
              />

              {/* Region Name */}
              <text
                x={pos.x + pos.width / 2}
                y={pos.y + pos.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#E8E7E4"
                fontSize="2.5"
                className="pointer-events-none"
                fontWeight={isSelected ? 'bold' : 'normal'}
              >
                {region.name}
              </text>

              {/* Militia Icons */}
              {hasMilitias && (
                <g>
                  {[...Array(Math.min(region.militias, 3))].map((_, i) => (
                    <text
                      key={i}
                      x={pos.x + 2 + i * 3}
                      y={pos.y + 3}
                      fontSize="2.5"
                      className="pointer-events-none"
                    >
                      🚩
                    </text>
                  ))}
                </g>
              )}

              {/* Water Stress Indicator */}
              {region.waterStress > 75 && (
                <text
                  x={pos.x + pos.width - 2}
                  y={pos.y + 3}
                  fontSize="2.5"
                  className="pointer-events-none"
                >
                  💧
                </text>
              )}
            </g>
          );
        })}

        {/* Syria area */}
        <g>
          <rect x="5" y="50" width="35" height="20" fill="#1a1a2e" opacity="0.4" />
          <text x="22" y="62" textAnchor="middle" fill="#555" fontSize="3">СИРИЯ</text>
        </g>

        {/* Iraq area (for tutorial) */}
        <g 
          id="map-iraq" 
          data-tutorial="map-iraq"
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleIraqClick();
          }}
        >
          <rect x="20" y="72" width="60" height="28" 
            fill={state.iraqWaterStress > 85 ? '#7f1d1d' : state.iraqWaterStress > 70 ? '#1a1a2e' : '#0f2a1f'} 
            opacity={state.iraqTension > 75 ? '0.8' : '0.5'}
          >
            {state.iraqTension > 75 && (
              <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.5s" repeatCount="indefinite" />
            )}
          </rect>
          <text x="50" y="82" textAnchor="middle" fill="#aaa" fontSize="4">🇮🇶 ИРАК</text>
          <text x="50" y="87" textAnchor="middle" fill={state.iraqWaterStress > 85 ? '#ef4444' : state.iraqWaterStress > 70 ? '#f97316' : '#22c55e'} fontSize="2.5" fontWeight="bold">
            Водный стресс: {Math.round(state.iraqWaterStress)}%
          </text>
          <text x="50" y="91" textAnchor="middle" fill={state.iraqTension > 75 ? '#ef4444' : state.iraqTension > 50 ? '#f97316' : '#22c55e'} fontSize="2">
            Напряжение: {Math.round(state.iraqTension)}%
          </text>
          <text x="50" y="95" textAnchor="middle" fill={state.iraqTrust < -30 ? '#ef4444' : state.iraqTrust < 0 ? '#f97316' : '#22c55e'} fontSize="2">
            Доверие: {Math.round(state.iraqTrust)}
          </text>
          {tutorial?.isActive && tutorial.requiredTarget === 'map-iraq' && (
            <rect
              x="22"
              y="74"
              width="56"
              height="24"
              fill="none"
              stroke="#FFB74D"
              strokeWidth="0.8"
              rx="2"
            >
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
            </rect>
          )}
        </g>

        {/* Neighboring Countries Labels */}
        <text x="50" y="3" textAnchor="middle" fill="#4B5563" fontSize="2.5">ЧЕРНОЕ МОРЕ ↑</text>
        <text x="92" y="15" textAnchor="end" fill="#4B5563" fontSize="2">ГРУЗИЯ</text>
        <text x="95" y="40" textAnchor="end" fill="#4B5563" fontSize="2">ИРАН</text>
        <text x="5" y="45" textAnchor="start" fill="#4B5563" fontSize="2">СРЕДИЗЕМНОЕ</text>
        <text x="5" y="48" textAnchor="start" fill="#4B5563" fontSize="2">МОРЕ</text>
      </svg>

      {/* Dam Panel - полноэкранная панель управления */}
      {showDamPanel && !(tutorial?.isActive && tutorial.currentChapter === 3) && (
        <DamControlPanel
          dam={state.dam}
          onClose={() => {
            closeDamPanel();
            setShowDamPanel(false);
          }}
          onModeChange={setDamMode}
          currentMode={state.dam.mode}
          canUnlockOverflow={state.canUnlockOverflowMode}
          downstreamCountry="Ирак/Сирия"
          onEmergencyRelease={() => {
            emergencyRelease();
            openDamPanel();
          }}
        />
      )}

      {/* Полноценная панель для главы 3 туториала (управление плотиной) */}
      {showDamPanel && tutorial?.isActive && tutorial.currentChapter === 3 && (
        <div 
          id="dam-panel"
          data-tutorial="dam-panel"
          className="fixed inset-0 bg-black/95 z-50 flex flex-col overflow-auto"
        >
          {/* Шапка панели */}
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-[#FFB74D]/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">🏭</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#E8E7E4]">Плотина Ататюрка</h2>
                  <p className="text-gray-400">Проект GAP • Турция • Построена 1990</p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDamPanel(false);
                  if (tutorial?.isActive) {
                    tutorial.completeAction('any_click', 'dam-panel');
                  }
                }}
                className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all text-xl"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 flex p-6 gap-6 overflow-hidden">
            {/* Левая панель - Визуализация водохранилища */}
            <div className="w-1/3 flex flex-col gap-6">
              <div className="bg-gray-900/80 rounded-xl border border-gray-700 p-6 flex-1">
                <h3 className="text-lg font-bold text-[#E8E7E4] mb-4">💧 Водохранилище</h3>
                
                {/* 3D-подобная визуализация озера */}
                <div className="relative h-48 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden">
                  {/* Берега */}
                  <div className="absolute inset-x-4 top-4 bottom-12 rounded-lg border-2 border-amber-800/30 bg-gradient-to-b from-amber-900/20 to-transparent" />
                  
                  {/* Вода */}
                  <div 
                    className="absolute inset-x-8 bottom-12 rounded-b-lg transition-all duration-1000"
                    style={{ 
                      height: `${state.damFillLevel * 1.2}px`,
                      maxHeight: 'calc(100% - 60px)',
                      background: 'linear-gradient(180deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%)'
                    }}
                  >
                    {/* Волны */}
                    <div className="absolute inset-x-0 top-0 h-2 bg-white/10 animate-pulse" />
                  </div>
                  
                  {/* Плотина */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-12 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-lg border-2 border-gray-500" />
                  
                  {/* Уровень воды */}
                  <div className="absolute top-4 right-4 bg-black/60 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-400">Уровень</p>
                    <p className="text-2xl font-bold text-blue-400">{state.damFillLevel.toFixed(0)}%</p>
                  </div>
                </div>
                
                {/* Статистика */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Ёмкость</p>
                    <p className="text-xl font-bold text-blue-400">{state.dam.maxCapacity.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">млрд м³</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Текущий объём</p>
                    <p className="text-xl font-bold text-blue-400">{(state.dam.maxCapacity * state.damFillLevel / 100).toFixed(1)}</p>
                    <p className="text-xs text-gray-500">млрд м³</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Спуск воды</p>
                    <p className="text-xl font-bold text-green-400">{state.waterRelease.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">млрд м³/год</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Электричество</p>
                    <p className="text-xl font-bold text-yellow-400">+$1.4B</p>
                    <p className="text-xs text-gray-500">в год</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Правая панель - Режимы работы */}
            <div className="w-2/3 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-[#E8E7E4]">⚙️ Режимы работы плотины</h3>
              
              {/* Режим 1: Нормальный */}
              <div 
                id="dam-mode-normal"
                data-tutorial="dam-mode-normal"
                className={`bg-gray-900/80 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  state.dam.mode === 'normal' 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'border-gray-700 hover:border-blue-400'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (tutorial?.isActive) {
                    tutorial.completeAction('any_click', 'dam-mode-normal');
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-2xl">🔄</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#E8E7E4]">Нормальный режим</h4>
                      <p className="text-sm text-gray-400">48-62 млрд м³/год • +$1.4B/год</p>
                    </div>
                  </div>
                  {state.dam.mode === 'normal' && (
                    <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold">АКТИВЕН</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2 ml-16">
                  Стандартный режим работы. Сбалансированный спуск воды и выработка электроэнергии.
                </p>
              </div>

              {/* Режим 2: Максимальная выработка */}
              <div 
                id="dam-mode-max"
                data-tutorial="dam-mode-max"
                className={`bg-gray-900/80 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  state.dam.mode === 'max_power' 
                    ? 'border-green-500 shadow-lg shadow-green-500/20' 
                    : state.damFillLevel >= 50 
                      ? 'border-gray-700 hover:border-green-400' 
                      : 'border-gray-800 opacity-50 cursor-not-allowed'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (tutorial?.isActive) {
                    tutorial.completeAction('any_click', 'dam-mode-max');
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#E8E7E4]">Максимальная выработка</h4>
                      <p className="text-sm text-gray-400">62-68 млрд м³/год • +$2.2B/год</p>
                    </div>
                  </div>
                  {state.damFillLevel < 50 ? (
                    <span className="px-3 py-1 bg-gray-700 text-gray-400 rounded-full text-sm">НЕДОСТУПНО</span>
                  ) : state.dam.mode === 'max_power' ? (
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold">АКТИВЕН</span>
                  ) : null}
                </div>
                <p className="text-sm text-gray-500 mt-2 ml-16">
                  {state.damFillLevel < 50 
                    ? `⚠️ Требуется заполнение ≥50% (сейчас ${state.damFillLevel.toFixed(0)}%)`
                    : 'Больше электроэнергии за счёт увеличенного потока через турбины.'
                  }
                </p>
              </div>

              {/* Режим 3: АВАРИЙНЫЙ СБРОС */}
              <div 
                id="dam-mode-emergency"
                data-tutorial="dam-mode-emergency"
                className={`bg-gray-900/80 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  state.dam.mode === 'emergency' 
                    ? 'border-red-500 shadow-lg shadow-red-500/20 animate-pulse' 
                    : state.damFillLevel >= 90 
                      ? 'border-red-700 hover:border-red-500' 
                      : 'border-gray-800 opacity-50 cursor-not-allowed'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (tutorial?.isActive) {
                    tutorial.completeAction('any_click', 'dam-mode-emergency');
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center animate-pulse">
                      <span className="text-2xl">🚨</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-red-400">АВАРИЙНЫЙ СБРОС</h4>
                      <p className="text-sm text-red-400/70">100-140 млрд м³/сезон • НАВОДНЕНИЕ!</p>
                    </div>
                  </div>
                  {state.damFillLevel < 90 ? (
                    <span className="px-3 py-1 bg-gray-700 text-gray-400 rounded-full text-sm">НЕДОСТУПНО</span>
                  ) : state.dam.mode === 'emergency' ? (
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold animate-pulse">АКТИВЕН!</span>
                  ) : null}
                </div>
                <div className="mt-3 ml-16 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                  <p className="text-sm text-red-400 font-bold mb-1">⚠️ ВНИМАНИЕ: Серьёзные последствия!</p>
                  <ul className="text-xs text-red-400/70 list-disc list-inside space-y-1">
                    <li>Наводнение в Сирии и Ираке</li>
                    <li>Уровень озера падает до 15-30 млрд м³</li>
                    <li>Требуется ДВОЙНОЕ подтверждение</li>
                    <li>Вероятность войны снижается на 5 лет</li>
                  </ul>
                </div>
                {state.damFillLevel < 90 && (
                  <p className="text-sm text-gray-500 mt-2 ml-16">
                    ⚠️ Требуется заполнение ≥90% (сейчас {state.damFillLevel.toFixed(0)}%)
                  </p>
                )}
              </div>

              {/* Режим 4: Переполнение (секретный) */}
              <div 
                id="dam-mode-overflow"
                data-tutorial="dam-mode-overflow"
                className={`bg-gray-900/80 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  state.dam.mode === 'overflow' 
                    ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' 
                    : state.canUnlockOverflowMode 
                      ? 'border-yellow-700 hover:border-yellow-400' 
                      : 'border-gray-800 opacity-40 cursor-not-allowed'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (tutorial?.isActive) {
                    tutorial.completeAction('any_click', 'dam-mode-overflow');
                    tutorial.completeAction('any_click', 'dam-panel');
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-yellow-400">Режим переполнения</h4>
                      <p className="text-sm text-yellow-400/70">68-74 млрд м³/год • -$1.4B/год • 🔒 СЕКРЕТНЫЙ</p>
                    </div>
                  </div>
                  {!state.canUnlockOverflowMode ? (
                    <span className="px-3 py-1 bg-gray-700 text-gray-400 rounded-full text-sm">ЗАБЛОКИРОВАН</span>
                  ) : state.dam.mode === 'overflow' ? (
                    <span className="px-3 py-1 bg-yellow-500 text-black rounded-full text-sm font-bold">АКТИВЕН</span>
                  ) : null}
                </div>
                <div className="mt-3 ml-16 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                  <p className="text-sm text-yellow-400/80 font-bold mb-1">🏆 "Вода для всех. Навсегда."</p>
                  <p className="text-xs text-yellow-400/60 mb-2">Условия разблокировки:</p>
                  <ul className="text-xs text-gray-400 list-disc list-inside space-y-1">
                    <li className={state.downstreamTrust >= 60 ? 'text-green-400' : ''}>Доверие соседей ≥ +60 {state.downstreamTrust >= 60 ? '✓' : `(сейчас ${state.downstreamTrust})`}</li>
                    <li>Совместный мониторинг уровня 4 завершён</li>
                    <li>Платежи ≥ 700 млн $/год</li>
                  </ul>
                </div>
              </div>

              {/* Подсказка для туториала */}
              <div className="mt-auto p-4 bg-[#FFB74D]/10 border border-[#FFB74D]/30 rounded-xl">
                <p className="text-center text-[#FFB74D] animate-pulse">
                  👆 Нажмите на любой режим для продолжения обучения
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Простая информационная панель для других глав туториала */}
      {showDamPanel && tutorial?.isActive && tutorial.currentChapter !== 3 && (
        <div 
          id="dam-panel"
          data-tutorial="dam-panel"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/95 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FFB74D] z-30 shadow-2xl min-w-[320px]"
          onClick={(e) => {
            e.stopPropagation();
            if (tutorial?.isActive) {
              tutorial.completeAction('any_click', 'dam-panel');
            }
            setShowDamPanel(false);
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-[#E8E7E4]">🏭 Плотина Ататюрка</h3>
            <button 
              onClick={() => setShowDamPanel(false)}
              className="text-gray-500 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">Ёмкость</p>
              <p className="text-xl font-bold text-blue-400">{state.dam.maxCapacity.toFixed(1)} <span className="text-sm">млрд м³</span></p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">Заполнение</p>
              <p className="text-xl font-bold text-blue-400">{state.damFillLevel.toFixed(0)}%</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">Спуск воды</p>
              <p className="text-xl font-bold text-green-400">{state.waterRelease.toFixed(1)} <span className="text-sm">млрд м³/год</span></p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">Режим</p>
              <p className="text-lg font-bold text-yellow-400">
                {state.dam.mode === 'normal' && 'Нормальный'}
                {state.dam.mode === 'max_power' && 'Макс. выработка'}
                {state.dam.mode === 'emergency' && 'АВАРИЙНЫЙ'}
                {state.dam.mode === 'overflow' && 'Переполнение'}
              </p>
            </div>
          </div>
          
          <p className="text-sm text-[#FFB74D] text-center animate-pulse">
            👆 Нажмите для продолжения
          </p>
        </div>
      )}

      {/* Selected Region Info */}
      {selectedRegion && (
        <div 
          id="region-indicators"
          data-tutorial="region-indicators"
          className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-[#FFB74D]/50"
          onClick={(e) => {
            e.stopPropagation();
            if (tutorial?.isActive) {
              tutorial.completeAction('any_click', 'region-indicators');
            }
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-[#E8E7E4]">{selectedRegion.name}</h3>
              <p className="text-sm text-gray-400">{selectedRegion.nameRu}</p>
            </div>
            <button
              onClick={() => selectRegion(null)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-center">
            <div id="region-water-stress" data-tutorial="region-water-stress">
              <p className={`text-xl font-bold ${selectedRegion.waterStress > 70 ? 'text-red-400' : 'text-blue-400'}`}>
                {Math.round(selectedRegion.waterStress)}%
              </p>
              <p className="text-xs text-gray-500">Водный стресс</p>
            </div>
            <div id="region-tension" data-tutorial="region-tension">
              <p className={`text-xl font-bold ${selectedRegion.socialTension > 70 ? 'text-red-400' : 'text-yellow-400'}`}>
                {Math.round(selectedRegion.socialTension)}%
              </p>
              <p className="text-xs text-gray-500">Напряжение</p>
            </div>
            <div>
              <p className={`text-xl font-bold ${selectedRegion.trustInGov < 30 ? 'text-red-400' : 'text-green-400'}`}>
                {Math.round(selectedRegion.trustInGov)}%
              </p>
              <p className="text-xs text-gray-500">Доверие</p>
            </div>
            <div>
              <p className={`text-xl font-bold ${selectedRegion.militias > 2 ? 'text-red-400' : 'text-gray-400'}`}>
                {selectedRegion.militias}
              </p>
              <p className="text-xs text-gray-500">Ополчений</p>
            </div>
          </div>

          <p className="text-xs text-[#FFB74D] text-center mt-3">
            Выберите инициативу справа для применения к этому региону →
          </p>
        </div>
      )}
    </div>
  );
};

export default MapView;
