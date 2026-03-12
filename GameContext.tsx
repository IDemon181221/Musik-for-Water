import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { DamMode } from '../components/DamControlPanel';

// ============================================
// DIFFICULTY SYSTEM
// ============================================
export type DifficultyLevel = 'nobel' | 'realistic' | 'hard' | 'brutal' | 'nightmare' | 'hell' | 'custom';

export interface DifficultySettings {
  name: string;
  description: string;
  startingBudgetModifier: number;
  incomeModifier: number;
  maintenanceModifier: number;
  corruptionRange: [number, number];
  pressureGrowthModifier: number;
  blackSwanFrequency: number;
  populationGrowthModifier: number;
  startingPressure: number;
  startingCivilWars: number;
  blackSwansEnabled: boolean;
  debtServiceModifier: number;
}

export const DIFFICULTY_SETTINGS: Record<DifficultyLevel, DifficultySettings> = {
  nobel: {
    name: 'Nobel Peace Prize',
    description: 'Денег хватает, но уже не тоннами. Дефицит к 2040: −4 млрд $/год',
    startingBudgetModifier: 4.2,
    incomeModifier: 4.2,
    maintenanceModifier: 0.1,
    corruptionRange: [0, 0],
    pressureGrowthModifier: 0.125,
    blackSwanFrequency: 0,
    populationGrowthModifier: 0.33,
    startingPressure: 5,
    startingCivilWars: 0,
    blackSwansEnabled: false,
    debtServiceModifier: 0,
  },
  realistic: {
    name: 'Realistic',
    description: 'Профицит до 2033, потом дефицит. К 2040: −48 млрд $/год',
    startingBudgetModifier: 1.0,
    incomeModifier: 1.0,
    maintenanceModifier: 1.0,
    corruptionRange: [0.04, 0.12],
    pressureGrowthModifier: 1.0,
    blackSwanFrequency: 1.0,
    populationGrowthModifier: 1.0,
    startingPressure: 15,
    startingCivilWars: 0,
    blackSwansEnabled: true,
    debtServiceModifier: 1.0,
  },
  hard: {
    name: 'Жёсткий',
    description: 'Дефицит с 2030. К 2040: −99 млрд $/год',
    startingBudgetModifier: 0.75,
    incomeModifier: 0.72,
    maintenanceModifier: 1.6,
    corruptionRange: [0.08, 0.18],
    pressureGrowthModifier: 1.5,
    blackSwanFrequency: 1.4,
    populationGrowthModifier: 1.15,
    startingPressure: 25,
    startingCivilWars: 0,
    blackSwansEnabled: true,
    debtServiceModifier: 1.35,
  },
  brutal: {
    name: 'Brutal',
    description: 'Дефицит с первого года. К 2040: −144 млрд $/год',
    startingBudgetModifier: 0.55,
    incomeModifier: 0.52,
    maintenanceModifier: 2.2,
    corruptionRange: [0.12, 0.28],
    pressureGrowthModifier: 2.2,
    blackSwanFrequency: 1.9,
    populationGrowthModifier: 1.25,
    startingPressure: 35,
    startingCivilWars: 0,
    blackSwansEnabled: true,
    debtServiceModifier: 1.8,
  },
  nightmare: {
    name: 'Nightmare',
    description: 'Банкрот с первого года. К 2040: −267 млрд $/год. Гражданская война.',
    startingBudgetModifier: 0.35,
    incomeModifier: 0.38,
    maintenanceModifier: 3.0,
    corruptionRange: [0.18, 0.38],
    pressureGrowthModifier: 3.0,
    blackSwanFrequency: 2.5,
    populationGrowthModifier: 1.5,
    startingPressure: 60,
    startingCivilWars: 1,
    blackSwansEnabled: true,
    debtServiceModifier: 2.4,
  },
  hell: {
    name: 'Hell on Earth',
    description: 'К 2040: −428 млрд $/год. Коррупция 35-55%. Две войны. 182 часа прохождения.',
    startingBudgetModifier: 0.2,
    incomeModifier: 0.25,
    maintenanceModifier: 4.0,
    corruptionRange: [0.35, 0.55],
    pressureGrowthModifier: 5.0,
    blackSwanFrequency: 4.0,
    populationGrowthModifier: 2.0,
    startingPressure: 85,
    startingCivilWars: 2,
    blackSwansEnabled: true,
    debtServiceModifier: 3.5,
  },
  custom: {
    name: 'Custom',
    description: 'Настраиваемые параметры',
    startingBudgetModifier: 1.0,
    incomeModifier: 1.0,
    maintenanceModifier: 1.0,
    corruptionRange: [0.04, 0.12],
    pressureGrowthModifier: 1.0,
    blackSwanFrequency: 1.0,
    populationGrowthModifier: 1.0,
    startingPressure: 15,
    startingCivilWars: 0,
    blackSwansEnabled: true,
    debtServiceModifier: 1.0,
  },
};

// ============================================
// INTERNATIONAL PRESSURE SYSTEM
// ============================================
export interface PressureLevel {
  level: number;
  name: string;
  nameRu: string;
  minPressure: number;
  maxPressure: number;
  color: string;
  effects: {
    incomeReduction: number;
    fertilizerEmbargo: boolean;
    yieldReduction: number;
    assetFreeze: boolean;
    assetFreezeAmount: [number, number];
    creditBan: boolean;
    fullBlockade: boolean;
    blockadeIncomeReduction: number;
    militaryInterventionChance: number;
  };
}

export const PRESSURE_LEVELS: PressureLevel[] = [
  {
    level: 0,
    name: 'Normal',
    nameRu: 'Нормальный',
    minPressure: 0,
    maxPressure: 40,
    color: '#22c55e',
    effects: {
      incomeReduction: 0,
      fertilizerEmbargo: false,
      yieldReduction: 0,
      assetFreeze: false,
      assetFreezeAmount: [0, 0],
      creditBan: false,
      fullBlockade: false,
      blockadeIncomeReduction: 0,
      militaryInterventionChance: 0,
    },
  },
  {
    level: 1,
    name: 'Sanctions',
    nameRu: 'Санкции',
    minPressure: 41,
    maxPressure: 60,
    color: '#eab308',
    effects: {
      incomeReduction: 0.15,
      fertilizerEmbargo: false,
      yieldReduction: 0,
      assetFreeze: false,
      assetFreezeAmount: [0, 0],
      creditBan: false,
      fullBlockade: false,
      blockadeIncomeReduction: 0,
      militaryInterventionChance: 0,
    },
  },
  {
    level: 2,
    name: 'Embargo',
    nameRu: 'Эмбарго',
    minPressure: 61,
    maxPressure: 80,
    color: '#f97316',
    effects: {
      incomeReduction: 0.35,
      fertilizerEmbargo: true,
      yieldReduction: 0.20,
      assetFreeze: false,
      assetFreezeAmount: [0, 0],
      creditBan: false,
      fullBlockade: false,
      blockadeIncomeReduction: 0,
      militaryInterventionChance: 0,
    },
  },
  {
    level: 3,
    name: 'Isolation',
    nameRu: 'Изоляция',
    minPressure: 81,
    maxPressure: 95,
    color: '#ef4444',
    effects: {
      incomeReduction: 0.35,
      fertilizerEmbargo: true,
      yieldReduction: 0.20,
      assetFreeze: true,
      assetFreezeAmount: [2, 8],
      creditBan: true,
      fullBlockade: false,
      blockadeIncomeReduction: 0,
      militaryInterventionChance: 0,
    },
  },
  {
    level: 4,
    name: 'Full Blockade',
    nameRu: 'Полная блокада',
    minPressure: 96,
    maxPressure: 100,
    color: '#7f1d1d',
    effects: {
      incomeReduction: 0.70,
      fertilizerEmbargo: true,
      yieldReduction: 0.35,
      assetFreeze: true,
      assetFreezeAmount: [5, 15],
      creditBan: true,
      fullBlockade: true,
      blockadeIncomeReduction: 0.70,
      militaryInterventionChance: 0.15,
    },
  },
];

