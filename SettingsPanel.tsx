import { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface SettingsPanelProps {
  onClose: () => void;
  isInGame?: boolean;
}

export default function SettingsPanel({ onClose, isInGame = false }: SettingsPanelProps) {
  const {
    settings,
    updateSettings,
    user,
    isLoading,
    signInWithGoogle,
    signOutUser,
    syncToCloud,
    lastSyncTime,
    isFirebaseReady
  } = useSettings();

  // Apply volume to audio elements in real-time
  useEffect(() => {
    (window as unknown as Record<string, unknown>).gameAudioVolume = settings.musicVolume;
    // Also update any existing audio elements
    const audios = document.querySelectorAll('audio');
    audios.forEach(a => { a.volume = settings.musicVolume / 100; });
  }, [settings.musicVolume]);

  // Auto-sync to cloud on settings change
  useEffect(() => {
    if (user && isFirebaseReady) {
      const timer = setTimeout(() => { syncToCloud(); }, 1000);
      return () => clearTimeout(timer);
    }
  }, [settings, user, isFirebaseReady, syncToCloud]);

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100000]"
      onClick={onClose}
    >
      <div 
        className="bg-[#1a1a2e] rounded-xl p-6 w-[500px] max-h-[90vh] overflow-y-auto border border-white/20"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">⚙️ Настройки</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Google Account Section */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">
            👤 Аккаунт Google
          </h3>
          
          {!isFirebaseReady ? (
            <div className="text-yellow-400 text-sm">
              ⚠️ Firebase не настроен. Для синхронизации между устройствами 
              настройте Firebase в src/firebase/config.ts
            </div>
          ) : isLoading ? (
            <div className="text-white/60">Загрузка...</div>
          ) : user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {user.photoURL && (
                  <img 
                    src={user.photoURL} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <div className="text-white font-medium">{user.displayName}</div>
                  <div className="text-white/60 text-sm">{user.email}</div>
                </div>
              </div>
              
              {lastSyncTime && (
                <div className="text-white/40 text-xs">
                  Последняя синхронизация: {lastSyncTime.toLocaleString('ru-RU')}
                </div>
              )}
              
              <div className="text-green-400/60 text-xs">
                ☁️ Настройки автоматически сохраняются в облако
              </div>
              
              <button
                onClick={signOutUser}
                className="w-full bg-red-600/30 hover:bg-red-600/50 text-red-400 py-2 rounded-lg text-sm transition"
              >
                Выйти из аккаунта
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="w-full bg-white hover:bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Войти через Google
            </button>
          )}
        </div>

        {/* Audio Settings */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">
            🔊 Звук
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-white mb-2">
                <span>Громкость музыки</span>
                <span>{settings.musicVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.musicVolume}
                onChange={e => updateSettings({ musicVolume: Number(e.target.value) })}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-white mb-2">
                <span>Громкость эффектов</span>
                <span>{settings.sfxVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sfxVolume}
                onChange={e => updateSettings({ sfxVolume: Number(e.target.value) })}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Performance Settings */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">
            🖥️ Производительность
          </h3>
          
          <div>
            <div className="text-white mb-2">FPS (кадров в секунду)</div>
            <div className="flex gap-2">
              {([30, 60, 120] as const).map(fps => (
                <button
                  key={fps}
                  onClick={() => updateSettings({ fps })}
                  className={`flex-1 py-2 rounded-lg transition ${
                    settings.fps === fps
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  {fps} FPS
                </button>
              ))}
            </div>
            <div className="text-white/40 text-xs mt-2">
              Меньше FPS = меньше нагрузка на устройство
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">
            📊 Прогресс
          </h3>
          
          <div className="space-y-2 text-white/80">
            <div className="flex justify-between">
              <span>Обучение пройдено:</span>
              <span className={settings.tutorialCompleted ? 'text-green-400' : 'text-red-400'}>
                {settings.tutorialCompleted ? '✅ Да' : '❌ Нет'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Опыт игры:</span>
              <span className={settings.isExperiencedPlayer ? 'text-blue-400' : 'text-yellow-400'}>
                {settings.isExperiencedPlayer ? '🎮 Опытный' : '🆕 Новичок'}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => {
              if (confirm('Сбросить весь прогресс? Это действие нельзя отменить.')) {
                updateSettings({
                  tutorialCompleted: false,
                  hasAnsweredExperience: false,
                  isExperiencedPlayer: false
                });
              }
            }}
            className="mt-4 w-full bg-red-600/30 hover:bg-red-600/50 text-red-400 py-2 rounded-lg text-sm transition"
          >
            🗑️ Сбросить прогресс
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium transition"
        >
          Закрыть
        </button>
        
        {isInGame && (
          <div className="text-white/40 text-xs text-center mt-3">
            Нажмите ESC или кликните вне окна чтобы закрыть
          </div>
        )}
      </div>
    </div>
  );
}
