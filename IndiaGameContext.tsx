import React, { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from 'react';

// Types
export interface IndiaRegion {
  id: string;
  name: string;
  waterStress: number;
  socialTension: number;
  trustInGovernment: number;
  militias: number;
  population: number;
  agriculture: number;
  isCoastal: boolean;
  isBorder: boolean;
}

export interface IndiaInitiative {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number;
  category: 'civil' | 'diplomatic' | 'military';
  effects: {
    waterStress?: number;
    socialTension?: number;
    trustInGovernment?: number;
    nuclearTimer?: number;
    internationalPressure?: number;
    pakistanStress?: number;
  };
  hiddenEffects?: string;
  requiresRegion?: boolean;
  cooldown?: number;
  lastUsed?: number;
  isActive?: boolean;
  completionDate?: number;
}

export interface IndiaGameState {
  year: number;
  month: number;
  budget: number;
  nuclearTimer: number; // Days until nuclear war (starts at 90)
  internationalPressure: number;
  pakistanTrust: number;
  pakistanStress: number;
  pakistanPopulation: number;
  regions: IndiaRegion[];
  initiatives: IndiaInitiative[];
  activeInitiatives: IndiaInitiative[];
  selectedRegion: string | null;
  gameSpeed: number;
  gameOver: boolean;
  victory: boolean;
  notifications: Array<{ id: string; message: string; type: 'info' | 'warning' | 'critical' | 'success' }>;
  riversClosed: {
    beas: boolean;
    ravi: boolean;
    sutlej: boolean;
  };
  lastEmergencyRelease: number; // Year of last emergency release
}

// Initial state
const initialRegions: IndiaRegion[] = [
  { id: 'punjab', name: 'Пенджаб', waterStress: 89, socialTension: 45, trustInGovernment: 62, militias: 0, population: 31, agriculture: 85, isCoastal: false, isBorder: true },
  { id: 'haryana', name: 'Харьяна', waterStress: 82, socialTension: 38, trustInGovernment: 68, militias: 0, population: 29, agriculture: 78, isCoastal: false, isBorder: false },
  { id: 'rajasthan', name: 'Раджастхан', waterStress: 78, socialTension: 42, trustInGovernment: 58, militias: 0, population: 81, agriculture: 45, isCoastal: false, isBorder: true },
  { id: 'himachal', name: 'Химачал-Прадеш', waterStress: 35, socialTension: 18, trustInGovernment: 78, militias: 0, population: 7, agriculture: 35, isCoastal: false, isBorder: true },
  { id: 'uttarakhand', name: 'Уттаракханд', waterStress: 42, socialTension: 22, trustInGovernment: 72, militias: 0, population: 11, agriculture: 38, isCoastal: false, isBorder: true },
  { id: 'delhi', name: 'Дели', waterStress: 72, socialTension: 55, trustInGovernment: 52, militias: 0, population: 32, agriculture: 5, isCoastal: false, isBorder: false },
  { id: 'up', name: 'Уттар-Прадеш', waterStress: 68, socialTension: 48, trustInGovernment: 55, militias: 0, population: 241, agriculture: 72, isCoastal: false, isBorder: false },
  { id: 'gujarat', name: 'Гуджарат', waterStress: 65, socialTension: 32, trustInGovernment: 70, militias: 0, population: 71, agriculture: 55, isCoastal: true, isBorder: true },
  { id: 'mp', name: 'Мадхья-Прадеш', waterStress: 58, socialTension: 35, trustInGovernment: 62, militias: 0, population: 85, agriculture: 62, isCoastal: false, isBorder: false },
  { id: 'maharashtra', name: 'Махараштра', waterStress: 55, socialTension: 38, trustInGovernment: 65, militias: 0, population: 126, agriculture: 58, isCoastal: true, isBorder: false },
  { id: 'kashmir', name: 'Джамму и Кашмир', waterStress: 28, socialTension: 72, trustInGovernment: 35, militias: 2, population: 14, agriculture: 25, isCoastal: false, isBorder: true },
  { id: 'ladakh', name: 'Ладакх', waterStress: 22, socialTension: 28, trustInGovernment: 65, militias: 0, population: 0.3, agriculture: 8, isCoastal: false, isBorder: true },
  { id: 'chandigarh', name: 'Чандигарх', waterStress: 55, socialTension: 25, trustInGovernment: 75, militias: 0, population: 1.2, agriculture: 2, isCoastal: false, isBorder: false },
  { id: 'bihar', name: 'Бихар', waterStress: 62, socialTension: 52, trustInGovernment: 48, militias: 0, population: 128, agriculture: 68, isCoastal: false, isBorder: false },
  { id: 'jharkhand', name: 'Джаркханд', waterStress: 52, socialTension: 45, trustInGovernment: 52, militias: 1, population: 40, agriculture: 42, isCoastal: false, isBorder: false },
];

const initialInitiatives: IndiaInitiative[] = [
  // River control - unique to India campaign
  {
    id: 'close-beas',
    name: 'Перекрытие Беас',
    description: 'Полностью перекрыть восточную реку Беас',
    cost: 0,
    duration: 0,
    category: 'military',
    effects: { pakistanStress: 8, nuclearTimer: -25 },
    hiddenEffects: 'Ядерный таймер: -25 дней',
  },
  {
    id: 'close-ravi',
    name: 'Перекрытие Рави',
    description: 'Полностью перекрыть восточную реку Рави',
    cost: 0,
    duration: 0,
    category: 'military',
    effects: { pakistanStress: 12, nuclearTimer: -25 },
    hiddenEffects: 'Ядерный таймер: -25 дней',
  },
  {
    id: 'close-sutlej',
    name: 'Перекрытие Сатледж',
    description: 'Полностью перекрыть восточную реку Сатледж',
    cost: 0,
    duration: 0,
    category: 'military',
    effects: { pakistanStress: 15, nuclearTimer: -25 },
    hiddenEffects: 'Ядерный таймер: -25 дней',
  },
  {
    id: 'sindh-tao',
    name: 'Операция Синдх Тао',
    description: 'Полное перекрытие Инда на 120 дней. Пакистан теряет 42 млрд м³.',
    cost: 4000,
    duration: 0,
    category: 'military',
    effects: { pakistanStress: 45, nuclearTimer: -80 },
    hiddenEffects: 'Ядерный таймер мгновенно падает до 10 дней!',
  },
  {
    id: 'emergency-release',
    name: 'Аварийный спуск воды',
    description: 'Экстренный сброс воды в Пакистан. Можно раз в 5 лет.',
    cost: 2000,
    duration: 0,
    category: 'diplomatic',
    effects: { nuclearTimer: 45, internationalPressure: -30, pakistanStress: -15 },
    hiddenEffects: 'Можно использовать только раз в 5 лет',
    cooldown: 60, // 5 years = 60 months
  },
  // Civil initiatives
  {
    id: 'drip-irrigation-1',
    name: 'Капельное орошение ур. 1',
    description: 'Внедрение капельного орошения в выбранном регионе',
    cost: 180,
    duration: 18,
    category: 'civil',
    effects: { waterStress: -12 },
    hiddenEffects: '+4% социального напряжения первые 2 года',
    requiresRegion: true,
  },
  {
    id: 'drip-irrigation-2',
    name: 'Капельное орошение ур. 2 (Израильский стандарт)',
    description: 'Продвинутая система капельного орошения',
    cost: 1200,
    duration: 36,
    category: 'civil',
    effects: { waterStress: -28 },
    hiddenEffects: '-8 доверия к власти в регионе',
    requiresRegion: true,
  },
  {
    id: 'desalination-gujarat',
    name: 'Десалинизация Гуджарат',
    description: 'Строительство опреснительных установок на побережье Гуджарата',
    cost: 3500,
    duration: 48,
    category: 'civil',
    effects: { waterStress: -22 },
    hiddenEffects: '+1.2 млрд $/год эксплуатация',
  },
  {
    id: 'canal-lining',
    name: 'Облицовка каналов бетоном',
    description: 'Снижение потерь воды на фильтрацию',
    cost: 850,
    duration: 48,
    category: 'civil',
    effects: { waterStress: -18 },
    hiddenEffects: '+15 напряжения в нижних регионах',
  },
  {
    id: 'virtual-water',
    name: 'Импорт виртуальной воды',
    description: 'Закупка зерна вместо выращивания',
    cost: 600,
    duration: 0,
    category: 'civil',
    effects: { waterStress: -15, internationalPressure: 8 },
  },
  // Diplomatic
  {
    id: 'joint-monitoring',
    name: 'Совместный мониторинг стока',
    description: 'Прозрачность данных о водном стоке',
    cost: 80,
    duration: 12,
    category: 'diplomatic',
    effects: { nuclearTimer: 15, pakistanStress: -5 },
  },
  {
    id: 'secret-talks',
    name: 'Секретные переговоры',
    description: 'Тайные переговоры с Пакистаном',
    cost: 200,
    duration: 6,
    category: 'diplomatic',
    effects: { nuclearTimer: 30 },
    hiddenEffects: '50% шанс утечки → -20 доверия',
  },
  {
    id: 'international-arbitration',
    name: 'Международный арбитраж',
    description: 'Обращение в Гаагу',
    cost: 450,
    duration: 96,
    category: 'diplomatic',
    effects: { internationalPressure: -25 },
    hiddenEffects: '50% шанс проигрыша → -40 к таймеру',
  },
  // Military
  {
    id: 'infrastructure-guard',
    name: 'Охрана инфраструктуры',
    description: 'Военизированная охрана плотин',
    cost: 400,
    duration: 12,
    category: 'military',
    effects: { socialTension: 8 },
    hiddenEffects: '-60% успеха терактов',
  },
  {
    id: 'emergency-state',
    name: 'Чрезвычайное положение',
    description: 'Ввести ЧП в регионе',
    cost: 0,
    duration: 0,
    category: 'military',
    effects: { socialTension: -40, trustInGovernment: -30 },
    requiresRegion: true,
  },
];

const initialState: IndiaGameState = {
  year: 2025,
  month: 8, // August
  budget: 87,
  nuclearTimer: 90,
  internationalPressure: 35,
  pakistanTrust: -72,
  pakistanStress: 96,
  pakistanPopulation: 240,
  regions: initialRegions,
  initiatives: initialInitiatives,
  activeInitiatives: [],
  selectedRegion: null,
  gameSpeed: 0,
  gameOver: false,
  victory: false,
  notifications: [],
  riversClosed: {
    beas: false,
    ravi: false,
    sutlej: false,
  },
  lastEmergencyRelease: 0,
};

// Actions
type IndiaAction =
  | { type: 'SELECT_REGION'; regionId: string | null }
  | { type: 'ACTIVATE_INITIATIVE'; initiativeId: string; targetRegion?: string }
  | { type: 'ADVANCE_TIME' }
  | { type: 'SET_SPEED'; speed: number }
  | { type: 'ADD_NOTIFICATION'; notification: { message: string; type: 'info' | 'warning' | 'critical' | 'success' } }
  | { type: 'DISMISS_NOTIFICATION'; id: string }
  | { type: 'CLOSE_RIVER'; river: 'beas' | 'ravi' | 'sutlej' }
  | { type: 'TRIGGER_NUCLEAR_DRILLS' };

// Reducer
function indiaReducer(state: IndiaGameState, action: IndiaAction): IndiaGameState {
  switch (action.type) {
    case 'SELECT_REGION':
      return { ...state, selectedRegion: action.regionId };

    case 'SET_SPEED':
      return { ...state, gameSpeed: action.speed };

    case 'CLOSE_RIVER': {
      const newRiversClosed = { ...state.riversClosed, [action.river]: true };
      let timerReduction = 25;
      let stressIncrease = action.river === 'beas' ? 8 : action.river === 'ravi' ? 12 : 15;
      
      return {
        ...state,
        riversClosed: newRiversClosed,
        nuclearTimer: Math.max(0, state.nuclearTimer - timerReduction),
        pakistanStress: Math.min(100, state.pakistanStress + stressIncrease),
        notifications: [
          ...state.notifications,
          {
            id: Date.now().toString(),
            message: `Река ${action.river === 'beas' ? 'Беас' : action.river === 'ravi' ? 'Рави' : 'Сатледж'} перекрыта! Ядерный таймер: -${timerReduction} дней`,
            type: 'critical',
          },
        ],
      };
    }

    case 'ACTIVATE_INITIATIVE': {
      const initiative = state.initiatives.find(i => i.id === action.initiativeId);
      if (!initiative) return state;
      if (state.budget < initiative.cost) return state;

      // Special handling for emergency release cooldown
      if (initiative.id === 'emergency-release') {
        const monthsSinceLastUse = (state.year * 12 + state.month) - state.lastEmergencyRelease;
        if (state.lastEmergencyRelease > 0 && monthsSinceLastUse < 60) {
          return {
            ...state,
            notifications: [
              ...state.notifications,
              {
                id: Date.now().toString(),
                message: `Аварийный спуск воды доступен через ${60 - monthsSinceLastUse} месяцев`,
                type: 'warning',
              },
            ],
          };
        }
      }

      // River closing
      if (initiative.id === 'close-beas' && !state.riversClosed.beas) {
        return indiaReducer(state, { type: 'CLOSE_RIVER', river: 'beas' });
      }
      if (initiative.id === 'close-ravi' && !state.riversClosed.ravi) {
        return indiaReducer(state, { type: 'CLOSE_RIVER', river: 'ravi' });
      }
      if (initiative.id === 'close-sutlej' && !state.riversClosed.sutlej) {
        return indiaReducer(state, { type: 'CLOSE_RIVER', river: 'sutlej' });
      }

      // Sindh Tao operation
      if (initiative.id === 'sindh-tao') {
        return {
          ...state,
          budget: state.budget - initiative.cost,
          nuclearTimer: 10, // Drops to 10 days immediately
          pakistanStress: Math.min(100, state.pakistanStress + 45),
          notifications: [
            ...state.notifications,
            {
              id: Date.now().toString(),
              message: 'ОПЕРАЦИЯ СИНДХ ТАО! Инд полностью перекрыт. Ядерный таймер: 10 дней!',
              type: 'critical',
            },
          ],
        };
      }

      // Emergency release
      if (initiative.id === 'emergency-release') {
        return {
          ...state,
          budget: state.budget - initiative.cost,
          nuclearTimer: Math.min(90, state.nuclearTimer + 45),
          internationalPressure: Math.max(0, state.internationalPressure - 30),
          pakistanStress: Math.max(0, state.pakistanStress - 15),
          lastEmergencyRelease: state.year * 12 + state.month,
          notifications: [
            ...state.notifications,
            {
              id: Date.now().toString(),
              message: 'Аварийный спуск воды в Пакистан! Ядерный таймер: +45 дней',
              type: 'success',
            },
          ],
        };
      }

      // Apply effects to selected region
      let newRegions = [...state.regions];
      if (initiative.requiresRegion && action.targetRegion) {
        newRegions = state.regions.map(region => {
          if (region.id === action.targetRegion) {
            return {
              ...region,
              waterStress: Math.max(0, Math.min(100, region.waterStress + (initiative.effects.waterStress || 0))),
              socialTension: Math.max(0, Math.min(100, region.socialTension + (initiative.effects.socialTension || 0))),
              trustInGovernment: Math.max(0, Math.min(100, region.trustInGovernment + (initiative.effects.trustInGovernment || 0))),
            };
          }
          return region;
        });
      }

      // Add to active initiatives if has duration
      const newActiveInitiatives = initiative.duration > 0
        ? [...state.activeInitiatives, { ...initiative, isActive: true, completionDate: state.year * 12 + state.month + initiative.duration }]
        : state.activeInitiatives;

      return {
        ...state,
        budget: state.budget - initiative.cost,
        regions: newRegions,
        activeInitiatives: newActiveInitiatives,
        nuclearTimer: Math.max(0, state.nuclearTimer + (initiative.effects.nuclearTimer || 0)),
        internationalPressure: Math.max(0, Math.min(100, state.internationalPressure + (initiative.effects.internationalPressure || 0))),
        pakistanStress: Math.max(0, Math.min(100, state.pakistanStress + (initiative.effects.pakistanStress || 0))),
        notifications: [
          ...state.notifications,
          {
            id: Date.now().toString(),
            message: `Инициатива "${initiative.name}" активирована`,
            type: 'info',
          },
        ],
      };
    }

    case 'ADVANCE_TIME': {
      // Check for game over
      if (state.nuclearTimer <= 0) {
        return { ...state, gameOver: true, victory: false, gameSpeed: 0 };
      }

      // Check for victory (reached December 2045)
      if (state.year >= 2045 && state.month >= 12) {
        return { ...state, gameOver: true, victory: true, gameSpeed: 0 };
      }

      // Advance month
      let newMonth = state.month + 1;
      let newYear = state.year;
      if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      }

      // Nuclear timer decreases every month (roughly 3-5 days)
      const timerDecrease = Math.floor(Math.random() * 3) + 2;
      const newNuclearTimer = Math.max(0, state.nuclearTimer - timerDecrease);

      // Pakistan population grows
      const populationGrowth = state.pakistanPopulation < 410 ? 0.7 : 0;
      const newPakistanPopulation = Math.min(410, state.pakistanPopulation + populationGrowth);

      // Pakistan stress increases if rivers are closed
      let pakistanStressChange = 0;
      if (state.riversClosed.beas) pakistanStressChange += 0.3;
      if (state.riversClosed.ravi) pakistanStressChange += 0.4;
      if (state.riversClosed.sutlej) pakistanStressChange += 0.5;
      
      // Regions slowly degrade
      const newRegions = state.regions.map(region => ({
        ...region,
        waterStress: Math.min(100, region.waterStress + (Math.random() * 0.3)),
        socialTension: Math.min(100, region.socialTension + (region.waterStress > 80 ? 0.5 : 0.1)),
      }));

      // Check completed initiatives
      const currentTime = newYear * 12 + newMonth;
      const completedInitiatives = state.activeInitiatives.filter(
        i => i.completionDate && currentTime >= i.completionDate
      );
      const stillActiveInitiatives = state.activeInitiatives.filter(
        i => !i.completionDate || currentTime < i.completionDate
      );

      // Apply completed initiative effects
      let finalRegions = newRegions;
      completedInitiatives.forEach(initiative => {
        if (initiative.requiresRegion && state.selectedRegion) {
          finalRegions = finalRegions.map(region => {
            if (region.id === state.selectedRegion) {
              return {
                ...region,
                waterStress: Math.max(0, Math.min(100, region.waterStress + (initiative.effects.waterStress || 0))),
              };
            }
            return region;
          });
        }
      });

      // Random events
      const newNotifications = [...state.notifications];
      
      // Nuclear drills event (every 3 years roughly)
      if (Math.random() < 0.03 && newMonth === 1) {
        newNotifications.push({
          id: Date.now().toString(),
          message: '⚠️ Пакистан проводит ядерные учения!',
          type: 'critical',
        });
      }

      // Budget increases yearly
      const yearlyBudget = newMonth === 1 ? 12 : 0;

      // Check for nuclear war
      if (newNuclearTimer <= 0) {
        return {
          ...state,
          year: newYear,
          month: newMonth,
          nuclearTimer: 0,
          gameOver: true,
          victory: false,
          gameSpeed: 0,
        };
      }

      return {
        ...state,
        year: newYear,
        month: newMonth,
        budget: state.budget + yearlyBudget,
        nuclearTimer: newNuclearTimer,
        pakistanPopulation: newPakistanPopulation,
        pakistanStress: Math.min(100, state.pakistanStress + pakistanStressChange),
        regions: finalRegions,
        activeInitiatives: stillActiveInitiatives,
        notifications: newNotifications,
      };
    }

    case 'TRIGGER_NUCLEAR_DRILLS':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now().toString(),
            message: '⚠️ ПАКИСТАН ПРОВОДИТ ЯДЕРНЫЕ УЧЕНИЯ! Вспышки на горизонте.',
            type: 'critical',
          },
        ],
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          { ...action.notification, id: Date.now().toString() },
        ],
      };

    case 'DISMISS_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.id),
      };

    default:
      return state;
  }
}

