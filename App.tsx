import React, { useState, useEffect, useRef } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { TutorialProvider, useTutorial } from './context/TutorialContext';
import { IndiaGameProvider } from './contexts/IndiaGameContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import SettingsPanel from './components/SettingsPanel';
import PauseMenu from './components/PauseMenu';
import { auth, googleProvider } from './firebase/config';
import { signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { getAllLocalSaves, loadLocal, deleteLocal } from './systems/SaveSystem';
import GameHeader from './components/GameHeader';
import RegionsPanel from './components/RegionsPanel';
import InitiativesPanel from './components/InitiativesPanel';
import MapView from './components/MapView';
import NotificationsPanel from './components/NotificationsPanel';
import GameOverScreen from './components/GameOverScreen';
import { useSpeedKeyboard } from './components/SpeedControl';
import { TutorialScreen } from './components/tutorial/TutorialScreen';
import { IndiaCampaignScreen } from './components/india/IndiaCampaignScreen';
import { EmergencyStatusPanel } from './components/EmergencyStatusPanel';

const MUSIC_URL = 'https://raw.githubusercontent.com/IDemon181221/Musik-for-Water/main/Decisions%20and%20Consequences%20(Intense%20Minor%20Take%201).mp3';

// Simple Music Player Component - renders an actual <audio> tag
const CampaignMusic: React.FC<{ volume?: number }> = ({ volume: propVolume }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(propVolume ?? 0.5);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    // Try to autoplay
    const tryPlay = () => {
      if (audio.paused) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay blocked, will play on user click
        });
      }
    };

    tryPlay();

    // Listen for any click to start music
    const handleClick = () => {
      tryPlay();
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={MUSIC_URL}
        loop
        preload="auto"
      />
      
      {/* Music Controls */}
      <div
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0,0,0,0.8)',
          borderRadius: '12px',
          padding: '8px 12px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <button
          onClick={togglePlay}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '4px',
          }}
        >
          {isPlaying ? '⏸' : '▶️'}
        </button>
        
        {showControls && (
          <>
            <button
              onClick={toggleMute}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '4px',
              }}
            >
              {audioRef.current?.muted ? '🔇' : '🔊'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '80px', cursor: 'pointer' }}
            />
          </>
        )}
        
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginLeft: '4px' }}>
          🎵
        </span>
      </div>
    </>
  );
};

const GameScreen: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { state, setGameSpeed } = useGame();
  const [isPaused, setIsPaused] = useState(false);
  const { settings } = useSettings();
  
  // Enable keyboard shortcuts for speed control
  useSpeedKeyboard();

  // ESC opens pause menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const newPaused = !isPaused;
        setIsPaused(newPaused);
        // Pause game when menu is open
        setGameSpeed(newPaused ? 0 : 2);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, setGameSpeed]);

  if (state.gameOver) {
    return <GameOverScreen onRestart={() => window.location.reload()} />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#0F1117] overflow-hidden">
      {/* Header */}
      <GameHeader />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Regions */}
        <div className="w-[420px] border-r border-gray-800 overflow-hidden">
          <RegionsPanel />
        </div>

        {/* Center - Map */}
        <div className="flex-1 overflow-hidden">
          <MapView />
        </div>

        {/* Right Panel - Initiatives */}
        <div className="w-[400px] border-l border-gray-800 overflow-hidden">
          <InitiativesPanel />
        </div>
      </div>

      {/* Notifications */}
      <NotificationsPanel />

      {/* Emergency Status Panel */}
      <EmergencyStatusPanel />

      {/* Music - ONLY in this campaign */}
      <CampaignMusic volume={settings.musicVolume / 100} />

      {/* Pause Button */}
      <button
        onClick={() => {
          setIsPaused(true);
          setGameSpeed(0);
        }}
        className="fixed top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        ⏸️ Пауза
      </button>

      {/* Pause Menu */}
      <PauseMenu
        isOpen={isPaused}
        onClose={() => {
          setIsPaused(false);
          setGameSpeed(2);
        }}
        onExit={onExit}
        gameName="Нил — Эфиопия"
      />
    </div>
  );
};

