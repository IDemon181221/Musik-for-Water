import { useIndiaGame } from '../../contexts/IndiaGameContext';

export function IndiaMap() {
  const { state, closeRiver, openRiver, togglePakistanView, selectRegion } = useIndiaGame();
  
  // Pakistan pulse animation when tense
  const pakistanPulse = state.pakistan.socialTension > 85;
  
  return (
    <div className="w-full h-full relative bg-[#0F1117]">
      <svg viewBox="0 0 800 600" className="w-full h-full">
        {/* Background */}
        <rect x="0" y="0" width="800" height="600" fill="#0F1117" />
        
        {/* Pakistan Territory (left side, darkened) */}
        <g className={pakistanPulse ? 'animate-pulse' : ''}>
          <path
            d="M 50 100 L 200 80 L 280 150 L 300 300 L 280 450 L 200 500 L 100 480 L 50 350 Z"
            fill={state.viewingPakistan ? '#2D1B1B' : '#1A1A1A'}
            stroke={pakistanPulse ? '#DC2626' : '#333'}
            strokeWidth="2"
            opacity={state.viewingPakistan ? 1 : 0.7}
          />
          {/* Red haze over Pakistan */}
          <path
            d="M 50 100 L 200 80 L 280 150 L 300 300 L 280 450 L 200 500 L 100 480 L 50 350 Z"
            fill="url(#pakistanHaze)"
            opacity={0.4}
          />
          
          {/* Pakistan label */}
          <text x="150" y="290" fill="#666" fontSize="14" textAnchor="middle">
            PAKISTAN
          </text>
          
          {/* Pakistan stress indicator */}
          <rect x="100" y="310" width="100" height="8" fill="#333" rx="4" />
          <rect 
            x="100" 
            y="310" 
            width={state.pakistan.waterStress} 
            height="8" 
            fill={state.pakistan.waterStress > 90 ? '#DC2626' : '#EAB308'} 
            rx="4" 
          />
          <text x="150" y="335" fill="#999" fontSize="10" textAnchor="middle">
            Водный стресс: {Math.round(state.pakistan.waterStress)}%
          </text>
          <text x="150" y="350" fill="#999" fontSize="10" textAnchor="middle">
            Население: {state.pakistan.population}M
          </text>
        </g>
        
        {/* Gradient for Pakistan red haze */}
        <defs>
          <radialGradient id="pakistanHaze" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* India Territory (right side) */}
        <path
          d="M 300 50 L 500 30 L 700 100 L 750 300 L 700 500 L 500 580 L 350 550 L 300 400 L 300 300 Z"
          fill="#1E293B"
          stroke="#3B82F6"
          strokeWidth="1"
          opacity="0.5"
        />
        
        {/* Indus River System */}
        <g>
          {/* Main Indus */}
          <path
            d="M 350 50 C 340 100, 330 150, 320 200 C 310 250, 300 300, 280 350 C 260 400, 240 450, 200 500"
            fill="none"
            stroke="#3B82F6"
            strokeWidth={state.rivers.some(r => r.isClosed) ? 2 : 6}
            opacity={0.8}
          />
          
          {/* Beas River */}
          <path
            d="M 400 80 C 380 100, 360 130, 340 160"
            fill="none"
            stroke={state.rivers.find(r => r.id === 'beas')?.isClosed ? '#666' : '#3B82F6'}
            strokeWidth={state.rivers.find(r => r.id === 'beas')?.isClosed ? 1 : 4}
            strokeDasharray={state.rivers.find(r => r.id === 'beas')?.isClosed ? '5,5' : 'none'}
          />
          <text x="390" y="70" fill="#3B82F6" fontSize="10">Беас</text>
          
          {/* Ravi River */}
          <path
            d="M 380 120 C 360 150, 340 180, 330 210"
            fill="none"
            stroke={state.rivers.find(r => r.id === 'ravi')?.isClosed ? '#666' : '#3B82F6'}
            strokeWidth={state.rivers.find(r => r.id === 'ravi')?.isClosed ? 1 : 4}
            strokeDasharray={state.rivers.find(r => r.id === 'ravi')?.isClosed ? '5,5' : 'none'}
          />
          <text x="370" y="110" fill="#3B82F6" fontSize="10">Рави</text>
          
          {/* Sutlej River */}
          <path
            d="M 420 100 C 400 140, 370 180, 340 220"
            fill="none"
            stroke={state.rivers.find(r => r.id === 'sutlej')?.isClosed ? '#666' : '#3B82F6'}
            strokeWidth={state.rivers.find(r => r.id === 'sutlej')?.isClosed ? 1 : 4}
            strokeDasharray={state.rivers.find(r => r.id === 'sutlej')?.isClosed ? '5,5' : 'none'}
          />
          <text x="420" y="90" fill="#3B82F6" fontSize="10">Сатледж</text>
        </g>
        
        {/* Bhakra-Nangal Dam (India's main dam) */}
        <g 
          className="cursor-pointer hover:opacity-80"
          onClick={() => selectRegion('punjab')}
        >
          <rect x="390" y="130" width="30" height="15" fill="#DC2626" stroke="#FFF" strokeWidth="1" />
          <text x="405" y="160" fill="#FFF" fontSize="9" textAnchor="middle">Бхакра-Нангал</text>
        </g>
        
        {/* Tarbela Dam (Pakistan) */}
        <g opacity="0.6">
          <rect x="250" y="180" width="25" height="12" fill="#666" stroke="#999" strokeWidth="1" />
          <text x="262" y="205" fill="#999" fontSize="8" textAnchor="middle">Тарбела</text>
        </g>
        
        {/* Key Indian regions */}
        {state.regions.slice(0, 6).map((region, i) => {
          const positions = [
            { x: 380, y: 180 }, // Punjab
            { x: 420, y: 220 }, // Haryana
            { x: 480, y: 280 }, // Rajasthan
            { x: 520, y: 380 }, // Gujarat
            { x: 580, y: 420 }, // Maharashtra
            { x: 500, y: 320 }, // UP
          ];
          const pos = positions[i];
          const isSelected = state.selectedRegion === region.id;
          const isCritical = region.waterStress > 85;
          
          return (
            <g 
              key={region.id}
              className="cursor-pointer"
              onClick={() => selectRegion(region.id)}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isSelected ? 18 : 14}
                fill={isCritical ? '#DC2626' : region.waterStress > 70 ? '#EAB308' : '#22C55E'}
                stroke={isSelected ? '#FFB74D' : '#FFF'}
                strokeWidth={isSelected ? 3 : 1}
                opacity={0.8}
                className={isCritical ? 'animate-pulse' : ''}
              />
              <text 
                x={pos.x} 
                y={pos.y + 30} 
                fill="#FFF" 
                fontSize="9" 
                textAnchor="middle"
              >
                {region.nameRu}
              </text>
              <text 
                x={pos.x} 
                y={pos.y + 4} 
                fill="#FFF" 
                fontSize="10" 
                textAnchor="middle"
                fontWeight="bold"
              >
                {Math.round(region.waterStress)}%
              </text>
            </g>
          );
        })}
        
        {/* Kashmir (always tense) */}
        <g>
          <path
            d="M 340 50 L 400 40 L 420 80 L 380 120 L 340 100 Z"
            fill="#4B1F1F"
            stroke="#DC2626"
            strokeWidth="2"
            opacity="0.6"
          />
          <text x="375" y="85" fill="#DC2626" fontSize="9" textAnchor="middle">
            Кашмир
          </text>
        </g>
        
        {/* Legend */}
        <g transform="translate(620, 50)">
          <rect x="0" y="0" width="150" height="100" fill="#1A1A1A" rx="4" />
          <text x="10" y="20" fill="#FFF" fontSize="11" fontWeight="bold">Легенда</text>
          
          <circle cx="20" cy="40" r="6" fill="#22C55E" />
          <text x="35" y="44" fill="#999" fontSize="9">Стресс &lt; 70%</text>
          
          <circle cx="20" cy="58" r="6" fill="#EAB308" />
          <text x="35" y="62" fill="#999" fontSize="9">Стресс 70-85%</text>
          
          <circle cx="20" cy="76" r="6" fill="#DC2626" />
          <text x="35" y="80" fill="#999" fontSize="9">Стресс &gt; 85%</text>
        </g>
      </svg>
      
      {/* River control buttons */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        <div className="text-xs text-gray-500 mb-1">Восточные реки:</div>
        {state.rivers.map(river => (
          <button
            key={river.id}
            onClick={() => river.isClosed ? openRiver(river.id) : closeRiver(river.id)}
            className={`px-3 py-2 rounded text-sm font-medium transition-all ${
              river.isClosed
                ? 'bg-red-900/50 border border-red-600 text-red-400'
                : 'bg-blue-900/50 border border-blue-600 text-blue-400 hover:bg-blue-800/50'
            }`}
          >
            {river.isClosed ? '🚫' : '💧'} {river.nameRu}
            <span className="ml-2 text-xs opacity-70">
              {river.isClosed ? '(закрыта)' : `${river.waterVolume} млрд м³`}
            </span>
          </button>
        ))}
        
        {/* Warning about timer penalty */}
        <div className="text-xs text-red-400 mt-2 max-w-[200px]">
          ⚠️ Перекрытие рек уменьшает ядерный таймер!
        </div>
      </div>
      
      {/* Pakistan view toggle */}
      <button
        onClick={togglePakistanView}
        className={`absolute bottom-4 right-4 px-4 py-2 rounded transition-all ${
          state.viewingPakistan
            ? 'bg-red-900/50 border border-red-600 text-red-400'
            : 'bg-gray-800/50 border border-gray-600 text-gray-400 hover:bg-gray-700/50'
        }`}
      >
        {state.viewingPakistan ? '👁 Вид Пакистана' : '🔄 Переключить вид'}
      </button>
    </div>
  );
}