export function getPressureLevel(pressure: number): PressureLevel {
  for (let i = PRESSURE_LEVELS.length - 1; i >= 0; i--) {
    if (pressure >= PRESSURE_LEVELS[i].minPressure) {
      return PRESSURE_LEVELS[i];
    }
  }
  return PRESSURE_LEVELS[0];
}

// ============================================
// EMERGENCY STATE SYSTEM
// ============================================
export interface EmergencyState {
  isActive: boolean;
  activatedMonth: number;
  activatedYear: number;
  regionId: string | null;
  monthsActive: number;
  phase: 'initial' | 'degrading' | 'critical';
}

// ============================================
// BUDGET SYSTEM
// ============================================
export interface BudgetBreakdown {
  baseIncome: number;
  pressurePenalty: number;
  corruptionLoss: number;
  debtService: number;
  infrastructureMaintenance: number;
  virtualWaterImport: number;
  activeInitiativesCost: number;
  netIncome: number;
  deficit: number;
}

// ============================================
// CORE TYPES
// ============================================
export interface Dam {
  id: string;
  name: string;
  nameLocal: string;
  country: string;
  river: string;
  maxCapacity: number;
  currentLevel: number;
  currentFlow: number;
  powerGeneration: number;
  turbineCount: number;
  mode: DamMode;
}

export interface Region {
  id: string;
  name: string;
  nameRu: string;
  waterStress: number;
  socialTension: number;
  trustInGov: number;
  militias: number;
  population: number;
  agriculture: number;
  isFlat: boolean;
  isCoastal: boolean;
  activeInitiatives: string[];
  hasEmergency: boolean;
}

export type GameSpeed = 0 | 1 | 2 | 3;

export interface GameState {
  year: number;
  month: number;
  totalMonths: number;
  budget: number;
  debt: number;
  internationalPressure: number;
  damFillLevel: number;
  waterRelease: number;
  selectedRegionId: string | null;
  regions: Region[];
  activeInitiatives: ActiveInitiative[];
  completedInitiatives: string[];
  notifications: GameNotification[];
  gameOver: boolean;
  gameOverReason: string;
  victory: boolean;
  gameSpeed: GameSpeed;
  dam: Dam;
  showDamPanel: boolean;
  downstreamTrust: number;
  canUnlockOverflowMode: boolean;
  difficulty: DifficultyLevel;
  difficultySettings: DifficultySettings;
  emergencyState: EmergencyState;
  budgetBreakdown: BudgetBreakdown;
  infrastructureBuilt: InfrastructureBuilt;
  population: number;
  populationGrowthRate: number;
  assetsFrozen: number;
  lastCorruptionLoss: number;
  iraqWaterStress: number;
  iraqTension: number;
  iraqTrust: number;
}

export interface InfrastructureBuilt {
  dripIrrigationLevel1: number;
  dripIrrigationLevel2: number;
  canalLining: number;
  smallDesalination: number;
  largeDesalination: number;
  wetlandsLevel1: number;
  wetlandsLevel2: number;
  fountains: number;
  pools: number;
  temples: number;
}

export interface ActiveInitiative {
  id: string;
  initiativeId: string;
  regionId: string;
  startMonth: number;
  startYear: number;
  durationMonths: number;
  completed: boolean;
  recurringCost?: number;
}

export interface GameNotification {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  timestamp: number;
}

export interface InitiativeEffects {
  waterStress?: number;
  socialTension?: number;
  trustInGov?: number;
  militias?: number;
  internationalPressure?: number;
  budget?: number;
  damFillLevel?: number;
  waterRelease?: number;
  hiddenWaterStress?: number;
  hiddenSocialTension?: number;
  hiddenTrustInGov?: number;
  nuclearTimer?: number;
  downstreamTrust?: number;
  delayedEffects?: {
    months: number;
    effects: Partial<InitiativeEffects>;
  };
}

// ============================================
// INITIATIVES DATABASE (72 total)
// ============================================
export interface Initiative {
  id: string;
  name: string;
  nameRu: string;
  category: 'civil' | 'diplomatic' | 'military' | 'social';
  cost: number;
  duration: number;
  effects: InitiativeEffects;
  hiddenEffects?: string;
  requirements?: string[];
  isRecurring?: boolean;
  recurringCost?: number;
  level?: number;
  maxLevel?: number;
  maintenanceCost?: number;
}

