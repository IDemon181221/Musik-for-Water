import { NewsEvent } from '../../contexts/IndiaGameContext';

interface Props {
  event: NewsEvent;
  onDismiss: () => void;
}

export function IndiaEventPopup({ event, onDismiss }: Props) {
  const typeColors = {
    india: 'border-orange-500 bg-orange-900/20',
    pakistan: 'border-green-600 bg-green-900/20',
    international: 'border-blue-500 bg-blue-900/20',
    crisis: 'border-red-600 bg-red-900/20'
  };
  
  const typeIcons = {
    india: '🇮🇳',
    pakistan: '🇵🇰',
    international: '🌍',
    crisis: '⚠️'
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div 
        className={`max-w-lg w-full mx-4 rounded-lg border-2 p-6 ${typeColors[event.type]}`}
        style={{ animation: 'slideIn 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{typeIcons[event.type]}</span>
          <div>
            <h2 className="text-xl font-bold">{event.titleRu}</h2>
            <p className="text-sm text-gray-400">
              {event.month}/{event.year}
            </p>
          </div>
        </div>
        
        {/* Content */}
        <p className="text-gray-300 mb-6">
          {event.descriptionRu}
        </p>
        
        {/* Effects */}
        {event.effects && (
          <div className="mb-6 p-3 bg-black/30 rounded text-sm">
            <div className="text-gray-500 uppercase text-xs mb-2">Последствия:</div>
            {event.effects.nuclearTimer && (
              <div className={event.effects.nuclearTimer > 0 ? 'text-green-400' : 'text-red-400'}>
                ☢️ Ядерный таймер: {event.effects.nuclearTimer > 0 ? '+' : ''}{event.effects.nuclearTimer} дней
              </div>
            )}
            {event.effects.internationalPressure && (
              <div className={event.effects.internationalPressure < 0 ? 'text-green-400' : 'text-red-400'}>
                🌍 Международное давление: {event.effects.internationalPressure > 0 ? '+' : ''}{event.effects.internationalPressure}%
              </div>
            )}
            {event.effects.pakistanTension && (
              <div className="text-orange-400">
                🇵🇰 Напряжение в Пакистане: +{event.effects.pakistanTension}%
              </div>
            )}
          </div>
        )}
        
        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
        >
          Понятно
        </button>
      </div>
      
      {/* CSS */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