// Tutorial Wrapper Component - manages tutorial lifecycle
const TutorialWrapper: React.FC<{ onComplete: () => void; onExit: () => void }> = ({ onComplete, onExit }) => {
  const tutorial = useTutorial();
  const [isReady, setIsReady] = useState(false);
  const hasStartedRef = useRef(false);

  // Start tutorial on mount - only once
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    
    console.log('[TutorialWrapper] Starting tutorial...');
    tutorial.startTutorial();
  }, []); // Empty deps - run once

  // Monitor isActive state
  useEffect(() => {
    console.log('[TutorialWrapper] isActive:', tutorial.isActive);
    if (tutorial.isActive && !isReady) {
      setIsReady(true);
    }
  }, [tutorial.isActive, isReady]);

  // Handle tutorial completion
  useEffect(() => {
    if (tutorial.tutorialCompleted) {
      console.log('[TutorialWrapper] Tutorial completed!');
      localStorage.setItem('tutorialCompleted', 'true');
      onComplete();
    }
  }, [tutorial.tutorialCompleted, onComplete]);

  // Show loading while waiting for tutorial to start
  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFB74D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#E8E7E4] text-lg">Загрузка обучения...</p>
          <p className="text-gray-500 text-sm mt-2">Подготовка кампании "Турция, 2015-2025"</p>
        </div>
      </div>
    );
  }

  return (
    <GameProvider>
      <TutorialScreen onExit={onExit} />
    </GameProvider>
  );
};

// Experience Question Modal
const ExperienceQuestion: React.FC<{ 
  onNewPlayer: () => void; 
  onExperienced: () => void;
}> = ({ onNewPlayer, onExperienced }) => {
  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-[#1a1a2e] rounded-2xl border border-gray-700 p-8 shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extralight tracking-wider text-[#E8E7E4] mb-2" style={{ fontFamily: 'PP Mori, Inter, sans-serif' }}>
            ТОЧКА КИПЕНИЯ
          </h1>
          <p className="text-gray-500">Стратегия водных конфликтов</p>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <h2 className="text-2xl text-[#E8E7E4] mb-4">
            Добро пожаловать!
          </h2>
          <p className="text-gray-400 text-lg">
            Вы уже играли в эту игру раньше?
          </p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onNewPlayer}
            className="p-6 rounded-xl border-2 border-green-500/50 bg-green-900/20 hover:bg-green-900/40 
                       transition-all group text-left"
          >
            <div className="text-3xl mb-3">🎓</div>
            <h3 className="text-xl font-semibold text-green-400 mb-2">
              Нет, я новичок
            </h3>
            <p className="text-gray-400 text-sm">
              Пройдите обучающую кампанию (~15 минут), чтобы понять все механики игры.
            </p>
          </button>

          <button
            onClick={onExperienced}
            className="p-6 rounded-xl border-2 border-blue-500/50 bg-blue-900/20 hover:bg-blue-900/40 
                       transition-all group text-left"
          >
            <div className="text-3xl mb-3">🎮</div>
            <h3 className="text-xl font-semibold text-blue-400 mb-2">
              Да, я уже играл
            </h3>
            <p className="text-gray-400 text-sm">
              Все кампании будут разблокированы. Обучение останется доступным в любой момент.
            </p>
          </button>
        </div>

        {/* Skip info */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Ваш выбор сохранится в браузере
        </p>
      </div>
    </div>
  );
};

