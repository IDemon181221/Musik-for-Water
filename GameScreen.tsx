import { useEffect, useRef, useState, useCallback } from 'react';
import Header from './Header';
import RegionPanel from './RegionPanel';
import MapView from './MapView';
import InitiativesPanel from './InitiativesPanel';
import EventTimeline from './EventTimeline';
import { useGame } from '../context/GameContext';
import { saveLocal, saveToServer, SaveStatus } from '../systems/SaveSystem';

const MUSIC_URL = 'https://raw.githubusercontent.com/IDemon181221/Musik-for-Water/main/Decisions%20and%20Consequences%20(Intense%20Minor%20Take%201).mp3';

function CampaignMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    const w = window as unknown as Record<string, unknown>;
    audio.volume = w.gameAudioVolume ? Number(w.gameAudioVolume) / 100 : 0.5;
    audioRef.current = audio;
    const tryPlay = () => { audio.play().catch(() => {}); };
    tryPlay();
    const onClick = () => { tryPlay(); document.removeEventListener('click', onClick); };
    document.addEventListener('click', onClick);
    const checkVolume = setInterval(() => {
      const vol = (window as unknown as Record<string, unknown>).gameAudioVolume;
      if (vol !== undefined && audioRef.current) {
        audioRef.current.volume = Number(vol) / 100;
      }
    }, 500);
    return () => {
      audio.pause(); audio.src = ''; audioRef.current = null;
      document.removeEventListener('click', onClick);
      clearInterval(checkVolume);
    };
  }, []);
  return null;
}

const STATUS_TEXT: Record<SaveStatus, string> = {
  idle: '',
  compressing: '📦 Сжатие данных...',
  verifying: '🔍 Проверка сжатия...',
  uploading: '☁️ Загрузка на сервер...',
  downloading: '📥 Загрузка обратно...',
  final_check: '✅ Финальная проверка...',
  success: '✅ Сохранено успешно!',
  error: '❌ Ошибка сохранения'
};

interface GameScreenProps {
  onExit?: () => void;
}

