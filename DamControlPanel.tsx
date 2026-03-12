import React, { useState, useEffect } from 'react';

export interface DamData {
  id: string;
  name: string;
  nameLocal: string;
  country: string;
  river: string;
  maxCapacity: number; // млрд м³
  currentLevel: number; // млрд м³
  currentFlow: number; // млрд м³/год
  powerGeneration: number; // млрд $/год
  photoUrl?: string;
  turbineCount: number;
}

export type DamMode = 'normal' | 'max_power' | 'emergency' | 'overflow';

interface DamControlPanelProps {
  dam: DamData;
  onClose: () => void;
  onModeChange: (mode: DamMode) => void;
  currentMode: DamMode;
  canUnlockOverflow: boolean; // Условия для режима переполнения
  downstreamCountry: string;
  onEmergencyRelease: () => void;
}

export const DamControlPanel: React.FC<DamControlPanelProps> = ({
  dam,
  onClose,
  onModeChange,
  currentMode,
  canUnlockOverflow,
  downstreamCountry,
  onEmergencyRelease
}) => {
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [emergencyClickCount, setEmergencyClickCount] = useState(0);
  const [isReleasing, setIsReleasing] = useState(false);
  const [waterAnimation, setWaterAnimation] = useState(0);

  // Анимация уровня воды
  useEffect(() => {
    const interval = setInterval(() => {
      setWaterAnimation(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const fillPercentage = (dam.currentLevel / dam.maxCapacity) * 100;
  const canEmergencyRelease = fillPercentage >= 90;
  const canMaxPower = fillPercentage >= 50;

  const handleEmergencyClick = () => {
    if (emergencyClickCount === 0) {
      setShowEmergencyConfirm(true);
      setEmergencyClickCount(1);
    } else if (emergencyClickCount === 1) {
      // Второй клик - активация
      setIsReleasing(true);
      setTimeout(() => {
        onEmergencyRelease();
        onModeChange('emergency');
        setIsReleasing(false);
        setShowEmergencyConfirm(false);
        setEmergencyClickCount(0);
      }, 12000); // 12 секунд анимации
    }
  };

  const handleModeSelect = (mode: DamMode) => {
    if (mode === 'emergency') {
      handleEmergencyClick();
    } else if (mode === 'max_power' && !canMaxPower) {
      return; // Недоступно
    } else if (mode === 'overflow' && !canUnlockOverflow) {
      return; // Недоступно
    } else {
      onModeChange(mode);
    }
  };

  // Режимы описаны непосредственно в кнопках для гибкости
  const _canMaxPower = canMaxPower;
  const _canEmergencyRelease = canEmergencyRelease;
  const _canUnlockOverflow = canUnlockOverflow;
  void _canMaxPower;
  void _canEmergencyRelease;
  void _canUnlockOverflow;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Фон - фото плотины с анимированным уровнем воды */}
      <div className="absolute inset-0">
        {/* Градиент неба */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900" />
        
        {/* Плотина (SVG представление) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          {/* Горы на заднем плане */}
          <path d="M0 400 L300 200 L600 350 L900 150 L1200 300 L1500 180 L1800 320 L1920 250 L1920 1080 L0 1080 Z" 
                fill="#1e293b" />
          
          {/* Тело плотины */}
          <rect x="700" y="300" width="520" height="500" fill="#374151" />
          <rect x="720" y="320" width="480" height="460" fill="#4b5563" />
          
          {/* Турбины */}
          {Array.from({ length: dam.turbineCount }).map((_, i) => (
            <g key={i} transform={`translate(${750 + i * 40}, 700)`}>
              <rect 
                x="0" y="0" width="30" height="60" 
                fill={isReleasing ? '#60a5fa' : '#1f2937'}
                className={isReleasing ? 'animate-pulse' : ''}
              />
              {isReleasing && (
                <rect x="5" y="60" width="20" height="100" fill="#3b82f6" opacity="0.8">
                  <animate attributeName="height" values="100;150;100" dur="0.5s" repeatCount="indefinite" />
                </rect>
              )}
            </g>
          ))}
          
          {/* Водохранилище */}
          <path 
            d={`M0 ${800 - fillPercentage * 4} 
                Q 350 ${780 - fillPercentage * 4 + Math.sin(waterAnimation * 0.1) * 10} 700 ${800 - fillPercentage * 4}
                L700 800 L0 800 Z`}
            fill="#1e40af"
            opacity="0.9"
          >
            <animate 
              attributeName="d" 
              values={`M0 ${800 - fillPercentage * 4} Q 350 ${780 - fillPercentage * 4} 700 ${800 - fillPercentage * 4} L700 800 L0 800 Z;
                       M0 ${800 - fillPercentage * 4} Q 350 ${820 - fillPercentage * 4} 700 ${800 - fillPercentage * 4} L700 800 L0 800 Z;
                       M0 ${800 - fillPercentage * 4} Q 350 ${780 - fillPercentage * 4} 700 ${800 - fillPercentage * 4} L700 800 L0 800 Z`}
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
          
          {/* Река ниже плотины */}
          <path 
            d={`M1220 800 Q 1400 850 1600 820 Q 1800 790 1920 830 L1920 1080 L1220 1080 Z`}
            fill={isReleasing ? '#2563eb' : '#1e3a8a'}
            opacity="0.8"
          >
            {isReleasing && (
              <animate 
                attributeName="d" 
                values="M1220 800 Q 1400 850 1600 820 Q 1800 790 1920 830 L1920 1080 L1220 1080 Z;
                        M1220 750 Q 1400 800 1600 770 Q 1800 740 1920 780 L1920 1080 L1220 1080 Z;
                        M1220 800 Q 1400 850 1600 820 Q 1800 790 1920 830 L1920 1080 L1220 1080 Z"
                dur="1s"
                repeatCount="indefinite"
              />
            )}
          </path>
        </svg>
      </div>

      {/* Затемнение для читаемости */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Кнопка закрытия */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 
                   rounded-full flex items-center justify-center transition-all"
      >
        <span className="text-white text-2xl">✕</span>
      </button>

      {/* Заголовок */}
      <div className="absolute top-6 left-6 z-40">
        <h1 className="text-4xl font-bold text-white mb-2">{dam.name}</h1>
        <p className="text-xl text-white/70">{dam.nameLocal} • {dam.river}</p>
        <p className="text-lg text-white/50">{dam.country}</p>
      </div>

      {/* Левая панель - 3D модель озера */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40 w-80">
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <h3 className="text-white/70 text-sm mb-4">ВОДОХРАНИЛИЩЕ</h3>
          
          {/* 3D визуализация озера */}
          <div className="relative h-64 mb-4">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Контур озера */}
              <ellipse cx="100" cy="150" rx="80" ry="30" fill="#1e3a8a" opacity="0.3" />
              
              {/* Вода */}
              <ellipse 
                cx="100" 
                cy={150 - fillPercentage * 0.8} 
                rx={70 + fillPercentage * 0.1} 
                ry={25 + fillPercentage * 0.05} 
                fill="#3b82f6"
              >
                <animate 
                  attributeName="ry" 
                  values={`${25 + fillPercentage * 0.05};${27 + fillPercentage * 0.05};${25 + fillPercentage * 0.05}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              </ellipse>
              
              {/* Линии уровня */}
              {[25, 50, 75, 100].map(level => (
                <line 
                  key={level}
                  x1="20" y1={150 - level * 0.8} 
                  x2="30" y2={150 - level * 0.8}
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.5"
                />
              ))}
            </svg>
            
            {/* Процент заполнения */}
            <div className="absolute top-4 right-4 text-right">
              <div className="text-4xl font-bold text-white">
                {fillPercentage.toFixed(0)}%
              </div>
              <div className="text-sm text-white/60">заполнено</div>
            </div>
          </div>

          {/* Объём */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {dam.currentLevel.toFixed(1)}
              </div>
              <div className="text-xs text-white/60">млрд м³ сейчас</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white/70">
                {dam.maxCapacity.toFixed(1)}
              </div>
              <div className="text-xs text-white/60">млрд м³ макс.</div>
            </div>
          </div>

          {/* Текущий сток */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-sm text-white/60">Текущий сток вниз</div>
            <div className="text-xl font-bold text-cyan-400">
              {dam.currentFlow.toFixed(1)} млрд м³/год
            </div>
          </div>

          {/* Доход */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-sm text-white/60">Доход от электроэнергии</div>
            <div className="text-xl font-bold text-green-400">
              +${dam.powerGeneration.toFixed(1)} млрд/год
            </div>
          </div>
        </div>
      </div>

      {/* Правая панель - режимы работы */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 w-[480px]">
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <h3 className="text-white/70 text-sm mb-6">РЕЖИМ РАБОТЫ ПЛОТИНЫ</h3>

          {/* Режим 1: Нормальный */}
          <button
            onClick={() => handleModeSelect('normal')}
            className={`w-full h-[100px] mb-4 rounded-xl border-2 transition-all relative overflow-hidden
                       ${currentMode === 'normal' 
                         ? 'border-blue-500 bg-blue-500/20' 
                         : 'border-white/20 bg-white/5 hover:bg-white/10'}`}
          >
            <div className="absolute inset-0 flex items-center px-6">
              <div className="flex-1 text-left">
                <div className="text-lg font-bold text-white">Нормальный режим</div>
                <div className="text-sm text-white/60">48–62 млрд м³/год вниз</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-400">+$1.4 млрд</div>
                <div className="text-sm text-white/60">/год</div>
              </div>
              {currentMode === 'normal' && (
                <div className="absolute right-4 top-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </div>
          </button>

          {/* Режим 2: Максимальная выработка */}
          <button
            onClick={() => handleModeSelect('max_power')}
            disabled={!canMaxPower}
            className={`w-full h-[100px] mb-4 rounded-xl border-2 transition-all relative overflow-hidden
                       ${!canMaxPower 
                         ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                         : currentMode === 'max_power' 
                           ? 'border-green-500 bg-green-500/20' 
                           : 'border-white/20 bg-white/5 hover:bg-white/10'}`}
          >
            <div className="absolute inset-0 flex items-center px-6">
              <div className="flex-1 text-left">
                <div className="text-lg font-bold text-white">Максимальная выработка</div>
                <div className="text-sm text-white/60">62–68 млрд м³/год вниз</div>
                {!canMaxPower && (
                  <div className="text-xs text-yellow-400 mt-1">Требуется заполнение ≥50%</div>
                )}
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-400">+$2.2 млрд</div>
                <div className="text-sm text-white/60">/год</div>
              </div>
              {currentMode === 'max_power' && (
                <div className="absolute right-4 top-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </div>
          </button>

          {/* Режим 3: АВАРИЙНЫЙ СБРОС */}
          <button
            onClick={() => handleModeSelect('emergency')}
            disabled={!canEmergencyRelease || isReleasing}
            className={`w-full h-[120px] mb-4 rounded-xl border-2 transition-all relative overflow-hidden
                       ${!canEmergencyRelease 
                         ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                         : 'border-red-500 bg-red-900/30 hover:bg-red-900/50'}`}
            style={{
              animation: canEmergencyRelease && !isReleasing ? 'pulse-red 2s infinite' : 'none'
            }}
          >
            <div className="absolute inset-0 flex items-center px-6">
              <div className="flex-1 text-left">
                <div className="text-xl font-bold text-red-400">⚠️ АВАРИЙНЫЙ СБРОС</div>
                <div className="text-sm text-white/60">100–140 млрд м³ за сезон дождей</div>
                {!canEmergencyRelease && (
                  <div className="text-xs text-yellow-400 mt-1">Требуется заполнение ≥90%</div>
                )}
                {isReleasing && (
                  <div className="text-xs text-red-400 mt-1 animate-pulse">СБРОС В ПРОЦЕССЕ...</div>
                )}
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-red-400">КРИТИЧЕСКИЙ</div>
              </div>
            </div>
          </button>

          {/* Режим 4: Переполнение (секретный) */}
          {canUnlockOverflow && (
            <button
              onClick={() => handleModeSelect('overflow')}
              className={`w-full h-[120px] rounded-xl border-2 transition-all relative overflow-hidden
                         ${currentMode === 'overflow' 
                           ? 'border-amber-500 bg-amber-500/20' 
                           : 'border-amber-500/50 bg-amber-900/20 hover:bg-amber-900/30'}`}
            >
              <div className="absolute inset-0 flex items-center px-6">
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🇪🇹</span>
                    <span className="text-lg font-bold text-amber-400">Режим переполнения</span>
                    <span className="text-2xl">🇪🇬</span>
                  </div>
                  <div className="text-sm text-amber-200/80 mt-1 italic">
                    «Нил для всех. Навсегда.»
                  </div>
                  <div className="text-sm text-white/60">68–74 млрд м³/год стабильно</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-400">−$1.4 млрд</div>
                  <div className="text-sm text-white/60">/год</div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-amber-500/10 to-red-500/10" />
            </button>
          )}

          {/* Подсказка о секретном режиме */}
          {!canUnlockOverflow && (
            <div className="text-center text-white/30 text-sm mt-4 italic">
              Существует ещё один режим... но он требует доверия.
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно подтверждения аварийного сброса */}
      {showEmergencyConfirm && !isReleasing && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-red-950 border-4 border-red-500 rounded-2xl p-8 max-w-2xl animate-pulse-slow">
            <h2 className="text-4xl font-bold text-red-400 mb-6 text-center">
              ⚠️ АВАРИЙНЫЙ СБРОС ⚠️
            </h2>
            
            <div className="space-y-4 text-white/90 text-lg mb-8">
              <div className="flex items-start gap-3">
                <span className="text-red-400">•</span>
                <span>Наводнение в {downstreamCountry}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400">•</span>
                <span>Уровень озера упадёт до 15–30 млрд м³</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400">•</span>
                <span>{downstreamCountry} получит воду на 2 года вперёд</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400">•</span>
                <span>Вероятность войны −95% на 5 лет</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowEmergencyConfirm(false);
                  setEmergencyClickCount(0);
                }}
                className="flex-1 py-4 px-6 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold"
              >
                Отмена
              </button>
              <button
                onClick={handleEmergencyClick}
                className="flex-1 py-4 px-6 bg-red-600 hover:bg-red-500 rounded-xl text-white font-bold
                          animate-pulse"
              >
                ПОДТВЕРДИТЬ СБРОС
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Анимация аварийного сброса */}
      {isReleasing && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-6xl font-bold text-white animate-pulse mb-4">
              АВАРИЙНЫЙ СБРОС
            </div>
            <div className="text-2xl text-blue-400">
              Все {dam.turbineCount} турбин открыты на максимум
            </div>
            <div className="mt-8 w-64 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-[12000ms]"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* CSS для анимаций */}
      <style>{`
        @keyframes pulse-red {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
          50% { box-shadow: 0 0 0 15px rgba(220, 38, 38, 0); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
};

export default DamControlPanel;