export const ALL_INITIATIVES: Initiative[] = [
  // ============ CIVIL INITIATIVES (25) ============
  {
    id: 'drip_irrigation_1',
    name: 'Drip Irrigation Level 1',
    nameRu: 'Капельное орошение ур. 1',
    category: 'civil',
    cost: 180,
    duration: 18,
    effects: { waterStress: -12 },
    hiddenEffects: '+4% напряжения первые 2 года',
    level: 1,
    maxLevel: 2,
  },
  {
    id: 'drip_irrigation_2',
    name: 'Drip Irrigation Level 2 (Israeli Standard)',
    nameRu: 'Капельное орошение ур. 2 (Израильский стандарт)',
    category: 'civil',
    cost: 1200,
    duration: 36,
    effects: { waterStress: -28 },
    hiddenEffects: '-8 доверия (слишком дорого)',
    requirements: ['drip_irrigation_1'],
    level: 2,
    maxLevel: 2,
    maintenanceCost: 180,
  },
  {
    id: 'laser_leveling',
    name: 'Laser Field Leveling',
    nameRu: 'Лазерная нивелировка полей',
    category: 'civil',
    cost: 320,
    duration: 24,
    effects: { waterStress: -18 },
    hiddenEffects: 'Эффект -5% в горных регионах',
  },
  {
    id: 'canal_lining',
    name: 'Canal Concrete Lining',
    nameRu: 'Облицовка каналов бетоном',
    category: 'civil',
    cost: 850,
    duration: 48,
    effects: { waterStress: -22 },
    hiddenEffects: '+15 напряжения в нижних регионах',
  },
  {
    id: 'wetlands_1',
    name: 'Wetland Restoration Level 1',
    nameRu: 'Восстановление водно-болотных угодий ур. 1',
    category: 'civil',
    cost: 420,
    duration: 60,
    effects: { waterStress: -8 },
    hiddenEffects: '-12% дохода от с/х на 5 лет',
    level: 1,
    maxLevel: 2,
  },
  {
    id: 'wetlands_2',
    name: 'Wetland Restoration Level 2',
    nameRu: 'Восстановление водно-болотных угодий ур. 2',
    category: 'civil',
    cost: 1900,
    duration: 96,
    effects: { waterStress: -20 },
    hiddenEffects: 'Блокирует новые плотины в суббассейне',
    requirements: ['wetlands_1'],
    level: 2,
    maxLevel: 2,
    maintenanceCost: 120,
  },
  {
    id: 'virtual_water',
    name: 'Virtual Water Import',
    nameRu: 'Импорт виртуальной воды',
    category: 'civil',
    cost: 600,
    duration: 12,
    effects: { waterStress: -15 },
    hiddenEffects: '+8 международного давления',
    isRecurring: true,
    recurringCost: 600,
  },
  {
    id: 'relocation',
    name: 'Population Relocation',
    nameRu: 'Переселение населения из критических зон',
    category: 'civil',
    cost: 3400,
    duration: 72,
    effects: { waterStress: -40, trustInGov: -35 },
    hiddenEffects: '+30 напряжения в принимающих регионах',
  },
  {
    id: 'small_desalination',
    name: 'Small Desalination Plants (10 units)',
    nameRu: 'Десалинизация малых установок (10 шт)',
    category: 'civil',
    cost: 1100,
    duration: 30,
    effects: { waterStress: -15 },
    hiddenEffects: '+450 млн $/год эксплуатация',
    maintenanceCost: 450,
  },
  {
    id: 'large_desalination',
    name: 'Large Desalination (Saudi Standard)',
    nameRu: 'Десалинизация крупная (как в Саудовской Аравии)',
    category: 'civil',
    cost: 11000,
    duration: 84,
    effects: { waterStress: -35 },
    hiddenEffects: '+2.2 млрд $/год, +20 давления',
    maintenanceCost: 2200,
  },
  
  // ============ SOCIAL INITIATIVES (29 NEW) ============
  {
    id: 'public_fountains',
    name: 'Public Fountains and Water Parks',
    nameRu: 'Публичные фонтаны и парки с водой',
    category: 'social',
    cost: 80,
    duration: 6,
    effects: { socialTension: -18, trustInGov: 12 },
    maintenanceCost: 15,
  },
  {
    id: 'water_trucks',
    name: 'Free Water Delivery by Trucks',
    nameRu: 'Бесплатная раздача воды автоцистернами',
    category: 'social',
    cost: 240,
    duration: 12,
    effects: { socialTension: -35 },
    isRecurring: true,
    recurringCost: 240,
  },
  {
    id: 'river_day',
    name: 'River Day Festival',
    nameRu: 'Праздник «День реки»',
    category: 'social',
    cost: 120,
    duration: 24,
    effects: { socialTension: -22 },
  },
  {
    id: 'public_pools',
    name: 'Public Swimming Pools and Waterparks',
    nameRu: 'Общественные бассейны и аквапарки',
    category: 'social',
    cost: 450,
    duration: 18,
    effects: { socialTension: -25, trustInGov: 20 },
    maintenanceCost: 45,
  },
  {
    id: 'dam_broadcast',
    name: 'Live Dam Filling Broadcast',
    nameRu: 'Прямая трансляция заполнения плотины',
    category: 'social',
    cost: 0,
    duration: 1,
    effects: { trustInGov: 15 },
  },
  // Propaganda levels 1-5
  {
    id: 'propaganda_1',
    name: 'Propaganda Level 1: Billboards',
    nameRu: 'Пропаганда ур. 1: Билборды',
    category: 'social',
    cost: 50,
    duration: 12,
    effects: { trustInGov: 5, socialTension: -5 },
    level: 1,
    maxLevel: 5,
  },
  {
    id: 'propaganda_2',
    name: 'Propaganda Level 2: TV Ads',
    nameRu: 'Пропаганда ур. 2: ТВ-реклама',
    category: 'social',
    cost: 150,
    duration: 12,
    effects: { trustInGov: 10, socialTension: -10 },
    requirements: ['propaganda_1'],
    level: 2,
    maxLevel: 5,
  },
  {
    id: 'propaganda_3',
    name: 'Propaganda Level 3: Documentary',
    nameRu: 'Пропаганда ур. 3: Документальный фильм',
    category: 'social',
    cost: 320,
    duration: 18,
    effects: { trustInGov: 18, socialTension: -15 },
    requirements: ['propaganda_2'],
    level: 3,
    maxLevel: 5,
  },
  {
    id: 'propaganda_4',
    name: 'Propaganda Level 4: National Campaign',
    nameRu: 'Пропаганда ур. 4: Национальная кампания',
    category: 'social',
    cost: 550,
    duration: 24,
    effects: { trustInGov: 25, socialTension: -22 },
    requirements: ['propaganda_3'],
    level: 4,
    maxLevel: 5,
  },
  {
    id: 'propaganda_5',
    name: 'Propaganda Level 5: Feature Film',
    nameRu: 'Пропаганда ур. 5: Полнометражный фильм',
    category: 'social',
    cost: 800,
    duration: 36,
    effects: { trustInGov: 35, socialTension: -30 },
    requirements: ['propaganda_4'],
    level: 5,
    maxLevel: 5,
  },
  // Subsidies levels 1-5
  {
    id: 'subsidies_1',
    name: 'Subsidies Level 1: Basic',
    nameRu: 'Субсидии ур. 1: Базовые',
    category: 'social',
    cost: 60,
    duration: 12,
    effects: { socialTension: -8, trustInGov: 5 },
    level: 1,
    maxLevel: 5,
    isRecurring: true,
    recurringCost: 60,
  },
  {
    id: 'subsidies_2',
    name: 'Subsidies Level 2: Weddings',
    nameRu: 'Субсидии ур. 2: На свадьбы',
    category: 'social',
    cost: 120,
    duration: 12,
    effects: { socialTension: -15, trustInGov: 10 },
    requirements: ['subsidies_1'],
    level: 2,
    maxLevel: 5,
    isRecurring: true,
    recurringCost: 120,
  },
  {
    id: 'subsidies_3',
    name: 'Subsidies Level 3: Funerals',
    nameRu: 'Субсидии ур. 3: На похороны',
    category: 'social',
    cost: 220,
    duration: 12,
    effects: { socialTension: -22, trustInGov: 15 },
    requirements: ['subsidies_2'],
    level: 3,
    maxLevel: 5,
    isRecurring: true,
    recurringCost: 220,
  },
  {
    id: 'subsidies_4',
    name: 'Subsidies Level 4: Religious Holidays',
    nameRu: 'Субсидии ур. 4: На религиозные праздники',
    category: 'social',
    cost: 380,
    duration: 12,
    effects: { socialTension: -30, trustInGov: 22 },
    requirements: ['subsidies_3'],
    level: 4,
    maxLevel: 5,
    isRecurring: true,
    recurringCost: 380,
  },
  {
    id: 'subsidies_5',
    name: 'Subsidies Level 5: Full Coverage',
    nameRu: 'Субсидии ур. 5: Полные',
    category: 'social',
    cost: 600,
    duration: 12,
    effects: { socialTension: -40, trustInGov: 30 },
    requirements: ['subsidies_4'],
    level: 5,
    maxLevel: 5,
    isRecurring: true,
    recurringCost: 600,
  },
  // Fairs levels 1-5
  {
    id: 'fair_1',
    name: 'Water Fair Level 1: Local',
    nameRu: 'Ярмарка «Вода для всех» ур. 1: Локальная',
    category: 'social',
    cost: 40,
    duration: 3,
    effects: { socialTension: -10, trustInGov: 5 },
    level: 1,
    maxLevel: 5,
  },
  {
    id: 'fair_2',
    name: 'Water Fair Level 2: District',
    nameRu: 'Ярмарка «Вода для всех» ур. 2: Районная',
    category: 'social',
    cost: 90,
    duration: 3,
    effects: { socialTension: -18, trustInGov: 10 },
    requirements: ['fair_1'],
    level: 2,
    maxLevel: 5,
  },
  {
    id: 'fair_3',
    name: 'Water Fair Level 3: Regional',
    nameRu: 'Ярмарка «Вода для всех» ур. 3: Региональная',
    category: 'social',
    cost: 180,
    duration: 6,
    effects: { socialTension: -25, trustInGov: 15 },
    requirements: ['fair_2'],
    level: 3,
    maxLevel: 5,
  },
  {
    id: 'fair_4',
    name: 'Water Fair Level 4: Multi-Regional',
    nameRu: 'Ярмарка «Вода для всех» ур. 4: Межрегиональная',
    category: 'social',
    cost: 300,
    duration: 6,
    effects: { socialTension: -32, trustInGov: 22 },
    requirements: ['fair_3'],
    level: 4,
    maxLevel: 5,
  },
  {
    id: 'fair_5',
    name: 'Water Fair Level 5: National',
    nameRu: 'Ярмарка «Вода для всех» ур. 5: Национальная',
    category: 'social',
    cost: 450,
    duration: 12,
    effects: { socialTension: -40, trustInGov: 30 },
    requirements: ['fair_4'],
    level: 5,
    maxLevel: 5,
  },
  // Temples levels 1-5
  {
    id: 'temple_1',
    name: 'Temple with Fountain Level 1',
    nameRu: 'Храм с фонтаном ур. 1: Маленький',
    category: 'social',
    cost: 100,
    duration: 12,
    effects: { socialTension: -12, trustInGov: 8 },
    level: 1,
    maxLevel: 5,
    maintenanceCost: 10,
  },
  {
    id: 'temple_2',
    name: 'Temple with Fountain Level 2',
    nameRu: 'Храм с фонтаном ур. 2: Средний',
    category: 'social',
    cost: 250,
    duration: 18,
    effects: { socialTension: -18, trustInGov: 14 },
    requirements: ['temple_1'],
    level: 2,
    maxLevel: 5,
    maintenanceCost: 25,
  },
  {
    id: 'temple_3',
    name: 'Temple with Fountain Level 3',
    nameRu: 'Храм с фонтаном ур. 3: Большой',
    category: 'social',
    cost: 480,
    duration: 24,
    effects: { socialTension: -25, trustInGov: 20 },
    requirements: ['temple_2'],
    level: 3,
    maxLevel: 5,
    maintenanceCost: 50,
  },
  {
    id: 'temple_4',
    name: 'Temple with Fountain Level 4',
    nameRu: 'Храм с фонтаном ур. 4: Грандиозный',
    category: 'social',
    cost: 800,
    duration: 36,
    effects: { socialTension: -32, trustInGov: 28 },
    requirements: ['temple_3'],
    level: 4,
    maxLevel: 5,
    maintenanceCost: 80,
  },
  {
    id: 'temple_5',
    name: 'Temple with Fountain Level 5: Cathedral',
    nameRu: 'Храм с фонтаном ур. 5: Собор',
    category: 'social',
    cost: 1200,
    duration: 48,
    effects: { socialTension: -40, trustInGov: 35 },
    requirements: ['temple_4'],
    level: 5,
    maxLevel: 5,
    maintenanceCost: 120,
  },
  // Hero of Nation levels 1-4
  {
    id: 'hero_1',
    name: 'Hero of Nation Level 1',
    nameRu: '«Герой нации» ур. 1: Местное награждение',
    category: 'social',
    cost: 30,
    duration: 1,
    effects: { trustInGov: 5, socialTension: -5 },
    level: 1,
    maxLevel: 4,
  },
  {
    id: 'hero_2',
    name: 'Hero of Nation Level 2',
    nameRu: '«Герой нации» ур. 2: Региональное награждение',
    category: 'social',
    cost: 80,
    duration: 1,
    effects: { trustInGov: 12, socialTension: -12 },
    requirements: ['hero_1'],
    level: 2,
    maxLevel: 4,
  },
  {
    id: 'hero_3',
    name: 'Hero of Nation Level 3',
    nameRu: '«Герой нации» ур. 3: Национальное награждение',
    category: 'social',
    cost: 180,
    duration: 1,
    effects: { trustInGov: 20, socialTension: -18 },
    requirements: ['hero_2'],
    level: 3,
    maxLevel: 4,
  },
  {
    id: 'hero_4',
    name: 'Hero of Nation Level 4',
    nameRu: '«Герой нации» ур. 4: Президентская церемония',
    category: 'social',
    cost: 320,
    duration: 1,
    effects: { trustInGov: 30, socialTension: -25 },
    requirements: ['hero_3'],
    level: 4,
    maxLevel: 4,
  },

  // ============ DIPLOMATIC INITIATIVES (18) ============
  {
    id: 'monitoring_1',
    name: 'Joint Monitoring Level 1',
    nameRu: 'Совместный мониторинг ур. 1',
    category: 'diplomatic',
    cost: 80,
    duration: 12,
    effects: { internationalPressure: -5, downstreamTrust: 15 },
    level: 1,
    maxLevel: 4,
  },
  {
    id: 'monitoring_2',
    name: 'Joint Monitoring Level 2',
    nameRu: 'Совместный мониторинг ур. 2',
    category: 'diplomatic',
    cost: 250,
    duration: 24,
    effects: { internationalPressure: -10, downstreamTrust: 25 },
    requirements: ['monitoring_1'],
    level: 2,
    maxLevel: 4,
  },
  {
    id: 'monitoring_3',
    name: 'Joint Monitoring Level 3',
    nameRu: 'Совместный мониторинг ур. 3',
    category: 'diplomatic',
    cost: 600,
    duration: 36,
    effects: { internationalPressure: -15, downstreamTrust: 35 },
    requirements: ['monitoring_2'],
    level: 3,
    maxLevel: 4,
  },
  {
    id: 'monitoring_4',
    name: 'Joint Monitoring Level 4: Full Transparency',
    nameRu: 'Совместный мониторинг ур. 4: Полная прозрачность',
    category: 'diplomatic',
    cost: 1200,
    duration: 60,
    effects: { internationalPressure: -20, downstreamTrust: 45 },
    hiddenEffects: 'Ты тоже обязан показывать все данные',
    requirements: ['monitoring_3'],
    level: 4,
    maxLevel: 4,
  },
  {
    id: 'ecosystem_payment',
    name: 'Ecosystem Services Payment',
    nameRu: 'Платежи за экосистемные услуги',
    category: 'diplomatic',
    cost: 500,
    duration: 12,
    effects: { internationalPressure: -8, downstreamTrust: 20 },
    hiddenEffects: 'Если прекратить — -50 доверия мгновенно',
    isRecurring: true,
    recurringCost: 500,
  },
  {
    id: 'international_arbitration',
    name: 'International Arbitration (Hague)',
    nameRu: 'Международный арбитраж (Гаага)',
    category: 'diplomatic',
    cost: 450,
    duration: 120,
    effects: { internationalPressure: -10 },
    hiddenEffects: '50% шанс выиграть, 50% проиграть и -40 доверия навсегда',
  },
  {
    id: 'secret_deal',
    name: 'Secret Agreement',
    nameRu: 'Секретное соглашение «вода в обмен на...»',
    category: 'diplomatic',
    cost: 0,
    duration: 120,
    effects: { downstreamTrust: 30 },
    hiddenEffects: 'Если вскроется — 70% шанс войны',
  },
  {
    id: 'emergency_water_release',
    name: 'Emergency Water Release to Downstream',
    nameRu: 'Аварийный спуск воды вниз',
    category: 'diplomatic',
    cost: 2000,
    duration: 1,
    effects: { internationalPressure: -30, downstreamTrust: 45 },
    hiddenEffects: 'Доступно раз в 5 лет',
  },

  // ============ MILITARY INITIATIVES (10) ============
  {
    id: 'infrastructure_guard_1',
    name: 'Infrastructure Guard Level 1',
    nameRu: 'Военизированная охрана инфраструктуры ур. 1',
    category: 'military',
    cost: 400,
    duration: 6,
    effects: { socialTension: 5 },
    hiddenEffects: '-30% успеха терактов',
    level: 1,
    maxLevel: 3,
  },
  {
    id: 'infrastructure_guard_2',
    name: 'Infrastructure Guard Level 2',
    nameRu: 'Военизированная охрана инфраструктуры ур. 2',
    category: 'military',
    cost: 1200,
    duration: 12,
    effects: { socialTension: 10 },
    hiddenEffects: '-50% успеха терактов',
    requirements: ['infrastructure_guard_1'],
    level: 2,
    maxLevel: 3,
  },
  {
    id: 'infrastructure_guard_3',
    name: 'Infrastructure Guard Level 3',
    nameRu: 'Военизированная охрана инфраструктуры ур. 3',
    category: 'military',
    cost: 2100,
    duration: 18,
    effects: { socialTension: 15 },
    hiddenEffects: '-70% успеха терактов',
    requirements: ['infrastructure_guard_2'],
    level: 3,
    maxLevel: 3,
  },
  {
    id: 'emergency_state',
    name: 'State of Emergency (NEW MECHANICS)',
    nameRu: 'Чрезвычайное положение (НОВАЯ МЕХАНИКА)',
    category: 'military',
    cost: 0,
    duration: 999,
    effects: { socialTension: -55 },
    hiddenEffects: 'Первые 6 мес: -55% напряжения. После: +8%/мес напряжения, -15 доверия/мес, +25% ополчения через 18-36 мес',
  },
  {
    id: 'cancel_emergency',
    name: 'Cancel State of Emergency',
    nameRu: 'Отмена чрезвычайного положения',
    category: 'military',
    cost: 0,
    duration: 1,
    effects: {},
  },
  {
    id: 'cyber_attack',
    name: 'Cyber Attack on Upstream SCADA',
    nameRu: 'Кибератака на SCADA-систему верхней плотины',
    category: 'military',
    cost: 800,
    duration: 3,
    effects: { internationalPressure: 25 },
    hiddenEffects: '80% шанс быть пойманным → война',
  },
  {
    id: 'sabotage',
    name: 'Sabotage Upstream Infrastructure',
    nameRu: 'Саботаж / диверсия на территории верхней страны',
    category: 'military',
    cost: 1500,
    duration: 6,
    effects: { internationalPressure: 40 },
    hiddenEffects: '95% шанс войны',
  },
  {
    id: 'full_cutoff',
    name: 'Full River Cutoff',
    nameRu: 'Полное перекрытие реки',
    category: 'military',
    cost: 0,
    duration: 1,
    effects: { internationalPressure: 50 },
    hiddenEffects: 'Война через 6-18 месяцев с вероятностью 99%',
  },
];