// Campaign Selection Screen
const CampaignSelection: React.FC<{ 
  onSelect: (campaign: string) => void;
  onTutorial: () => void;
  tutorialCompleted: boolean;
  allUnlocked: boolean;
  onSettings: () => void;
}> = ({ onSelect, onTutorial, tutorialCompleted, allUnlocked, onSettings }) => {
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [saves, setSaves] = useState<ReturnType<typeof getAllLocalSaves>>([]);

  useEffect(() => {
    if (auth) {
      const unsub = onAuthStateChanged(auth, (u) => setGoogleUser(u));
      return () => unsub();
    }
  }, []);

  useEffect(() => {
    setSaves(getAllLocalSaves());
  }, []);

  const handleGoogleLogin = async () => {
    if (!auth || !googleProvider) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  const handleContinueSave = (campaignId: string) => {
    onSelect(campaignId);
  };

  const handleStartNew = (campaignId: string) => {
    const existingSave = loadLocal(campaignId);
    if (existingSave) {
      if (confirm('⚠️ У вас есть сохранение этой кампании!\n\nЕсли начнёте заново — сохранение будет безвозвратно удалено.\n\nПродолжить?')) {
        deleteLocal(campaignId);
        onSelect(campaignId);
      }
    } else {
      onSelect(campaignId);
    }
  };

  const campaigns = [
    {
      id: 'nile',
      name: 'Нил — Эфиопия',
      flag: '🇪🇹',
      period: '2021–2040',
      description: 'Управляйте плотиной GERD и балансируйте между потребностями Эфиопии, Судана и Египта.',
      color: 'from-blue-600 to-green-700',
      available: tutorialCompleted || allUnlocked,
    },
    {
      id: 'indus',
      name: 'Инд — Индия',
      flag: '🇮🇳',
      period: '2025–2045',
      description: 'Ядерная напряжённость с Пакистаном на фоне водного кризиса. Ядерный таймер всегда над головой.',
      color: 'from-orange-600 to-red-700',
      available: tutorialCompleted || allUnlocked,
    },
    {
      id: 'mekong',
      name: 'Меконг — Китай/Лаос',
      flag: '🇨🇳',
      period: '2024–2040',
      description: '11 плотин на великой реке Юго-Восточной Азии.',
      color: 'from-green-600 to-teal-700',
      available: false,
    },
    {
      id: 'aral',
      name: 'Аральское море',
      flag: '🇰🇿',
      period: '1991–2035',
      description: 'Величайшая экологическая катастрофа XX века.',
      color: 'from-yellow-600 to-amber-800',
      available: false,
    },
    {
      id: 'tigris',
      name: 'Тигр и Евфрат — Турция',
      flag: '🇹🇷',
      period: '2023–2045',
      description: 'Проект GAP и судьба Месопотамии.',
      color: 'from-amber-600 to-yellow-700',
      available: false,
    },
    {
      id: 'colorado',
      name: 'Колорадо — США',
      flag: '🇺🇸',
      period: '2026–2050',
      description: 'Засуха на американском Западе.',
      color: 'from-red-600 to-orange-700',
      available: false,
    },
    {
      id: 'un',
      name: 'Blue Helmets — ООН',
      flag: '🇺🇳',
      period: '2025–2050',
      description: 'Дипломатия без армии. Только переговоры.',
      color: 'from-blue-500 to-blue-700',
      available: false,
    },
  ];

  const difficulties = [
    { id: 'nobel', name: 'Nobel Peace Prize', description: 'Для знакомства с игрой' },
    { id: 'realistic', name: 'Realistic', description: 'Рекомендуется', recommended: true },
    { id: 'hard', name: 'Hard', description: 'Сложно, но возможно' },
    { id: 'brutal', name: 'Brutal', description: 'Для опытных игроков' },
    { id: 'nightmare', name: 'Nightmare', description: 'Почти невозможно' },
    { id: 'hell', name: 'Hell on Earth', description: 'Историческая точность' },
  ];

  const [selectedDifficulty, setSelectedDifficulty] = useState('realistic');

  return (
    <div className="min-h-screen bg-[#0F1117] text-[#E8E7E4]">
      {/* Header */}
      <header className="py-8 text-center border-b border-gray-800 relative">
        <h1 className="text-5xl font-extralight tracking-wider mb-2" style={{ fontFamily: 'PP Mori, Inter, sans-serif' }}>
          ТОЧКА КИПЕНИЯ
        </h1>
        <p className="text-gray-500">Стратегия водных конфликтов</p>
        
        {/* Google + Settings */}
        <div className="absolute top-8 right-8 flex gap-3">
          {googleUser ? (
            <div className="bg-green-900/50 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <img src={googleUser.photoURL || ''} alt="" className="w-6 h-6 rounded-full" />
              {googleUser.displayName || googleUser.email}
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Войти через Google
            </button>
          )}
          <button
            onClick={onSettings}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            ⚙️ Настройки
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8">
        {/* Saved Campaigns */}
        {saves.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">📂 Сохранённые кампании:</h2>
            <div className="grid grid-cols-1 gap-3">
              {saves.map(save => (
                <button
                  key={save.campaignId}
                  onClick={() => handleContinueSave(save.campaignId)}
                  className="p-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/50 rounded-xl hover:border-blue-400 transition-all text-left flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-blue-400">
                      ▶️ Продолжить: {save.campaignName}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Сохранено: {new Date(save.timestamp).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <span className="text-3xl">▶️</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tutorial Section */}
        {!tutorialCompleted && !allUnlocked && (
          <div className="mb-8 p-6 bg-gradient-to-r from-[#FFB74D]/20 to-[#D94F3B]/20 
                          border-2 border-[#FFB74D] rounded-xl animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#FFB74D] mb-2">
                  🎓 Обучение обязательно
                </h2>
                <p className="text-gray-300">
                  Пройдите обучающую кампанию "Тигр и Евфрат — Турция, 2015–2025" 
                  для разблокировки остальных кампаний.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Длительность: ~15 минут • Невозможно проиграть • Все механики объясняются
                </p>
              </div>
              <button
                onClick={onTutorial}
                className="px-8 py-4 bg-[#FFB74D] hover:bg-[#FFA726] text-black font-bold 
                           rounded-lg transition-all transform hover:scale-105 text-lg whitespace-nowrap"
              >
                Начать обучение →
              </button>
            </div>
          </div>
        )}

        {/* Tutorial Available (for experienced players) */}
        {allUnlocked && !tutorialCompleted && (
          <div className="mb-8 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-2xl">🎓</span>
              <div>
                <p className="text-blue-400 font-semibold">Обучение доступно</p>
                <p className="text-gray-500 text-sm">Вы можете пройти обучение в любое время</p>
              </div>
            </div>
            <button
              onClick={onTutorial}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              Пройти обучение
            </button>
          </div>
        )}

        {/* Tutorial Completed Badge */}
        {tutorialCompleted && (
          <div className="mb-8 p-4 bg-green-900/30 border border-green-500 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">✅</span>
              <div>
                <p className="text-green-400 font-semibold">Обучение пройдено!</p>
                <p className="text-gray-500 text-sm">Все кампании разблокированы</p>
              </div>
            </div>
            <button
              onClick={onTutorial}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm"
            >
              Повторить обучение
            </button>
          </div>
        )}

        {/* Difficulty Selection */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Выберите сложность:</h2>
          <div className="grid grid-cols-6 gap-2">
            {difficulties.map(diff => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`
                  p-3 rounded-lg border transition-all text-center
                  ${selectedDifficulty === diff.id
                    ? 'border-[#FFB74D] bg-[#FFB74D]/10'
                    : 'border-gray-700 hover:border-gray-500'
                  }
                `}
              >
                <p className={`font-medium text-sm ${diff.recommended ? 'text-[#FFB74D]' : ''}`}>
                  {diff.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">{diff.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Selection */}
        <h2 className="text-xl font-semibold mb-4">Выберите кампанию:</h2>
        <div className="grid grid-cols-2 gap-4">
          {campaigns.map(campaign => (
            <button
              key={campaign.id}
              onClick={() => campaign.available && handleStartNew(campaign.id)}
              disabled={!campaign.available}
              className={`
                relative p-6 rounded-xl text-left transition-all overflow-hidden
                ${campaign.available
                  ? 'hover:scale-[1.02] cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
                }
              `}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${campaign.color} opacity-20`} />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-2xl">{campaign.flag}</span>
                    {campaign.name}
                  </h3>
                  <span className="text-sm text-gray-400">{campaign.period}</span>
                </div>
                <p className="text-sm text-gray-400">{campaign.description}</p>
                
                {!campaign.available && !tutorialCompleted && !allUnlocked && (
                  <div className="mt-3 text-xs text-yellow-500">
                    🔒 Пройдите обучение для разблокировки
                  </div>
                )}

                {!campaign.available && (tutorialCompleted || allUnlocked) && (
                  <div className="mt-3 text-xs text-yellow-500">
                    🔒 Скоро
                  </div>
                )}
                
                {campaign.available && (
                  <div className="mt-3 text-sm text-green-400">
                    ▶ Начать игру
                  </div>
                )}
              </div>

              {/* Border */}
              <div className={`absolute inset-0 border rounded-xl ${campaign.available ? 'border-gray-600' : 'border-gray-800'}`} />
            </button>
          ))}
        </div>

        {/* Game Info */}
        <div className="mt-12 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-3">Как играть:</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• <strong>Выберите регион</strong> в левой панели, нажав на карточку</li>
            <li>• <strong>Активируйте инициативы</strong> в правой панели для изменения показателей региона</li>
            <li>• <strong>Следите за балансом</strong> — водный стресс, социальное напряжение и доверие к власти</li>
            <li>• <strong>Избегайте критических значений</strong> — выше 95% приводит к проигрышу</li>
            <li>• <strong>Дотяните до целевого года</strong> — это победа</li>
          </ul>
        </div>

        {/* Reset Progress Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              localStorage.removeItem('tutorialCompleted');
              localStorage.removeItem('hasAnsweredExperience');
              localStorage.removeItem('isExperiencedPlayer');
              window.location.reload();
            }}
            className="text-gray-600 hover:text-gray-400 text-sm underline"
          >
            Сбросить прогресс
          </button>
        </div>

        {/* Credits */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>«Точка кипения» — стратегия о водных конфликтах</p>
          <p className="mt-1">Каждое решение имеет цену в миллионах человеческих жизней.</p>
        </div>
      </div>
    </div>
  );
};

// Main App Content
const AppContent: React.FC = () => {
  const [screen, setScreen] = useState<'experience' | 'menu' | 'tutorial' | 'game' | 'india'>('experience');
  const [showSettings, setShowSettings] = useState(false);
  const [tutorialCompleted, setTutorialCompleted] = useState(() => {
    return localStorage.getItem('tutorialCompleted') === 'true';
  });
  const [allUnlocked, setAllUnlocked] = useState(() => {
    return localStorage.getItem('isExperiencedPlayer') === 'true';
  });
  const [hasAnsweredExperience, setHasAnsweredExperience] = useState(() => {
    return localStorage.getItem('hasAnsweredExperience') === 'true';
  });
  const [, setSelectedCampaign] = useState<string | null>(null);

  // Determine initial screen
  useEffect(() => {
    if (hasAnsweredExperience || tutorialCompleted) {
      setScreen('menu');
    } else {
      setScreen('experience');
    }
  }, [hasAnsweredExperience, tutorialCompleted]);

  const handleNewPlayer = () => {
    localStorage.setItem('hasAnsweredExperience', 'true');
    localStorage.setItem('isExperiencedPlayer', 'false');
    setHasAnsweredExperience(true);
    setAllUnlocked(false);
    setScreen('tutorial');
  };

  const handleExperiencedPlayer = () => {
    localStorage.setItem('hasAnsweredExperience', 'true');
    localStorage.setItem('isExperiencedPlayer', 'true');
    setHasAnsweredExperience(true);
    setAllUnlocked(true);
    setScreen('menu');
  };

  const handleCampaignSelect = (campaign: string) => {
    setSelectedCampaign(campaign);
    if (campaign === 'indus') {
      setScreen('india');
    } else {
      setScreen('game');
    }
  };

  const handleTutorialStart = () => {
    setScreen('tutorial');
  };

  const handleTutorialComplete = () => {
    setTutorialCompleted(true);
    localStorage.setItem('tutorialCompleted', 'true');
    setScreen('menu');
  };

  const handleTutorialExit = () => {
    setScreen('menu');
  };

  if (screen === 'experience') {
    return (
      <ExperienceQuestion 
        onNewPlayer={handleNewPlayer}
        onExperienced={handleExperiencedPlayer}
      />
    );
  }

  if (screen === 'tutorial') {
    return (
      <TutorialProvider>
        <TutorialWrapper onComplete={handleTutorialComplete} onExit={handleTutorialExit} />
      </TutorialProvider>
    );
  }

  if (screen === 'india') {
    return (
      <IndiaGameProvider>
        <IndiaCampaignScreen onExit={() => setScreen('menu')} />
      </IndiaGameProvider>
    );
  }

  if (screen === 'game') {
    return (
      <GameProvider>
        <GameScreen onExit={() => setScreen('menu')} />
      </GameProvider>
    );
  }

  return (
    <>
      <CampaignSelection 
        onSelect={handleCampaignSelect} 
        onTutorial={handleTutorialStart}
        tutorialCompleted={tutorialCompleted}
        allUnlocked={allUnlocked}
        onSettings={() => setShowSettings(true)}
      />
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </>
  );
};

// Main App Component with SettingsProvider
const App: React.FC = () => {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
};

export default App;
