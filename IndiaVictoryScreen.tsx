import { IndiaGameState } from '../../contexts/IndiaGameContext';

interface Props {
  state: IndiaGameState;
  onExit: () => void;
}

export function IndiaVictoryScreen({ state, onExit }: Props) {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Night sky with two cities */}
      <div className="absolute inset-0">
        {/* Stars */}
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
        
        {/* Delhi glow */}
        <div 
          className="absolute"
          style={{
            left: '30%',
            bottom: '15%',
            width: '200px',
            height: '100px',
            background: 'radial-gradient(ellipse, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
            filter: 'blur(10px)'
          }}
        />
        <div className="absolute left-[30%] bottom-[8%] text-yellow-400/50 text-sm">Delhi</div>
        
        {/* Islamabad glow */}
        <div 
          className="absolute"
          style={{
            right: '30%',
            bottom: '15%',
            width: '150px',
            height: '80px',
            background: 'radial-gradient(ellipse, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
            filter: 'blur(10px)'
          }}
        />
        <div className="absolute right-[30%] bottom-[8%] text-green-400/50 text-sm">Islamabad</div>
        
        {/* River Indus between them */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <path
            d="M 400 600 Q 450 400, 400 300 Q 350 200, 400 100"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            opacity="0.6"
            className="animate-pulse"
          />
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl px-8">
        <div className="text-6xl mb-8">🕊️</div>
        
        <h1 className="text-3xl font-light mb-4" style={{ fontFamily: 'PP Mori, sans-serif' }}>
          Декабрь 2045
        </h1>
        
        <div className="space-y-6 text-lg text-gray-300">
          <p>Договор 1960 года мёртв.</p>
          <p>Новый договор никто не подписал.</p>
          <p className="text-blue-400">Но река всё ещё течёт.</p>
          <p className="text-xl text-white mt-8">Пока что это и есть мир.</p>
        </div>
        
        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <div className="text-gray-500">Ядерный таймер</div>
            <div className="text-2xl text-green-400">{Math.round(state.nuclearTimer)} дней</div>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <div className="text-gray-500">Водный стресс Пакистана</div>
            <div className="text-2xl text-yellow-400">{Math.round(state.pakistan.waterStress)}%</div>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <div className="text-gray-500">Международное давление</div>
            <div className="text-2xl text-orange-400">{Math.round(state.internationalPressure)}%</div>
          </div>
        </div>
        
        <button
          onClick={onExit}
          className="mt-12 px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors"
        >
          Вернуться в меню
        </button>
      </div>
    </div>
  );
}