// ============================================
// INITIAL STATE
// ============================================
const initialRegions: Region[] = [
  { id: 'gaziantep', name: 'Gaziantep', nameRu: 'Газиантеп', waterStress: 68, socialTension: 34, trustInGov: 72, militias: 0, population: 2.1, agriculture: 75, isFlat: true, isCoastal: false, activeInitiatives: [], hasEmergency: false },
  { id: 'sanliurfa', name: 'Şanlıurfa', nameRu: 'Шанлыурфа', waterStress: 72, socialTension: 38, trustInGov: 68, militias: 0, population: 2.0, agriculture: 82, isFlat: true, isCoastal: false, activeInitiatives: [], hasEmergency: false },
  { id: 'diyarbakir', name: 'Diyarbakır', nameRu: 'Диярбакыр', waterStress: 55, socialTension: 52, trustInGov: 48, militias: 1, population: 1.8, agriculture: 70, isFlat: true, isCoastal: false, activeInitiatives: [], hasEmergency: false },
  { id: 'mardin', name: 'Mardin', nameRu: 'Мардин', waterStress: 65, socialTension: 45, trustInGov: 55, militias: 0, population: 0.8, agriculture: 65, isFlat: false, isCoastal: false, activeInitiatives: [], hasEmergency: false },
  { id: 'adiyaman', name: 'Adıyaman', nameRu: 'Адыяман', waterStress: 58, socialTension: 32, trustInGov: 70, militias: 0, population: 0.6, agriculture: 60, isFlat: false, isCoastal: false, activeInitiatives: [], hasEmergency: false },
  { id: 'batman', name: 'Batman', nameRu: 'Батман', waterStress: 48, socialTension: 42, trustInGov: 58, militias: 0, population: 0.6, agriculture: 55, isFlat: true, isCoastal: false, activeInitiatives: [], hasEmergency: false },
  { id: 'siirt', name: 'Siirt', nameRu: 'Сиирт', waterStress: 42, socialTension: 48, trustInGov: 52, militias: 0, population: 0.3, agriculture: 45, isFlat: false, isCoastal: false, activeInitiatives: [], hasEmergency: false },
  { id: 'sirnak', name: 'Şırnak', nameRu: 'Ширнак', waterStress: 38, socialTension: 58, trustInGov: 42, militias: 1, population: 0.5, agriculture: 35, isFlat: false, isCoastal: false, activeInitiatives: [], hasEmergency: false },
  { id: 'hakkari', name: 'Hakkâri', nameRu: 'Хаккяри', waterStress: 32, socialTension: 62, trustInGov: 38, militias: 1, population: 0.3, agriculture: 25, isFlat: false, isCoastal: false, activeInitiatives: [], hasEmergency: false },
  { id: 'elazig', name: 'Elazığ', nameRu: 'Элязыг', waterStress: 45, socialTension: 35, trustInGov: 65, militias: 0, population: 0.6, agriculture: 58, isFlat: false, isCoastal: false, activeInitiatives: [], hasEmergency: false },
  { id: 'malatya', name: 'Malatya', nameRu: 'Малатья', waterStress: 40, socialTension: 30, trustInGov: 70, militias: 0, population: 0.8, agriculture: 62, isFlat: true, isCoastal: false, activeInitiatives: [], hasEmergency: false },
];