export default function GameScreen({ onExit }: GameScreenProps) {
  const { state } = useGame();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const prevStateRef = useRef('');

  // Auto-save locally on every state change
  useEffect(() => {
    const key = `${state.year}-${state.month}-${state.budget}-${state.internationalPressure}`;
    if (key !== prevStateRef.current) {
      prevStateRef.current = key;
      saveLocal('nile', state as unknown as Record<string, unknown>, 'Нил — Эфиопия');
    }
  }, [state]);

  // Server save
  const handleServerSave = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus('compressing');
    setSaveMessage('');
    const result = await saveToServer(
      'nile',
      state as unknown as Record<string, unknown>,
      'Нил — Эфиопия',
      (s) => setSaveStatus(s)
    );
    setSaveMessage(result.message);
    if (!result.success) setSaveStatus('error');
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('idle');
      setSaveMessage('');
    }, 3000);
  }, [state]);

  // ESC for pause
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowPauseMenu(p => !p);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0F1117', position: 'relative' }}>
      <CampaignMusic />
      <Header />
      
      <div style={{ paddingTop: 90, paddingBottom: 180 }}>
        <RegionPanel />
        <div style={{ marginLeft: 420, marginRight: 400, height: 'calc(100vh - 270px)' }}>
          <MapView />
        </div>
        <InitiativesPanel />
      </div>
      
      <EventTimeline />

      {/* ===== КНОПКА ДИСКЕТЫ (СОХРАНЕНИЕ НА СЕРВЕР) ===== */}
      <div style={{
        position: 'fixed',
        bottom: 200,
        right: 16,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        <button
          onClick={handleServerSave}
          disabled={isSaving}
          title="Сохранить на сервер"
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: isSaving ? '#555' : 'linear-gradient(135deg, #3B82F6, #2563EB)',
            border: '2px solid rgba(255,255,255,0.2)',
            color: 'white',
            fontSize: 28,
            cursor: isSaving ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(59,130,246,0.5)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={e => { if (!isSaving) (e.target as HTMLElement).style.transform = 'scale(1.1)'; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)'; }}
        >
          💾
        </button>

        <button
          onClick={() => setShowPauseMenu(true)}
          title="Пауза (ESC)"
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #6B7280, #4B5563)',
            border: '2px solid rgba(255,255,255,0.2)',
            color: 'white',
            fontSize: 28,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'scale(1.1)'; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)'; }}
        >
          ⏸️
        </button>
      </div>

      {/* ===== ОВЕРЛЕЙ ПРИ СОХРАНЕНИИ (БЛОКИРУЕТ ВСЮ ИГРУ) ===== */}
      {isSaving && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 999999,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Inter, sans-serif',
          pointerEvents: 'all'
        }}>
          <div style={{ fontSize: 64, marginBottom: 24, animation: 'pulse 1.5s infinite' }}>💾</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
            {STATUS_TEXT[saveStatus]}
          </div>
          {saveMessage && (
            <div style={{
              fontSize: 18,
              textAlign: 'center',
              whiteSpace: 'pre-line',
              color: saveStatus === 'success' ? '#4ADE80' : '#F87171',
              maxWidth: 500,
              lineHeight: 1.6
            }}>
              {saveMessage}
            </div>
          )}
          <div style={{
            marginTop: 32, width: 300, height: 6,
            background: '#333', borderRadius: 3, overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: saveStatus === 'error' ? '#F87171' : saveStatus === 'success' ? '#4ADE80' : '#3B82F6',
              width: saveStatus === 'success' ? '100%' : saveStatus === 'error' ? '100%' : '60%',
              transition: 'width 0.5s, background 0.3s',
              animation: saveStatus !== 'success' && saveStatus !== 'error' ? 'progress-pulse 1.5s infinite' : 'none'
            }} />
          </div>
          <style>{`
            @keyframes progress-pulse {
              0% { width: 20%; }
              50% { width: 80%; }
              100% { width: 20%; }
            }
          `}</style>
        </div>
      )}

      {/* ===== МЕНЮ ПАУЗЫ ===== */}
      {showPauseMenu && !isSaving && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 999998,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            borderRadius: 20,
            padding: 40,
            minWidth: 380,
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>⏸️</div>
            <h2 style={{ color: '#E8E7E4', fontSize: 32, marginBottom: 32, fontWeight: 700 }}>
              Пауза
            </h2>
            
            <button
              onClick={() => setShowPauseMenu(false)}
              style={{
                display: 'block', width: '100%', padding: '14px 24px',
                marginBottom: 12, background: '#3B82F6', color: 'white',
                border: 'none', borderRadius: 10, fontSize: 18,
                cursor: 'pointer', fontWeight: 600,
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = '#2563EB'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = '#3B82F6'; }}
            >
              ▶️ Продолжить
            </button>

            <button
              onClick={() => { setShowPauseMenu(false); handleServerSave(); }}
              style={{
                display: 'block', width: '100%', padding: '14px 24px',
                marginBottom: 12, background: '#10B981', color: 'white',
                border: 'none', borderRadius: 10, fontSize: 18,
                cursor: 'pointer', fontWeight: 600,
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = '#059669'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = '#10B981'; }}
            >
              💾 Сохранить на сервер
            </button>

            <button
              onClick={async () => {
                saveLocal('nile', state as unknown as Record<string, unknown>, 'Нил — Эфиопия');
                if (onExit) onExit();
              }}
              style={{
                display: 'block', width: '100%', padding: '14px 24px',
                marginBottom: 12, background: '#F59E0B', color: 'white',
                border: 'none', borderRadius: 10, fontSize: 18,
                cursor: 'pointer', fontWeight: 600,
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = '#D97706'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = '#F59E0B'; }}
            >
              🚪 Сохранить локально и выйти
            </button>

            <button
              onClick={async () => {
                setShowPauseMenu(false);
                await handleServerSave();
                setTimeout(() => { if (onExit) onExit(); }, 3500);
              }}
              style={{
                display: 'block', width: '100%', padding: '14px 24px',
                background: '#8B5CF6', color: 'white',
                border: 'none', borderRadius: 10, fontSize: 18,
                cursor: 'pointer', fontWeight: 600,
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = '#7C3AED'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = '#8B5CF6'; }}
            >
              ☁️ Сохранить на сервер и выйти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
