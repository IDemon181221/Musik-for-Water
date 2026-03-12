import { useIndiaGame } from '../../contexts/IndiaGameContext';

interface Props {
  onExit: () => void;
}

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export function IndiaHeader({ onExit }: Props) {
  const { state, setSpeed } = useIndiaGame();
  
  // Timer color based on days remaining
  const getTimerColor = () => {
    if (state.nuclearTimer > 60) return '#22C55E'; // green
    if (state.nuclearTimer > 30) return '#EAB308'; // yellow
    if (state.nuclearTimer > 10) return '#DC2626'; // red
    return state.nuclearTimer % 2 === 0 ? '#FFFFFF' : '#000000'; // flashing
  };
  
  const timerPercent = (state.nuclearTimer / 180) * 100;
  
  return (
    <header className="h-[110px] bg-[#0F1117]/95 border-b border-gray-800 flex items-center px-6 gap-6">
      {/* Exit button */}
      <button
        onClick={onExit}
        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm"
      >
        ✕ Выйти
      </button>
      
      {/* India Flag */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-8 flex flex-col">
          <div className="flex-1 bg-orange-500"></div>
          <div className="flex-1 bg-white flex items-center justify-center">
            <div className="w-3 h-3 rounded-full border-2 border-blue-900"></div>
          </div>
          <div className="flex-1 bg-green-600"></div>
        </div>
        <div className="text-sm text-gray-400">
          Republic of India
        </div>
      </div>
      
      {/* Date */}
      <div className="flex-1 text-center">
        <div className="text-5xl font-light tracking-wider" style={{ fontFamily: 'PP Mori, sans-serif' }}>
          {MONTH_NAMES[state.month - 1]} {state.year}
        </div>
        
        {/* Speed controls */}
        <div className="flex items-center justify-center gap-2 mt-2">
          {[0, 1, 2, 3].map(speed => (
            <button
              key={speed}
              onClick={() => setSpeed(speed)}
              className={`w-8 h-8 rounded text-sm font-bold transition-colors ${
                state.gameSpeed === speed
                  ? speed === 0 
                    ? 'bg-yellow-500 text-black'
                    : 'bg-blue-500 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {speed === 0 ? '⏸' : speed}
            </button>
          ))}
        </div>
      </div>
      
      {/* Stats */}
      <div className="flex items-center gap-6">
        {/* Budget */}
        <div className="text-center">
          <div className="text-xs text-gray-500 uppercase">Бюджет</div>
          <div className={`text-2xl font-bold ${state.budget >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${state.budget.toFixed(1)}B
          </div>
        </div>
        
        {/* International Pressure */}
        <div className="text-center">
          <div className="text-xs text-gray-500 uppercase">Давление</div>
          <div className="w-24 h-3 bg-gray-800 rounded-full overflow-hidden mt-1">
            <div 
              className={`h-full transition-all ${state.internationalPressure > 80 ? 'bg-red-600' : state.internationalPressure > 50 ? 'bg-yellow-500' : 'bg-blue-500'}`}
              style={{ width: `${state.internationalPressure}%` }}
            />
          </div>
          <div className={`text-lg font-bold ${state.internationalPressure > 80 ? 'text-red-400' : ''}`}>
            {Math.round(state.internationalPressure)}%
          </div>
        </div>
        
        {/* Nuclear Timer - THE BIG ONE */}
        <div className="relative">
          <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r="80"
              fill="none"
              stroke="#1F2937"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle
              cx="90"
              cy="90"
              r="80"
              fill="none"
              stroke={getTimerColor()}
              strokeWidth="12"
              strokeDasharray={`${timerPercent * 5.02} 502`}
              strokeLinecap="round"
              className="transition-all duration-300"
              style={{
                filter: state.nuclearTimer <= 10 ? 'drop-shadow(0 0 10px #DC2626)' : 'none'
              }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-xs text-gray-500 uppercase">Ядерный</div>
            <div className="text-xs text-gray-500 uppercase">Таймер</div>
            <div 
              className={`text-4xl font-bold ${state.nuclearTimer <= 10 ? 'animate-pulse' : ''}`}
              style={{ color: getTimerColor() }}
            >
              {Math.round(state.nuclearTimer)}
            </div>
            <div className="text-xs text-gray-500">дней</div>
          </div>
          
          {/* Warning icon */}
          {state.nuclearTimer <= 30 && (
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-lg">☢</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