const initialDam: Dam = {
  id: 'ataturk',
  name: 'Atatürk Dam',
  nameLocal: 'Atatürk Barajı',
  country: 'Турция',
  river: 'Евфрат',
  maxCapacity: 48.7,
  currentLevel: 31.7,
  currentFlow: 25.5,
  powerGeneration: 1.4,
  turbineCount: 8,
  mode: 'normal' as DamMode,
};

const initialEmergencyState: EmergencyState = {
  isActive: false,
  activatedMonth: 0,
  activatedYear: 0,
  regionId: null,
  monthsActive: 0,
  phase: 'initial',
};

const initialBudgetBreakdown: BudgetBreakdown = {
  baseIncome: 3.2,
  pressurePenalty: 0,
  corruptionLoss: 0,
  debtService: 2.1,
  infrastructureMaintenance: 0,
  virtualWaterImport: 1.2,
  activeInitiativesCost: 0,
  netIncome: 0,
  deficit: 0,
};

const initialInfrastructure: InfrastructureBuilt = {
  dripIrrigationLevel1: 0,
  dripIrrigationLevel2: 0,
  canalLining: 0,
  smallDesalination: 0,
  largeDesalination: 0,
  wetlandsLevel1: 0,
  wetlandsLevel2: 0,
  fountains: 0,
  pools: 0,
  temples: 0,
};

function createInitialState(difficulty: DifficultyLevel = 'realistic'): GameState {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  
  return {
    year: 2015,
    month: 1,
    totalMonths: 0,
    budget: 35 * settings.startingBudgetModifier,
    debt: 58 * settings.debtServiceModifier,
    internationalPressure: settings.startingPressure,
    damFillLevel: 65,
    waterRelease: 25.5,
    selectedRegionId: null,
    regions: initialRegions.map(r => ({
      ...r,
      militias: r.militias + (settings.startingCivilWars > 0 && r.socialTension > 50 ? 1 : 0),
    })),
    activeInitiatives: [],
    completedInitiatives: [],
    notifications: [],
    gameOver: false,
    gameOverReason: '',
    victory: false,
    gameSpeed: 0 as GameSpeed,
    dam: initialDam,
    showDamPanel: false,
    downstreamTrust: 15,
    canUnlockOverflowMode: false,
    difficulty,
    difficultySettings: settings,
    emergencyState: initialEmergencyState,
    budgetBreakdown: initialBudgetBreakdown,
    infrastructureBuilt: initialInfrastructure,
    population: 18.5,
    populationGrowthRate: 0.012 * settings.populationGrowthModifier,
    assetsFrozen: 0,
    lastCorruptionLoss: 0,
    iraqWaterStress: 72,
    iraqTension: 45,
    iraqTrust: -20,
  };
}

const initialState = createInitialState('realistic');

