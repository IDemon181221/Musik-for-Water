import { useState, useEffect } from 'react';
import SettingsPanel from './SettingsPanel';

interface PauseMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onExit: () => void;
  gameName?: string;
}

export default function PauseMenu({ isOpen, onClose, onExit, gameName = 'Кампания' }: PauseMenuProps) {
  const [showSettings, setShowSettings] = useState(false);

  // ESC закрывает меню паузы
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSettings) {
          setShowSettings(false);
        } else if (isOpen) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showSettings, onClose]);

  if (!isOpen) return null;

  if (showSettings) {
    return <SettingsPanel onClose={() => setShowSettings(false)} isInGame={true} />;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[99999]"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-b from-[#1a1a2e] to-[#16213e] rounded-xl p-8 w-[400px] border border-white/20 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">⏸️</div>
          <h2 className="text-3xl font-bold text-white">ПАУЗА</h2>
          <p className="text-white/60 mt-2">{gameName}</p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2"
          >
            ▶️ Продолжить
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2"
          >
            ⚙️ Настройки
          </button>
          
          <button
            onClick={() => {
              if (confirm('Выйти из кампании? Несохранённый прогресс будет потерян.')) {
                onExit();
              }
            }}
            className="w-full bg-red-600/50 hover:bg-red-600 text-white py-4 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2"
          >
            🚪 Выйти в меню
          </button>
        </div>

        {/* Hint */}
        <div className="text-white/40 text-sm text-center mt-6">
          Нажмите <span className="bg-white/20 px-2 py-1 rounded">ESC</span> чтобы продолжить
        </div>
      </div>
    </div>
  );
}
