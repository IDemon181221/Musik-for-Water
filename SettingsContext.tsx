import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db, googleProvider, isFirebaseConfigured } from '../firebase/config';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface GameSettings {
  musicVolume: number;
  sfxVolume: number;
  fps: 30 | 60 | 120;
  tutorialCompleted: boolean;
  hasAnsweredExperience: boolean;
  isExperiencedPlayer: boolean;
  language: 'ru' | 'en';
}

interface SettingsContextType {
  settings: GameSettings;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  syncToCloud: () => Promise<void>;
  syncFromCloud: () => Promise<void>;
  lastSyncTime: Date | null;
  isFirebaseReady: boolean;
}

const defaultSettings: GameSettings = {
  musicVolume: 70,
  sfxVolume: 80,
  fps: 60,
  tutorialCompleted: false,
  hasAnsweredExperience: false,
  isExperiencedPlayer: false,
  language: 'ru'
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(() => {
    // Загружаем из localStorage
    const saved = localStorage.getItem('gameSettings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    
    // Также проверяем старые ключи
    const tutorialCompleted = localStorage.getItem('tutorialCompleted') === 'true';
    const hasAnsweredExperience = localStorage.getItem('hasAnsweredExperience') === 'true';
    const isExperiencedPlayer = localStorage.getItem('isExperiencedPlayer') === 'true';
    
    return {
      ...defaultSettings,
      tutorialCompleted,
      hasAnsweredExperience,
      isExperiencedPlayer
    };
  });
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Слушаем изменения авторизации
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
      
      // При входе — синхронизируем из облака
      if (firebaseUser) {
        await syncFromCloudInternal(firebaseUser);
      }
    });

    return () => unsubscribe();
  }, []);

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    
    // Также сохраняем старые ключи для совместимости
    localStorage.setItem('tutorialCompleted', String(settings.tutorialCompleted));
    localStorage.setItem('hasAnsweredExperience', String(settings.hasAnsweredExperience));
    localStorage.setItem('isExperiencedPlayer', String(settings.isExperiencedPlayer));
  }, [settings]);

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
  };

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      alert('Firebase не настроен. Смотрите инструкцию в src/firebase/config.ts');
      return;
    }

    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error: unknown) {
      console.error('Sign in error:', error);
      if (error instanceof Error) {
        alert('Ошибка входа: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOutUser = async () => {
    if (!auth) return;
    
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const syncFromCloudInternal = async (firebaseUser: User) => {
    if (!db) return;

    try {
      const docRef = doc(db, 'users', firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const cloudData = docSnap.data() as Partial<GameSettings>;
        setSettings(prev => ({ ...prev, ...cloudData }));
        setLastSyncTime(new Date());
        console.log('Данные загружены из облака');
      }
    } catch (error) {
      console.error('Sync from cloud error:', error);
    }
  };

  const syncToCloud = async () => {
    if (!user || !db) {
      if (!isFirebaseConfigured) {
        alert('Firebase не настроен');
      } else if (!user) {
        alert('Сначала войдите в аккаунт');
      }
      return;
    }

    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        ...settings,
        lastUpdated: new Date().toISOString()
      });
      setLastSyncTime(new Date());
      console.log('Данные сохранены в облако');
    } catch (error) {
      console.error('Sync to cloud error:', error);
      alert('Ошибка сохранения в облако');
    }
  };

  const syncFromCloud = async () => {
    if (!user) {
      alert('Сначала войдите в аккаунт');
      return;
    }
    await syncFromCloudInternal(user);
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      user,
      isLoading,
      signInWithGoogle,
      signOutUser,
      syncToCloud,
      syncFromCloud,
      lastSyncTime,
      isFirebaseReady: isFirebaseConfigured
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