// ============================================
// CONTEXT
// ============================================
interface GameContextType {
  state: GameState;
  selectRegion: (regionId: string | null) => void;
  activateInitiative: (initiativeId: string, regionId: string, cost: number, duration: number, effects: InitiativeEffects) => void;
  advanceTime: () => void;
  addNotification: (notification: Omit<GameNotification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  getSelectedRegion: () => Region | null;
  setGameSpeed: (speed: GameSpeed) => void;
  openDamPanel: () => void;
  closeDamPanel: () => void;
  setDamMode: (mode: DamMode) => void;
  emergencyRelease: () => void;
  activateEmergencyState: (regionId: string) => void;
  cancelEmergencyState: () => void;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  getPressureLevel: () => PressureLevel;
  calculateBudget: () => BudgetBreakdown;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

const SPEED_INTERVALS: Record<GameSpeed, number> = {
  0: 0,
  1: 4000,
  2: 2000,
  3: 800,
};

// ============================================
// PROVIDER
// ============================================
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(initialState);
  const intervalRef = useRef<number | null>(null);

  const selectRegion = useCallback((regionId: string | null) => {
    setState(prev => ({ ...prev, selectedRegionId: regionId }));
  }, []);

  const addNotification = useCallback((notification: Omit<GameNotification, 'id' | 'timestamp'>) => {
    const newNotification: GameNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    setState(prev => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications].slice(0, 10),
    }));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
  }, []);

  const setGameSpeed = useCallback((speed: GameSpeed) => {
    setState(prev => ({ ...prev, gameSpeed: speed }));
  }, []);

  const setDifficulty = useCallback((difficulty: DifficultyLevel) => {
    setState(createInitialState(difficulty));
  }, []);

  const getPressureLevelFn = useCallback(() => {
    return getPressureLevel(state.internationalPressure);
  }, [state.internationalPressure]);

  const calculateBudget = useCallback((): BudgetBreakdown => {
    const settings = state.difficultySettings;
    const pressureLevel = getPressureLevel(state.internationalPressure);
    
    // === REALISTIC BUDGET MODEL ===
    // Base income: ~38.4 B$/year = 3.2 B$/month for Turkey (Realistic)
    // This scales with difficulty
    const baseIncome = 3.2 * settings.incomeModifier;
    
    // === TIME-BASED DEFICIT GROWTH ===
    // On Realistic: proficit until 2033, then growing deficit
    // yearsSinceStart increases expenses over time (population growth, inflation, demand)
    const yearsSinceStart = state.year - 2015;
    const timeBasedExpenseGrowth = Math.max(0, (yearsSinceStart - 8) * 0.12) * settings.populationGrowthModifier;
    // This adds 0 until year 8 (2023), then +0.12B/month per year after
    // By 2035 (year 20): +1.44B/month = +17.3B/year on Realistic
    // By 2040 (year 25): +2.04B/month = +24.5B/year on Realistic
    
    // === PRESSURE PENALTY ===
    const pressurePenalty = baseIncome * pressureLevel.effects.incomeReduction;
    
    // === CORRUPTION ===
    const corruptionRate = settings.corruptionRange[0] + 
      Math.random() * (settings.corruptionRange[1] - settings.corruptionRange[0]);
    const avgTrust = state.regions.reduce((sum, r) => sum + r.trustInGov, 0) / state.regions.length;
    const corruptionMultiplier = avgTrust < 40 ? 2.0 : avgTrust < 60 ? 1.5 : 1.0;
    const corruptionLoss = (baseIncome - pressurePenalty) * corruptionRate * corruptionMultiplier;
    
    // === DEBT SERVICE ===
    // Turkey: 18-32B$/year = 1.5-2.67B$/month
    // Scales with debt level and difficulty
    const annualDebtRate = 0.08; // 8% annual interest
    const debtService = (state.debt * annualDebtRate) / 12 * settings.debtServiceModifier;
    
    // === INFRASTRUCTURE MAINTENANCE ===
    let maintenance = 0;
    maintenance += state.infrastructureBuilt.dripIrrigationLevel2 * 15;   // 180M/yr = 15M/mo
    maintenance += state.infrastructureBuilt.smallDesalination * 37.5;     // 450M/yr = 37.5M/mo
    maintenance += state.infrastructureBuilt.largeDesalination * 183.3;    // 2200M/yr = 183.3M/mo
    maintenance += state.infrastructureBuilt.wetlandsLevel2 * 10;          // 120M/yr = 10M/mo
    maintenance += state.infrastructureBuilt.fountains * 1.25;             // 15M/yr = 1.25M/mo
    maintenance += state.infrastructureBuilt.pools * 3.75;                 // 45M/yr = 3.75M/mo
    maintenance += state.infrastructureBuilt.temples * 5;                  // 60M/yr = 5M/mo
    maintenance = (maintenance / 1000) * settings.maintenanceModifier;     // Convert to billions
    
    // === MANDATORY EXPENSES ===
    // Virtual water import (minimum required or +15% tension)
    const virtualWaterImport = 0.1 * settings.populationGrowthModifier; // 1.2B/yr scaled
    
    // Base government expenses that grow with population
    const populationExpenses = timeBasedExpenseGrowth;
    
    // === RECURRING INITIATIVES ===
    let recurringCost = 0;
    state.activeInitiatives.forEach(init => {
      const initiative = ALL_INITIATIVES.find(i => i.id === init.initiativeId);
      if (initiative?.isRecurring && initiative.recurringCost) {
        recurringCost += initiative.recurringCost / 12 / 1000;
      }
    });
    
    const totalExpenses = pressurePenalty + corruptionLoss + debtService + 
                          maintenance + virtualWaterImport + populationExpenses + recurringCost;
    const netIncome = baseIncome - totalExpenses;
    const deficit = netIncome < 0 ? Math.abs(netIncome) : 0;
    
    return {
      baseIncome,
      pressurePenalty,
      corruptionLoss,
      debtService,
      infrastructureMaintenance: maintenance + populationExpenses,
      virtualWaterImport,
      activeInitiativesCost: recurringCost,
      netIncome,
      deficit,
    };
  }, [state]);

  const activateEmergencyState = useCallback((regionId: string) => {
    setState(prev => {
      const region = prev.regions.find(r => r.id === regionId);
      if (!region) return prev;

      return {
        ...prev,
        emergencyState: {
          isActive: true,
          activatedMonth: prev.month,
          activatedYear: prev.year,
          regionId,
          monthsActive: 0,
          phase: 'initial',
        },
        regions: prev.regions.map(r => 
          r.id === regionId 
            ? { ...r, socialTension: Math.max(0, r.socialTension - 55), hasEmergency: true }
            : r
        ),
      };
    });

    addNotification({
      type: 'warning',
      title: 'ЧРЕЗВЫЧАЙНОЕ ПОЛОЖЕНИЕ',
      message: 'Армия введена. Напряжение снижено. Но это временно...',
    });
  }, [addNotification]);

  const cancelEmergencyState = useCallback(() => {
    setState(prev => {
      if (!prev.emergencyState.isActive) return prev;

      return {
        ...prev,
        emergencyState: {
          ...initialEmergencyState,
        },
        regions: prev.regions.map(r => ({ ...r, hasEmergency: false })),
      };
    });

    addNotification({
      type: 'info',
      title: 'ЧП отменено',
      message: 'Чрезвычайное положение снято. Регион возвращается к нормальной жизни.',
    });
  }, [addNotification]);

  const activateInitiative = useCallback((
    initiativeId: string,
    regionId: string,
    cost: number,
    duration: number,
    effects: InitiativeEffects
  ) => {
    // Handle emergency state specially
    if (initiativeId === 'emergency_state') {
      activateEmergencyState(regionId);
      return;
    }
    if (initiativeId === 'cancel_emergency') {
      cancelEmergencyState();
      return;
    }

    setState(prev => {
      if (prev.budget < cost / 1000) {
        return prev;
      }

      const region = prev.regions.find(r => r.id === regionId);
      if (!region) return prev;

      const updatedRegions = prev.regions.map(r => {
        if (r.id === regionId) {
          return {
            ...r,
            waterStress: Math.max(0, Math.min(100, r.waterStress + (effects.waterStress || 0))),
            socialTension: Math.max(0, Math.min(100, r.socialTension + (effects.socialTension || 0))),
            trustInGov: Math.max(0, Math.min(100, r.trustInGov + (effects.trustInGov || 0))),
            militias: Math.max(0, r.militias + (effects.militias || 0)),
            activeInitiatives: [...r.activeInitiatives, initiativeId],
          };
        }
        return r;
      });

      const initiative = ALL_INITIATIVES.find(i => i.id === initiativeId);
      const newActiveInitiative: ActiveInitiative = {
        id: Math.random().toString(36).substr(2, 9),
        initiativeId,
        regionId,
        startMonth: prev.month,
        startYear: prev.year,
        durationMonths: duration,
        completed: false,
        recurringCost: initiative?.recurringCost,
      };

      // Update infrastructure counts
      const newInfra = { ...prev.infrastructureBuilt };
      if (initiativeId === 'drip_irrigation_2') newInfra.dripIrrigationLevel2++;
      if (initiativeId === 'small_desalination') newInfra.smallDesalination++;
      if (initiativeId === 'large_desalination') newInfra.largeDesalination++;
      if (initiativeId === 'public_fountains') newInfra.fountains++;
      if (initiativeId === 'public_pools') newInfra.pools++;
      if (initiativeId.startsWith('temple_')) newInfra.temples++;

      let gameOver = false;
      let gameOverReason = '';

      const criticalRegion = updatedRegions.find(r => r.socialTension >= 95 && r.militias >= 3);
      if (criticalRegion) {
        gameOver = true;
        gameOverReason = `Гражданская война вспыхнула в регионе ${criticalRegion.nameRu}`;
      }

      // Iraq effects from initiatives
      let newIraqStress = prev.iraqWaterStress;
      let newIraqTension = prev.iraqTension;
      let newIraqTrust = prev.iraqTrust;

      if (initiativeId === 'monitoring_1') { newIraqTrust += 15; }
      if (initiativeId === 'monitoring_4') { newIraqTrust += 45; }
      if (initiativeId === 'ecosystem_payment') { newIraqStress -= 5; newIraqTrust += 10; }
      if (initiativeId === 'secret_deal') { newIraqStress -= 8; newIraqTrust += 5; }
      if (initiativeId === 'river_blockade') { newIraqStress += 25; newIraqTension += 30; newIraqTrust -= 40; }
      if (initiativeId === 'cyber_attack') { newIraqTrust -= 20; }
      if (initiativeId === 'sabotage') { newIraqStress += 15; newIraqTrust -= 30; }
      if (initiativeId === 'virtual_water') { newIraqStress -= 3; }
      if (initiativeId === 'relocation') { newIraqStress -= 2; }
      if (initiativeId === 'arbitration') { newIraqTrust += 20; }
      if (initiativeId === 'canal_lining') { newIraqStress += 5; } // less water downstream
      if (initiativeId === 'large_desalination') { newIraqStress -= 4; }

      newIraqStress = Math.max(0, Math.min(100, newIraqStress));
      newIraqTension = Math.max(0, Math.min(100, newIraqTension));
      newIraqTrust = Math.max(-100, Math.min(100, newIraqTrust));

      return {
        ...prev,
        budget: prev.budget - cost / 1000,
        internationalPressure: Math.max(0, Math.min(100, prev.internationalPressure + (effects.internationalPressure || 0))),
        downstreamTrust: Math.max(-100, Math.min(100, prev.downstreamTrust + (effects.downstreamTrust || 0))),
        regions: updatedRegions,
        activeInitiatives: [...prev.activeInitiatives, newActiveInitiative],
        infrastructureBuilt: newInfra,
        iraqWaterStress: newIraqStress,
        iraqTension: newIraqTension,
        iraqTrust: newIraqTrust,
        gameOver,
        gameOverReason,
      };
    });
  }, [activateEmergencyState, cancelEmergencyState]);

  const advanceTime = useCallback(() => {
    setState(prev => {
      if (prev.gameOver) return prev;

      let newMonth = prev.month + 1;
      let newYear = prev.year;
      
      if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      }

      const totalMonths = prev.totalMonths + 1;
      const settings = prev.difficultySettings;

      // Calculate budget
      const budget = calculateBudget();
      const newBudget = prev.budget + budget.netIncome;

      // Update emergency state
      let emergencyState = { ...prev.emergencyState };
      let regionsWithEmergency = prev.regions;

      if (emergencyState.isActive) {
        emergencyState.monthsActive++;
        
        if (emergencyState.monthsActive <= 6) {
          emergencyState.phase = 'initial';
        } else if (emergencyState.monthsActive <= 18) {
          emergencyState.phase = 'degrading';
        } else {
          emergencyState.phase = 'critical';
        }

        // Apply degrading effects after 6 months
        if (emergencyState.monthsActive > 6 && emergencyState.regionId) {
          regionsWithEmergency = prev.regions.map(r => {
            if (r.id === emergencyState.regionId) {
              const newTension = Math.min(100, r.socialTension + 8);
              const newTrust = Math.max(0, r.trustInGov - 15);
              
              // Chance of militia spawning after 18 months
              let newMilitias = r.militias;
              if (emergencyState.monthsActive >= 18 && Math.random() < 0.25 / 12) {
                newMilitias++;
              }
              
              return { ...r, socialTension: newTension, trustInGov: newTrust, militias: newMilitias };
            }
            return r;
          });
        }
      }

      // Natural regional changes
      const updatedRegions = regionsWithEmergency.map(r => {
        if (r.hasEmergency && emergencyState.monthsActive <= 6) {
          return r; // Don't change during initial emergency phase
        }

        const stressIncrease = (Math.random() * 2 - 0.5) * settings.populationGrowthModifier;
        const tensionChange = r.waterStress > 70 ? Math.random() * 3 : Math.random() * 1 - 0.5;
        const trustChange = r.socialTension > 60 ? -Math.random() * 2 : Math.random() * 1;
        
        return {
          ...r,
          waterStress: Math.max(0, Math.min(100, r.waterStress + stressIncrease)),
          socialTension: Math.max(0, Math.min(100, r.socialTension + tensionChange)),
          trustInGov: Math.max(0, Math.min(100, r.trustInGov + trustChange)),
        };
      });

      // Update initiatives
      const updatedInitiatives = prev.activeInitiatives.map(init => {
        const monthsPassed = (newYear - init.startYear) * 12 + (newMonth - init.startMonth);
        if (monthsPassed >= init.durationMonths && !init.completed) {
          return { ...init, completed: true };
        }
        return init;
      });

      const newCompletedInitiatives = updatedInitiatives
        .filter(i => i.completed)
        .map(i => i.initiativeId);

      // International pressure changes
      let newPressure = prev.internationalPressure;
      newPressure += (Math.random() * 2 - 0.5) * settings.pressureGrowthModifier;
      
      // Pressure naturally increases on Hell difficulty
      if (prev.difficulty === 'hell') {
        newPressure += 8 / 12; // +8 per year
      }
      newPressure = Math.max(0, Math.min(100, newPressure));

      // Dam fill
      const isRainySeason = newMonth >= 6 && newMonth <= 9;
      const newDamLevel = Math.min(100, prev.damFillLevel + (isRainySeason ? 2 : 0.5));

      // Population growth
      const newPopulation = prev.population * (1 + prev.populationGrowthRate / 12);

      // Check game over conditions
      let gameOver: boolean = prev.gameOver;
      let gameOverReason: string = prev.gameOverReason;
      let victory = prev.victory;

      const criticalRegion = updatedRegions.find(r => r.socialTension >= 95 && r.militias >= 3);
      if (criticalRegion) {
        gameOver = true;
        gameOverReason = `Гражданская война вспыхнула в регионе ${criticalRegion.nameRu}`;
      }

      const avgWaterStress = updatedRegions.reduce((sum, r) => sum + r.waterStress, 0) / updatedRegions.length;
      if (avgWaterStress >= 90) {
        gameOver = true;
        gameOverReason = 'Массовый водный кризис привёл к коллапсу государства';
      }

      // Check for military intervention
      const pressureLevel = getPressureLevel(newPressure);
      if (pressureLevel.effects.militaryInterventionChance > 0) {
        if (Math.random() < pressureLevel.effects.militaryInterventionChance / 12) {
          gameOver = true;
          gameOverReason = 'Иностранное военное вмешательство. ООН ввела миротворцев.';
        }
      }

      // === IRAQ WATER STRESS SYSTEM ===
      let newIraqStress = prev.iraqWaterStress;
      let newIraqTension = prev.iraqTension;
      let newIraqTrust = prev.iraqTrust;

      // Dam mode affects Iraq
      switch (prev.dam.mode) {
        case 'normal':
          newIraqStress -= 0.3;
          break;
        case 'max_power':
          newIraqStress -= 0.5;
          break;
        case 'overflow':
          newIraqStress -= 0.7;
          newIraqTrust += 0.5;
          break;
        default:
          newIraqStress += 0.8; // accumulation or other
          newIraqTrust -= 0.3;
          break;
      }

      // Natural growth (population, climate change)
      newIraqStress += 0.15 * settings.populationGrowthModifier;

      // Low trust increases tension
      if (newIraqTrust < -30) {
        newIraqTension += 0.3;
      }
      if (newIraqTrust < -50) {
        newIraqTension += 0.5;
      }

      // High stress increases tension
      if (newIraqStress > 80) {
        newIraqTension += 0.4;
      }
      if (newIraqStress > 90) {
        newIraqTension += 0.8;
      }

      // Clamp values
      newIraqStress = Math.max(0, Math.min(100, newIraqStress));
      newIraqTension = Math.max(0, Math.min(100, newIraqTension));
      newIraqTrust = Math.max(-100, Math.min(100, newIraqTrust));

      // Iraq high stress increases international pressure
      if (newIraqStress > 85) {
        newPressure = Math.min(100, newPressure + 2 / 12);
      }
      if (newIraqTension > 90) {
        newPressure = Math.min(100, newPressure + 5 / 12);
      }

      // Iraq war = game over
      if (newIraqStress > 95 && newIraqTension > 90) {
        gameOver = true;
        gameOverReason = 'Ирак объявил войну. Водный конфликт перерос в вооружённое столкновение.';
      }

      // Victory condition
      if (newYear >= 2040 && !gameOver) {
        victory = true;
        gameOver = true;
        gameOverReason = 'Вы дожили до 2040 года. Победа!';
      }

      // Bankruptcy - threshold scales: Nobel=-200, Realistic=-80, Hard=-60, Brutal=-45, Nightmare=-35, Hell=-25
      const bankruptcyThreshold = -80 * settings.startingBudgetModifier;
      if (newBudget < bankruptcyThreshold) {
        gameOver = true;
        gameOverReason = `Государственное банкротство. Дефицит: ${Math.abs(newBudget).toFixed(1)} млрд $`;
      }

      return {
        ...prev,
        year: newYear,
        month: newMonth,
        totalMonths,
        budget: newBudget,
        budgetBreakdown: budget,
        lastCorruptionLoss: budget.corruptionLoss,
        damFillLevel: newDamLevel,
        internationalPressure: newPressure,
        regions: updatedRegions,
        activeInitiatives: updatedInitiatives,
        completedInitiatives: [...new Set([...prev.completedInitiatives, ...newCompletedInitiatives])],
        emergencyState,
        population: newPopulation,
        gameOver,
        gameOverReason,
        victory,
        iraqWaterStress: newIraqStress,
        iraqTension: newIraqTension,
        iraqTrust: newIraqTrust,
      };
    });
  }, [calculateBudget]);

  // Auto-advance time
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (state.gameSpeed === 0 || state.gameOver) {
      return;
    }

    const interval = SPEED_INTERVALS[state.gameSpeed];
    intervalRef.current = window.setInterval(() => {
      advanceTime();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.gameSpeed, state.gameOver, advanceTime]);

  const getSelectedRegion = useCallback(() => {
    return state.regions.find(r => r.id === state.selectedRegionId) || null;
  }, [state.regions, state.selectedRegionId]);

  const openDamPanel = useCallback(() => {
    setState(prev => ({ ...prev, showDamPanel: true }));
  }, []);

  const closeDamPanel = useCallback(() => {
    setState(prev => ({ ...prev, showDamPanel: false }));
  }, []);

  const setDamMode = useCallback((mode: DamMode) => {
    setState(prev => {
      let newFlow = prev.dam.currentFlow;
      let newPowerGen = prev.dam.powerGeneration;
      let newTrust = prev.downstreamTrust;
      
      switch (mode) {
        case 'normal':
          newFlow = 55;
          newPowerGen = 1.4;
          break;
        case 'max_power':
          newFlow = 65;
          newPowerGen = 2.2;
          break;
        case 'overflow':
          newFlow = 71;
          newPowerGen = -1.4;
          newTrust = Math.min(100, prev.downstreamTrust + 20);
          break;
      }
      
      return {
        ...prev,
        dam: { ...prev.dam, mode, currentFlow: newFlow, powerGeneration: newPowerGen },
        downstreamTrust: newTrust,
        waterRelease: newFlow,
      };
    });
  }, []);

  const emergencyRelease = useCallback(() => {
    setState(prev => {
      const releaseAmount = 120;
      const newLevel = Math.max(15, prev.dam.currentLevel - releaseAmount * 0.3);
      
      return {
        ...prev,
        dam: { ...prev.dam, currentLevel: newLevel, mode: 'emergency' as DamMode },
        damFillLevel: (newLevel / prev.dam.maxCapacity) * 100,
        downstreamTrust: Math.min(100, prev.downstreamTrust + 50),
        internationalPressure: Math.max(0, prev.internationalPressure - 30),
      };
    });
    
    addNotification({
      type: 'warning',
      title: 'АВАРИЙНЫЙ СБРОС',
      message: 'Все турбины открыты на максимум. Наводнение в нижнем течении.',
    });
  }, [addNotification]);

  // Check overflow mode unlock
  useEffect(() => {
    const hasMonitoring = state.completedInitiatives.includes('monitoring_4');
    const hasPayments = state.activeInitiatives.some(i => 
      i.initiativeId === 'ecosystem_payment' && !i.completed
    );
    const highTrust = state.downstreamTrust >= 60;
    
    const canUnlock = hasMonitoring && hasPayments && highTrust;
    
    if (canUnlock !== state.canUnlockOverflowMode) {
      setState(prev => ({ ...prev, canUnlockOverflowMode: canUnlock }));
    }
  }, [state.completedInitiatives, state.activeInitiatives, state.downstreamTrust, state.canUnlockOverflowMode]);

  return (
    <GameContext.Provider value={{
      state,
      selectRegion,
      activateInitiative,
      advanceTime,
      addNotification,
      dismissNotification,
      getSelectedRegion,
      setGameSpeed,
      openDamPanel,
      closeDamPanel,
      setDamMode,
      emergencyRelease,
      activateEmergencyState,
      cancelEmergencyState,
      setDifficulty,
      getPressureLevel: getPressureLevelFn,
      calculateBudget,
    }}>
      {children}
    </GameContext.Provider>
  );
};