// Context
interface IndiaGameContextType {
  state: IndiaGameState;
  dispatch: React.Dispatch<IndiaAction>;
  selectRegion: (regionId: string | null) => void;
  activateInitiative: (initiativeId: string, targetRegion?: string) => void;
  advanceTime: () => void;
  setSpeed: (speed: number) => void;
  closeRiver: (river: 'beas' | 'ravi' | 'sutlej') => void;
}

const IndiaGameContext = createContext<IndiaGameContextType | null>(null);

export const IndiaGameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(indiaReducer, initialState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance time based on game speed
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (state.gameSpeed > 0 && !state.gameOver) {
      const speeds = [0, 4000, 2000, 800];
      const interval = speeds[state.gameSpeed] || 2000;
      
      timerRef.current = setInterval(() => {
        dispatch({ type: 'ADVANCE_TIME' });
      }, interval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.gameSpeed, state.gameOver]);

  const selectRegion = (regionId: string | null) => {
    dispatch({ type: 'SELECT_REGION', regionId });
  };

  const activateInitiative = (initiativeId: string, targetRegion?: string) => {
    dispatch({ type: 'ACTIVATE_INITIATIVE', initiativeId, targetRegion });
  };

  const advanceTime = () => {
    dispatch({ type: 'ADVANCE_TIME' });
  };

  const setSpeed = (speed: number) => {
    dispatch({ type: 'SET_SPEED', speed });
  };

  const closeRiver = (river: 'beas' | 'ravi' | 'sutlej') => {
    dispatch({ type: 'CLOSE_RIVER', river });
  };

  return (
    <IndiaGameContext.Provider
      value={{
        state,
        dispatch,
        selectRegion,
        activateInitiative,
        advanceTime,
        setSpeed,
        closeRiver,
      }}
    >
      {children}
    </IndiaGameContext.Provider>
  );
};

export const useIndiaGame = () => {
  const context = useContext(IndiaGameContext);
  if (!context) {
    throw new Error('useIndiaGame must be used within an IndiaGameProvider');
  }
  return context;
};
