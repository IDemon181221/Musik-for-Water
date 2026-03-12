import { useState, useEffect } from 'react';

interface Props {
  onStart: () => void;
  onExit: () => void;
}

export function IndiaStartScreen({ onStart, onExit }: Props) {
  const [phase, setPhase] = useState(0);
  const [showMushroom, setShowMushroom] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  
  useEffect(() => {
    // Phase 1: Show satellite image
    setTimeout(() => setPhase(1), 500);
    
    // Phase 2: Show mushroom cloud
    setTimeout(() => {
      setShowMushroom(true);
      setTimeout(() => setShowMushroom(false), 3000);
    }, 1500);
    
    // Phase 3: Show text
    setTimeout(() => setTextVisible(true), 3000);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Satellite background - India lit up, Pakistan dark */}
      <div 
        className={`absolute inset-0 transition-opacity duration-2000 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 65% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 70%),
            radial-gradient(ellipse 30% 30% at 35% 50%, rgba(0, 0, 0, 0.8) 0%, transparent 70%),
            linear-gradient(to bottom, #000000, #0a0a0a)
          `
        }}
      >
        {/* Stars effect */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* India region (green glow) */}
        <div 
          className="absolute"
          style={{
            left: '55%',
            top: '40%',
            width: '300px',
            height: '200px',
            background: 'radial-gradient(ellipse, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
            filter: 'blur(20px)'
          }}
        />
        
        {/* Pakistan region (dark) */}
        <div 
          className="absolute"
          style={{
            left: '30%',
            top: '35%',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.9) 0%, transparent 70%)',
          }}
        />
        
        {/* Some city lights in India */}
        {[
          { x: 60, y: 45, name: 'Delhi' },
          { x: 65, y: 60, name: 'Mumbai' },
          { x: 70, y: 55, name: 'Kolkata' },
        ].map((city, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full animate-pulse"
            style={{
              left: `${city.x}%`,
              top: `${city.y}%`,
              boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)',
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>
      
      {/* Mushroom cloud */}
      {showMushroom && (
        <div 
          className="absolute animate-pulse"
          style={{
            left: '50%',
            top: '40%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.4,
          }}
        >
          <svg width="300" height="400" viewBox="0 0 300 400">
            {/* Mushroom stem */}
            <path
              d="M 140 400 L 140 250 Q 150 200 160 250 L 160 400"
              fill="url(#mushroomGradient)"
              opacity="0.6"
            />
            {/* Mushroom cap */}
            <ellipse
              cx="150"
              cy="150"
              rx="120"
              ry="80"
              fill="url(#mushroomGradient)"
              opacity="0.5"
            />
            {/* Inner glow */}
            <ellipse
              cx="150"
              cy="150"
              rx="60"
              ry="40"
              fill="#FF6B35"
              opacity="0.4"
            />
            <defs>
              <radialGradient id="mushroomGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="50%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#7F1D1D" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      )}
      
      {/* Text overlay */}
      {textVisible && (
        <div className="relative z-10 text-center max-w-2xl px-8">
          <h1 
            className="text-4xl font-light mb-8 opacity-0 animate-fadeIn"
            style={{ 
              fontFamily: 'PP Mori, sans-serif',
              animationDelay: '0s',
              animationFillMode: 'forwards'
            }}
          >
            Август 2025 года
          </h1>
          
          <div className="space-y-4 text-lg text-gray-300">
            <p 
              className="opacity-0 animate-fadeIn"
              style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
            >
              Индия только что официально вышла из Индского договора 1960 года.
            </p>
            
            <p 
              className="opacity-0 animate-fadeIn text-red-400"
              style={{ animationDelay: '1s', animationFillMode: 'forwards' }}
            >
              Пакистан дал тебе 90 дней до «необратимых последствий».
            </p>
            
            <p 
              className="opacity-0 animate-fadeIn"
              style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}
            >
              У тебя 20 игровых лет, чтобы доказать, что ты можешь жить без него.
            </p>
            
            <p 
              className="opacity-0 animate-fadeIn text-xl font-medium mt-8"
              style={{ animationDelay: '2s', animationFillMode: 'forwards' }}
            >
              Или умереть вместе с ним.
            </p>
          </div>
          
          {/* Buttons */}
          <div 
            className="flex gap-4 justify-center mt-12 opacity-0 animate-fadeIn"
            style={{ animationDelay: '2.5s', animationFillMode: 'forwards' }}
          >
            <button
              onClick={onExit}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              ← Назад
            </button>
            <button
              onClick={onStart}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-400 hover:to-green-500 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Начать кампанию →
            </button>
          </div>
        </div>
      )}
      
      {/* CSS for fade in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
      `}</style>
    </div>
  );
}
