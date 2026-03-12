import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Tutorial Chapter definitions
export interface TutorialStep {
  id: string;
  instruction: string;
  voiceText: string;
  highlightElement?: string; // CSS selector or element ID
  requiredAction?: 'click' | 'select_region' | 'open_panel' | 'launch_initiative' | 'change_dam' | 'wait' | 'any_click' | 'advance_time';
  requiredTarget?: string;
  waitDuration?: number; // for 'wait' action, in ms
}

export interface TutorialChapter {
  id: number;
  title: string;
  titleRu: string;
  duration: string;
  startYear: number;
  startMonth: number;
  steps: TutorialStep[];
  introText?: string;
  introImage?: string;
}

// All 12 chapters with detailed steps - TURKEY (Tigris-Euphrates) tutorial
// Регионы: gaziantep, sanliurfa, diyarbakir, mardin, adiyaman, batman, siirt, sirnak, hakkari, elazig, malatya
// Добавлены главы про управление плотиной
const tutorialChapters: TutorialChapter[] = [
  {
    id: 1,
    title: "You are Turkey. Year 2015",
    titleRu: "Ты — Турция. 2015 год",
    duration: "10 мин",
    startYear: 2015,
    startMonth: 1,
    introText: "Январь 2015 года. Ты только что стал министром водных ресурсов Турции. У тебя в руках 89% воды, от которой зависят 70 миллионов человек в трёх странах.",
    introImage: "ataturk_dam",
    steps: [
      {
        id: "1-1",
        instruction: "Посмотри на верхнюю панель",
        voiceText: "Посмотри на верхнюю панель. Здесь отображаются основные показатели: год и месяц, бюджет, и международное давление. Нажми в любом месте чтобы продолжить.",
        highlightElement: "game-header",
        requiredAction: "any_click"
      },
      {
        id: "1-2",
        instruction: "Изучи свой бюджет",
        voiceText: "Бюджет — 28.4 миллиарда долларов. Это твои деньги на развитие. Каждая инициатива стоит реальных денег. Нажми в любом месте.",
        highlightElement: "budget-display",
        requiredAction: "any_click"
      },
      {
        id: "1-3",
        instruction: "Международное давление",
        voiceText: "Международное давление — 12 из 100. Пока все спокойны. Но если ты будешь слишком жёстко обращаться с соседями — весь мир будет против тебя.",
        highlightElement: "pressure-display",
        requiredAction: "any_click"
      },
      {
        id: "1-4",
        instruction: "Скорость игры",
        voiceText: "Здесь ты можешь управлять скоростью времени. 0 — пауза, 1 — медленно, 2 — нормально, 3 — быстро. Сейчас игра на паузе.",
        highlightElement: "speed-control",
        requiredAction: "any_click"
      }
    ]
  },
  {
    id: 2,
    title: "How to read the map and indicators",
    titleRu: "Как читать карту и индикаторы",
    duration: "8 мин",
    startYear: 2015,
    startMonth: 2,
    steps: [
      {
        id: "2-1",
        instruction: "Посмотри на карту",
        voiceText: "Это карта твоего региона. Синяя линия — река Евфрат. Чем толще линия — тем больше воды течёт. Нажми в любом месте карты.",
        highlightElement: "map-container",
        requiredAction: "any_click"
      },
      {
        id: "2-2",
        instruction: "Нажми на плотину Ататюрка",
        voiceText: "Красная точка на карте — плотина Ататюрка, самая большая в проекте GAP. Нажми на неё чтобы увидеть информацию.",
        highlightElement: "dam-ataturk",
        requiredAction: "click",
        requiredTarget: "dam"
      },
      {
        id: "2-3",
        instruction: "Изучи панель плотины",
        voiceText: "Плотина держит миллиарды кубометров воды. Ты можешь спустить воду вниз к Сирии и Ираку, или накопить её для своих нужд. Нажми для продолжения.",
        highlightElement: "dam-panel",
        requiredAction: "any_click"
      },
      {
        id: "2-4",
        instruction: "Посмотри на панель регионов слева",
        voiceText: "Слева находится список всех регионов твоей страны. Здесь ты видишь состояние каждого региона.",
        highlightElement: "regions-panel",
        requiredAction: "any_click"
      },
      {
        id: "2-5",
        instruction: "Выбери регион Газиантеп",
        voiceText: "Выбери регион Газиантеп — один из важнейших сельскохозяйственных регионов. Найди его в списке слева и нажми.",
        highlightElement: "region-gaziantep",
        requiredAction: "select_region",
        requiredTarget: "gaziantep"
      },
      {
        id: "2-6",
        instruction: "Изучи индикаторы региона",
        voiceText: "Видишь 4 показателя? Водный стресс показывает нехватку воды. Социальное напряжение — насколько люди злы. Доверие к власти и количество ополчений. Если напряжение дойдёт до 100% — начнётся бунт.",
        highlightElement: "region-gaziantep",
        requiredAction: "any_click"
      }
    ]
  },
  {
    id: 3,
    title: "Dam Control - Your Main Weapon",
    titleRu: "Управление плотиной — твоё главное оружие",
    duration: "12 мин",
    startYear: 2015,
    startMonth: 4,
    introText: "Плотина Ататюрка — самая мощная плотина в проекте GAP. Она может держать 48 миллиардов кубометров воды. Это твоё главное оружие и главная ответственность.",
    steps: [
      {
        id: "3-1",
        instruction: "Нажми на плотину на карте",
        voiceText: "Красная точка на карте — плотина Ататюрка. Нажми на неё чтобы открыть панель управления. Это самое важное место в игре.",
        highlightElement: "dam-ataturk",
        requiredAction: "click",
        requiredTarget: "dam"
      },
      {
        id: "3-2",
        instruction: "Панель управления плотиной",
        voiceText: "Это полноэкранная панель управления плотиной. Слева — 3D модель озера с текущим уровнем воды. Справа — режимы работы плотины.",
        highlightElement: "dam-panel",
        requiredAction: "any_click"
      },
      {
        id: "3-3",
        instruction: "Режим 1: Нормальный режим",
        voiceText: "Нормальный режим: 48-62 млрд м³ воды в год спускается вниз. Плотина приносит +1.4 млрд долларов от электроэнергии. Это базовый режим.",
        highlightElement: "dam-mode-normal",
        requiredAction: "any_click"
      },
      {
        id: "3-4",
        instruction: "Режим 2: Максимальная выработка",
        voiceText: "Максимальная выработка: больше воды через турбины = больше электричества (+2.2 млрд $/год). Но этот режим доступен только когда плотина заполнена более чем на 50%.",
        highlightElement: "dam-mode-max",
        requiredAction: "any_click"
      },
      {
        id: "3-5",
        instruction: "Режим 3: АВАРИЙНЫЙ СБРОС",
        voiceText: "АВАРИЙНЫЙ СБРОС — красная кнопка. Доступна только при заполнении ≥90%. Спускает 100-140 млрд м³ за сезон. ВНИМАНИЕ: это вызывает наводнение в нижних странах!",
        highlightElement: "dam-mode-emergency",
        requiredAction: "any_click"
      },
      {
        id: "3-6",
        instruction: "Последствия аварийного сброса",
        voiceText: "Аварийный сброс требует ДВОЙНОГО подтверждения. Последствия: наводнение в Сирии и Ираке, уровень озера падает до 15-30 млрд м³, но вероятность войны снижается на 5 лет.",
        highlightElement: "dam-panel",
        requiredAction: "any_click"
      },
      {
        id: "3-7",
        instruction: "Режим 4: Режим переполнения (секретный)",
        voiceText: "Секретный режим 'Нил для всех' появляется только при высоком доверии соседей (+60) и завершённом совместном мониторинге. Стабильный поток навсегда, но меньше электричества.",
        highlightElement: "dam-panel",
        requiredAction: "any_click"
      },
      {
        id: "3-8",
        instruction: "Закрой панель плотины",
        voiceText: "Теперь ты знаешь, как управлять плотиной. Нажми на крестик или за пределами панели чтобы закрыть её.",
        highlightElement: "dam-panel",
        requiredAction: "any_click"
      }
    ]
  },
  {
    id: 4,
    title: "Your first money and first expenses",
    titleRu: "Твои первые деньги и первые траты",
    duration: "10 мин",
    startYear: 2016,
    startMonth: 1,
    introText: "Прошёл год. Ты получил новые деньги — бюджет вырос.",
    steps: [
      {
        id: "4-1",
        instruction: "Управление временем",
        voiceText: "Посмотри на панель скорости вверху. Ты можешь ускорить или остановить время. В реальной игре время идёт автоматически.",
        highlightElement: "speed-control",
        requiredAction: "any_click"
      },
      {
        id: "4-2",
        instruction: "Посмотри на панель инициатив справа",
        voiceText: "Справа находится панель инициатив — здесь все твои возможные действия. Они разделены на категории.",
        highlightElement: "initiatives-panel",
        requiredAction: "any_click"
      },
      {
        id: "4-3",
        instruction: "Категории инициатив",
        voiceText: "Три категории: Гражданские (синяя рамка) — для развития. Дипломатические (золотая) — для отношений с соседями. Военные (красная) — крайние меры.",
        highlightElement: "initiatives-panel",
        requiredAction: "any_click"
      },
      {
        id: "4-4",
        instruction: "Стоимость инициатив",
        voiceText: "Каждая инициатива имеет реальную стоимость и время выполнения. Деньги спишутся сразу, а эффект появится через указанное время.",
        highlightElement: "initiatives-panel",
        requiredAction: "any_click"
      },
      {
        id: "4-5",
        instruction: "Бюджет и расходы",
        voiceText: "Следи за бюджетом в шапке. Каждая инициатива уменьшает его. Если бюджет станет отрицательным — начнутся серьёзные проблемы.",
        highlightElement: "budget-display",
        requiredAction: "any_click"
      }
    ]
  },
  {
    id: 5,
    title: "What is water stress and why it kills",
    titleRu: "Что такое водный стресс и почему он убивает",
    duration: "7 мин",
    startYear: 2016,
    startMonth: 6,
    steps: [
      {
        id: "5-1",
        instruction: "Посмотри на регион с высоким стрессом",
        voiceText: "Выбери регион Шанлыурфа в списке слева. Там водный стресс выше 70% — это высокий уровень.",
        highlightElement: "region-sanliurfa",
        requiredAction: "select_region",
        requiredTarget: "sanliurfa"
      },
      {
        id: "5-2",
        instruction: "Понимание водного стресса",
        voiceText: "Водный стресс показывает, сколько воды НЕ хватает для нормальной жизни. При 80%+ начинаются проблемы: урожай гибнет, люди злятся.",
        highlightElement: "region-sanliurfa",
        requiredAction: "any_click"
      },
      {
        id: "5-3",
        instruction: "Связь стресса и напряжения",
        voiceText: "Когда водный стресс высокий — социальное напряжение тоже растёт. Люди, которым нечем поливать поля, начинают бунтовать.",
        highlightElement: "region-sanliurfa",
        requiredAction: "any_click"
      },
      {
        id: "5-4",
        instruction: "Критическая точка",
        voiceText: "Если напряжение достигнет 85% — регион начнёт пульсировать красным. Это предупреждение. При 95%+ появятся ополчения.",
        highlightElement: "regions-panel",
        requiredAction: "any_click"
      }
    ]
  },
  {
    id: 6,
    title: "First civilian initiative - drip irrigation",
    titleRu: "Первая гражданская инициатива — капельное орошение",
    duration: "10 мин",
    startYear: 2017,
    startMonth: 1,
    introText: "Давай разберём, как работают инициативы и их эффекты.",
    steps: [
      {
        id: "6-1",
        instruction: "Выбери любой регион",
        voiceText: "Инициативы применяются к конкретным регионам. Выбери любой регион в списке слева.",
        highlightElement: "regions-panel",
        requiredAction: "select_region",
        requiredTarget: "any"
      },
      {
        id: "6-2",
        instruction: "Посмотри на показатели региона",
        voiceText: "Каждая инициатива изменяет показатели региона. Капельное орошение снижает водный стресс, но может временно повысить напряжение.",
        highlightElement: "regions-panel",
        requiredAction: "any_click"
      },
      {
        id: "6-3",
        instruction: "Изучи гражданские инициативы",
        voiceText: "В панели справа найди раздел 'Гражданские' с синей рамкой. Здесь инициативы для развития инфраструктуры.",
        highlightElement: "initiatives-panel",
        requiredAction: "any_click"
      },
      {
        id: "6-4",
        instruction: "Скрытые эффекты",
        voiceText: "Нажав на карточку инициативы, ты увидишь скрытые эффекты. Например, дорогие проекты могут снизить доверие — люди считают их 'для богатых'.",
        highlightElement: "initiatives-panel",
        requiredAction: "any_click"
      }
    ]
  },
  {
    id: 7,
    title: "Diplomacy - how not to push Iraq to war",
    titleRu: "Дипломатия — как не довести Ирак до войны",
    duration: "12 мин",
    startYear: 2018,
    startMonth: 1,
    introText: "2018 год. Ирак начинает нервничать. Им не хватает воды.",
    steps: [
      {
        id: "7-1",
        instruction: "Посмотри на соседей",
        voiceText: "Посмотри на карту. Внизу находятся Сирия и Ирак. Они зависят от воды, которую ты контролируешь.",
        highlightElement: "map-container",
        requiredAction: "any_click"
      },
      {
        id: "7-2",
        instruction: "Дипломатические инициативы",
        voiceText: "В панели инициатив найди раздел 'Дипломатические' — с золотой рамкой. Там все мирные способы решения конфликтов.",
        highlightElement: "initiatives-panel",
        requiredAction: "any_click"
      },
      {
        id: "7-3",
        instruction: "Совместный мониторинг",
        voiceText: "Одна из важнейших инициатив — 'Совместный мониторинг стока'. Стоит недорого, но даёт доверие соседей.",
        highlightElement: "initiatives-panel",
        requiredAction: "any_click"
      },
      {
        id: "7-4",
        instruction: "Понимание доверия",
        voiceText: "Доверие соседей — ключевой показатель. Если оно упадёт слишком низко, они начнут готовиться к войне.",
        highlightElement: "header-trust",
        requiredAction: "any_click"
      },
      {
        id: "7-5",
        instruction: "Другие опции",
        voiceText: "Есть и другие варианты: платежи за воду, международный арбитраж, секретные соглашения. Каждый имеет свою цену и риски.",
        highlightElement: "initiatives-panel",
        requiredAction: "any_click"
      },
      {
        id: "7-6",
        instruction: "Баланс интересов",
        voiceText: "Помни: ты не можешь дать соседям всю воду — твои собственные регионы тоже нуждаются в ней. Твоя задача — найти баланс.",
        highlightElement: "regions-panel",
        requiredAction: "any_click"
      }
    ]
  },
  {
    id: 8,
    title: "Black Swan - what it is and why it's the scariest",
    titleRu: "Чёрный лебедь — что это и почему это самое страшное",
    duration: "8 мин",
    startYear: 2020,
    startMonth: 7,
    introText: "2020 год, июль. Сейчас произойдёт нечто неожиданное...",
    steps: [
      {
        id: "8-1",
        instruction: "ЧЁРНЫЙ ЛЕБЕДЬ",
        voiceText: "Турция объявила внеплановый ремонт плотины. Евфрат полностью перекрыт на 60 дней. Это чёрный лебедь — событие, которое нельзя предсказать.",
        highlightElement: "map-container",
        requiredAction: "any_click"
      },
      {
        id: "8-2",
        instruction: "Последствия для реки",
        voiceText: "Когда плотина перекрыта, река становится тонкой. Вода не идёт вниз. Ирак и Сирия остаются без воды.",
        highlightElement: "map-container",
        requiredAction: "any_click"
      },
      {
        id: "8-3",
        instruction: "Реакция соседей",
        voiceText: "Социальное напряжение в соседних странах может резко вырасти. Они могут оказаться на грани войны.",
        highlightElement: "map-container",
        requiredAction: "any_click"
      },
      {
        id: "8-4",
        instruction: "Понимание чёрных лебедей",
        voiceText: "Вот что такое чёрный лебедь. Событие, которое ты не можешь предсказать и отменить. В игре их 23 вида. Некоторые заканчивают игру мгновенно.",
        highlightElement: "map-container",
        requiredAction: "any_click"
      },
      {
        id: "8-5",
        instruction: "Восстановление",
        voiceText: "После чёрного лебедя нужно быстро действовать. Дипломатия помогает создать запас прочности на случай таких событий.",
        highlightElement: "initiatives-panel",
        requiredAction: "any_click"
      }
    ]
  },
  {
    id: 9,
    title: "Military measures - when it's already too late",
    titleRu: "Военные меры — когда уже поздно",
    duration: "7 мин",
    startYear: 2021,
    startMonth: 1,
    introText: "Иногда мирные методы не работают. Давай посмотрим на крайние меры.",
    steps: [
      {
        id: "9-1",
        instruction: "Военная ветка",
        voiceText: "В панели инициатив есть раздел 'Военные' — с красной рамкой. Это крайние меры, которые имеют серьёзные последствия.",
        highlightElement: "initiatives-panel",
        requiredAction: "any_click"
      },
      {
        id: "9-2",
        instruction: "Охрана инфраструктуры",
        voiceText: "Военизированная охрана защищает твои плотины от терактов. Но она повышает напряжение в обществе.",
        highlightElement: "initiatives-panel",
        requiredAction: "any_click"
      },
      {
        id: "9-3",
        instruction: "Чрезвычайное положение",
        voiceText: "Чрезвычайное положение снижает напряжение быстро, но навсегда разрушает доверие к власти в регионе.",
        highlightElement: "initiatives-panel",
        requiredAction: "any_click"
      },
      {
        id: "8-4",
        instruction: "Опасные действия",
        voiceText: "Кибератаки и саботаж могут дать краткосрочную выгоду, но почти гарантированно приводят к войне.",
        highlightElement: "initiatives-panel",
        requiredAction: "any_click"
      },
      {
        id: "8-5",
        instruction: "Предупреждение",
        voiceText: "Военные меры — это признак того, что ты проиграл дипломатию. Старайся не доводить до этого.",
        highlightElement: "initiatives-panel",
        requiredAction: "any_click"
      }
    ]
  },
  {
    id: 10,
    title: "How to win this campaign",
    titleRu: "Как выиграть эту кампанию",
    duration: "5 мин",
    startYear: 2022,
    startMonth: 1,
    introText: "Давай подведём итоги и разберём стратегию победы.",
    steps: [
      {
        id: "9-1",
        instruction: "Цель игры",
        voiceText: "Твоя цель — дожить до целевого года (2040), не допустив войны, массовой смерти или коллапса государства.",
        highlightElement: "game-header",
        requiredAction: "any_click"
      },
      {
        id: "9-2",
        instruction: "Баланс показателей",
        voiceText: "Следи за всеми показателями. Водный стресс ниже 80%. Напряжение ниже 85%. Доверие выше 30%. Ополчений — 0.",
        highlightElement: "regions-panel",
        requiredAction: "any_click"
      },
      {
        id: "9-3",
        instruction: "Инвестиции",
        voiceText: "Инвестируй в инфраструктуру заранее. Капельное орошение, облицовка каналов — это долгосрочные решения.",
        highlightElement: "initiatives-panel",
        requiredAction: "any_click"
      },
      {
        id: "9-4",
        instruction: "Дипломатия",
        voiceText: "Поддерживай отношения с соседями. Совместный мониторинг, платежи за воду — это страховка от войны.",
        highlightElement: "initiatives-panel",
        requiredAction: "any_click"
      },
      {
        id: "9-5",
        instruction: "Готовность к неожиданностям",
        voiceText: "Держи резерв бюджета и воды. Чёрные лебеди случаются внезапно, и нужно быть готовым.",
        highlightElement: "budget-display",
        requiredAction: "any_click"
      }
    ]
  },
  {
    id: 10,
    title: "Finale and transition to the real game",
    titleRu: "Финал и переход в настоящую игру",
    duration: "3 мин",
    startYear: 2025,
    startMonth: 1,
    introText: "Поздравляем! Ты прошёл обучение.",
    steps: [
      {
        id: "10-1",
        instruction: "Что ты узнал",
        voiceText: "Теперь ты знаешь, как работает водная политика. Как читать показатели, как использовать инициативы, как поддерживать баланс.",
        highlightElement: "game-header",
        requiredAction: "any_click"
      },
      {
        id: "10-2",
        instruction: "Реальные кампании",
        voiceText: "В реальных кампаниях будет сложнее. Больше регионов, больше соседей, больше чёрных лебедей. Но механики те же самые.",
        highlightElement: "map-container",
        requiredAction: "any_click"
      },
      {
        id: "10-3",
        instruction: "Удачи!",
        voiceText: "Вода — это не просто ресурс. Это власть, жизнь и война одновременно. Добро пожаловать в реальный мир. Нажми 'Далее' чтобы завершить обучение.",
        highlightElement: "game-header",
        requiredAction: "any_click"
      }
    ]
  }
];

// Q&A Items
export interface QAItem {
  id: number;
  question: string;
  answer: string;
  category: 'basics' | 'water' | 'diplomacy' | 'military' | 'events' | 'dam' | 'budget' | 'pressure' | 'emergency' | 'social';
}

const tutorialQA: QAItem[] = [
  // Basics (1-20)
  { id: 1, question: "Как выиграть игру?", answer: "Дожить до целевого года (2040-2050), не допустив войны, массовой смерти или коллапса государства.", category: 'basics' },
  { id: 2, question: "Как проиграть?", answer: "Социальное напряжение 95%+ с ополчениями, средний водный стресс 90%+, война с соседями, или банкротство.", category: 'basics' },
  { id: 3, question: "Что такое бюджет?", answer: "Деньги на инициативы. Пополняется каждый месяц. Если станет отрицательным — проблемы.", category: 'basics' },
  { id: 4, question: "Как управлять временем?", answer: "Кнопки 0-3 вверху: 0=пауза, 1=медленно, 2=нормально, 3=быстро. Пробел для паузы.", category: 'basics' },
  { id: 5, question: "Что показывают регионы?", answer: "4 показателя: водный стресс, социальное напряжение, доверие к власти, ополчения.", category: 'basics' },
  { id: 6, question: "Как выбрать регион?", answer: "Нажми на карточку региона в левой панели.", category: 'basics' },
  { id: 7, question: "Что такое инициатива?", answer: "Действие, которое ты можешь предпринять. Стоит денег и времени, даёт эффекты.", category: 'basics' },
  { id: 8, question: "Сколько длится игра?", answer: "15-25 лет игрового времени. В реальном времени — 1-3 часа.", category: 'basics' },
  { id: 9, question: "Можно ли сохраниться?", answer: "Автосохранение каждый год. Можно загрузить последнее сохранение.", category: 'basics' },
  { id: 10, question: "Что означают цвета?", answer: "Зелёный — хорошо. Жёлтый — внимание. Красный — критично.", category: 'basics' },
  
  // Water (21-40)
  { id: 21, question: "Что такое водный стресс?", answer: "Процент нехватки воды. 0% — воды достаточно. 100% — полная засуха.", category: 'water' },
  { id: 22, question: "Почему водный стресс растёт?", answer: "Население растёт, климат меняется, сельское хозяйство требует больше воды.", category: 'water' },
  { id: 23, question: "Как снизить водный стресс?", answer: "Капельное орошение, облицовка каналов, десалинизация, импорт виртуальной воды.", category: 'water' },
  { id: 24, question: "Что такое плотина?", answer: "Сооружение, которое накапливает воду. Ты контролируешь, сколько воды спускать вниз.", category: 'water' },
  { id: 25, question: "Зачем спускать воду соседям?", answer: "Чтобы поддержать отношения и избежать войны. Но своим регионам тоже нужна вода.", category: 'water' },
  { id: 26, question: "Что такое капельное орошение?", answer: "Технология полива, которая экономит воду. Снижает стресс, но дорого.", category: 'water' },
  { id: 27, question: "Что такое виртуальная вода?", answer: "Вода, 'скрытая' в товарах. Импорт зерна = импорт воды, которая нужна для его выращивания.", category: 'water' },
  { id: 28, question: "Почему река стала тонкой?", answer: "Плотина выше по течению держит воду или случился чёрный лебедь.", category: 'water' },
  { id: 29, question: "Можно ли создать воду?", answer: "Нет. Можно только перераспределить, сэкономить или опреснить морскую.", category: 'water' },
  { id: 30, question: "Что такое десалинизация?", answer: "Опреснение морской воды. Дорого, но создаёт новую воду для прибрежных регионов.", category: 'water' },
  
  // Diplomacy (41-60)
  { id: 41, question: "Что такое доверие соседей?", answer: "Насколько соседние страны верят твоим обещаниям. Влияет на вероятность войны.", category: 'diplomacy' },
  { id: 42, question: "Как повысить доверие?", answer: "Совместный мониторинг, платежи за воду, выполнение обещаний.", category: 'diplomacy' },
  { id: 43, question: "Что такое международное давление?", answer: "Насколько мировое сообщество недовольно тобой. Высокое давление = санкции.", category: 'diplomacy' },
  { id: 44, question: "Можно ли выиграть без дипломатии?", answer: "Почти невозможно. Даже на лёгком уровне война вероятна без дипломатии.", category: 'diplomacy' },
  { id: 45, question: "Что такое арбитраж?", answer: "Международный суд решает спор. Долго, дорого, результат непредсказуем.", category: 'diplomacy' },
  { id: 46, question: "Что такое секретное соглашение?", answer: "Сделка втайне от общества. Эффективно, но если вскроется — катастрофа.", category: 'diplomacy' },
  { id: 47, question: "Почему сосед меня ненавидит?", answer: "Потому что ты контролируешь его воду. Он знает, что ты можешь 'выключить кран'.", category: 'diplomacy' },
  { id: 48, question: "Как избежать войны?", answer: "Поддерживай доверие выше 0, давай достаточно воды, реагируй на кризисы.", category: 'diplomacy' },
  { id: 49, question: "Что даёт совместный мониторинг?", answer: "Доверие растёт, обе стороны видят реальные данные о воде.", category: 'diplomacy' },
  { id: 50, question: "Можно ли подкупить соседа?", answer: "Платежи за воду — легальная форма. Работает, пока есть деньги.", category: 'diplomacy' },
  
  // Military (61-75)
  { id: 61, question: "Когда нужны военные меры?", answer: "Когда уже поздно. Ополчения атакуют, соседи готовят вторжение.", category: 'military' },
  { id: 62, question: "Что такое ополчения?", answer: "Вооружённые группы недовольных. Появляются при высоком напряжении, атакуют инфраструктуру.", category: 'military' },
  { id: 63, question: "Как убрать ополчения?", answer: "Снизить напряжение, повысить доверие, или подавить силой (плохая идея).", category: 'military' },
  { id: 64, question: "Что такое чрезвычайное положение?", answer: "Временно снижает напряжение, но навсегда разрушает доверие в регионе.", category: 'military' },
  { id: 65, question: "Стоит ли атаковать соседа?", answer: "Почти никогда. Война разрушает обе стороны и редко решает проблему воды.", category: 'military' },
  { id: 66, question: "Что будет если начнётся война?", answer: "Экономика падает, регионы разрушаются, ополчения множатся. Почти всегда конец игры.", category: 'military' },
  { id: 67, question: "Можно ли выиграть войну?", answer: "Технически да, но ценой огромных потерь. Даже победа оставляет страну в руинах.", category: 'military' },
  { id: 68, question: "Что такое охрана инфраструктуры?", answer: "Военная защита плотин и каналов. Снижает риск терактов, но повышает напряжение.", category: 'military' },
  
  // Events (76-87)
  { id: 76, question: "Что такое чёрный лебедь?", answer: "Непредсказуемое событие с огромными последствиями. 23 типа в игре.", category: 'events' },
  { id: 77, question: "Какие бывают чёрные лебеди?", answer: "Засухи, наводнения, землетрясения, эпидемии, политические кризисы, аварии.", category: 'events' },
  { id: 78, question: "Можно ли предотвратить чёрного лебедя?", answer: "Нет. Можно только подготовиться: резервы воды, денег, высокое доверие.", category: 'events' },
  { id: 79, question: "Что делать во время засухи?", answer: "Режим экономии воды. Импорт виртуальной воды. Помощь критическим регионам.", category: 'events' },
  { id: 80, question: "Что делать при наводнении?", answer: "Спустить воду из водохранилищ заранее. Эвакуация. Восстановление.", category: 'events' },
  { id: 81, question: "Как влияет климат?", answer: "Зависит от сценария. Худшие сценарии = меньше воды, больше катастроф.", category: 'events' },
  { id: 82, question: "Что такое ремонт плотины?", answer: "Чёрный лебедь — временная остановка плотины. Вода не идёт вниз.", category: 'events' },
  { id: 83, question: "Бывают ли хорошие события?", answer: "Редко. Дождливый год даёт передышку, но не решает проблемы.", category: 'events' },
  { id: 84, question: "Как узнать о приближении кризиса?", answer: "Следи за показателями. Красные зоны = приближается кризис.", category: 'events' },
  { id: 85, question: "Что делать после катастрофы?", answer: "Быстро стабилизировать ситуацию. Дипломатия, помощь регионам, резервы.", category: 'events' },
  { id: 86, question: "Можно ли перезапустить после катастрофы?", answer: "Иногда. Зависит от масштаба и оставшихся ресурсов.", category: 'events' },
  { id: 87, question: "Что будет в финале?", answer: "Если дожил — оценка твоего правления. Сколько людей выжило, какой ценой.", category: 'events' }
];

// Tutorial state types
interface TutorialState {
  isActive: boolean;
  currentChapter: number;
  currentStep: number;
  completedSteps: string[];
  completedChapters: number[];
  progress: number; // 0-100
  showChapterIntro: boolean;
  showBlackSwan: boolean;
  blackSwanAcknowledged: boolean;
  canProceed: boolean;
  highlightedElement: string | null;
  isPaused: boolean;
  showQA: boolean;
  searchQuery: string;
  waitingForAction: boolean;
  requiredAction: string | null;
  requiredTarget: string | null;
  showFinalScreen: boolean;
  tutorialCompleted: boolean;
}

interface TutorialContextType extends TutorialState {
  chapters: TutorialChapter[];
  qaItems: QAItem[];
  
  // Actions
  startTutorial: () => void;
  exitTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  goToChapter: (chapterId: number) => void;
  completeAction: (action: string, target?: string) => void;
  acknowledgeBlackSwan: () => void;
  toggleQA: () => void;
  setSearchQuery: (query: string) => void;
  skipToEnd: () => void;
  completeTutorial: () => void;
  
  // Helpers
  getCurrentChapter: () => TutorialChapter | null;
  getCurrentStep: () => TutorialStep | null;
  getFilteredQA: () => QAItem[];
}

const TutorialContext = createContext<TutorialContextType | null>(null);

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within TutorialProvider');
  }
  return context;
};

interface TutorialProviderProps {
  children: ReactNode;
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
  const [state, setState] = useState<TutorialState>({
    isActive: false,
    currentChapter: 1,
    currentStep: 0,
    completedSteps: [],
    completedChapters: [],
    progress: 0,
    showChapterIntro: true,
    showBlackSwan: false,
    blackSwanAcknowledged: false,
    canProceed: false,
    highlightedElement: null,
    isPaused: false,
    showQA: false,
    searchQuery: '',
    waitingForAction: false,
    requiredAction: null,
    requiredTarget: null,
    showFinalScreen: false,
    tutorialCompleted: false
  });

  // Calculate progress
  const calculateProgress = useCallback(() => {
    const totalSteps = tutorialChapters.reduce((sum, ch) => sum + ch.steps.length, 0);
    const completed = state.completedSteps.length;
    return Math.round((completed / totalSteps) * 100);
  }, [state.completedSteps]);

  // Update progress when steps change
  useEffect(() => {
    const newProgress = calculateProgress();
    if (newProgress !== state.progress) {
      setState(prev => ({ ...prev, progress: newProgress }));
    }
  }, [calculateProgress, state.progress]);

  // Get current chapter
  const getCurrentChapter = useCallback((): TutorialChapter | null => {
    return tutorialChapters.find(ch => ch.id === state.currentChapter) || null;
  }, [state.currentChapter]);

  // Get current step
  const getCurrentStep = useCallback((): TutorialStep | null => {
    const chapter = getCurrentChapter();
    if (!chapter) return null;
    return chapter.steps[state.currentStep] || null;
  }, [getCurrentChapter, state.currentStep]);

  // Start tutorial
  const startTutorial = useCallback(() => {
    console.log('[TutorialContext] startTutorial called, setting isActive to true');
    setState({
      isActive: true,
      currentChapter: 1,
      currentStep: 0,
      completedSteps: [],
      completedChapters: [],
      progress: 0,
      showChapterIntro: true,
      showBlackSwan: false,
      blackSwanAcknowledged: false,
      canProceed: false,
      highlightedElement: null,
      isPaused: false,
      showQA: false,
      searchQuery: '',
      waitingForAction: false,
      requiredAction: null,
      requiredTarget: null,
      showFinalScreen: false,
      tutorialCompleted: false
    });
  }, []);

  // Exit tutorial
  const exitTutorial = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false
    }));
  }, []);

  // Move to next step
  const nextStep = useCallback(() => {
    const chapter = getCurrentChapter();
    if (!chapter) return;

    const currentStepObj = getCurrentStep();
    if (currentStepObj) {
      setState(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, currentStepObj.id]
      }));
    }

    // Check if there are more steps in current chapter
    if (state.currentStep < chapter.steps.length - 1) {
      const nextStepObj = chapter.steps[state.currentStep + 1];
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        highlightedElement: nextStepObj.highlightElement || null,
        waitingForAction: !!nextStepObj.requiredAction,
        requiredAction: nextStepObj.requiredAction || null,
        requiredTarget: nextStepObj.requiredTarget || null,
        canProceed: !nextStepObj.requiredAction || nextStepObj.requiredAction === 'any_click'
      }));
    } else {
      // Move to next chapter
      const nextChapterId = state.currentChapter + 1;
      const nextChapter = tutorialChapters.find(ch => ch.id === nextChapterId);
      
      setState(prev => ({
        ...prev,
        completedChapters: [...prev.completedChapters, prev.currentChapter]
      }));

      if (nextChapter) {
        // Check for black swan chapter
        if (nextChapterId === 8) {
          setState(prev => ({
            ...prev,
            showBlackSwan: true,
            currentChapter: nextChapterId,
            currentStep: 0,
            showChapterIntro: false
          }));
        } else if (nextChapterId === 11) {
          // Final chapter
          setState(prev => ({
            ...prev,
            currentChapter: nextChapterId,
            currentStep: 0,
            showChapterIntro: true,
            showFinalScreen: false
          }));
        } else {
          setState(prev => ({
            ...prev,
            currentChapter: nextChapterId,
            currentStep: 0,
            showChapterIntro: !!nextChapter.introText
          }));
        }
      } else {
        // Tutorial completed
        setState(prev => ({
          ...prev,
          showFinalScreen: true,
          progress: 100
        }));
      }
    }
  }, [getCurrentChapter, getCurrentStep, state.currentChapter, state.currentStep]);

  // Previous step
  const previousStep = useCallback(() => {
    if (state.currentStep > 0) {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1
      }));
    } else if (state.currentChapter > 1) {
      const prevChapter = tutorialChapters.find(ch => ch.id === state.currentChapter - 1);
      if (prevChapter) {
        setState(prev => ({
          ...prev,
          currentChapter: prev.currentChapter - 1,
          currentStep: prevChapter.steps.length - 1
        }));
      }
    }
  }, [state.currentChapter, state.currentStep]);

  // Go to specific chapter
  const goToChapter = useCallback((chapterId: number) => {
    const chapter = tutorialChapters.find(ch => ch.id === chapterId);
    if (chapter) {
      const firstStep = chapter.steps[0];
      setState(prev => {
        if (prev.currentChapter === chapterId && prev.showChapterIntro) {
          return {
            ...prev,
            showChapterIntro: false,
            currentStep: 0,
            highlightedElement: firstStep?.highlightElement || null,
            waitingForAction: !!firstStep?.requiredAction,
            requiredAction: firstStep?.requiredAction || null,
            requiredTarget: firstStep?.requiredTarget || null,
            canProceed: !firstStep?.requiredAction || firstStep?.requiredAction === 'any_click'
          };
        }
        return {
          ...prev,
          currentChapter: chapterId,
          currentStep: 0,
          showChapterIntro: !!chapter.introText
        };
      });
    }
  }, []);

  // Complete required action
  const completeAction = useCallback((action: string, target?: string) => {
    const currentStepObj = getCurrentStep();
    if (!currentStepObj) return;

    // Flexible action matching
    let actionMatches = false;
    
    if (currentStepObj.requiredAction === action) actionMatches = true;
    if (currentStepObj.requiredAction === 'any_click') actionMatches = true;
    if (action === 'click' && ['click', 'any_click', 'select_region', 'open_panel'].includes(currentStepObj.requiredAction || '')) {
      actionMatches = true;
    }
    if (action === 'any_click') actionMatches = true;
    
    // Flexible target matching
    let targetMatches = false;
    
    if (!currentStepObj.requiredTarget) targetMatches = true;
    if (currentStepObj.requiredTarget === 'any') targetMatches = true;
    if (target && currentStepObj.requiredTarget === target) targetMatches = true;
    
    // Partial match
    if (target && currentStepObj.requiredTarget && !targetMatches) {
      const reqLower = currentStepObj.requiredTarget.toLowerCase().replace(/-/g, '').replace(/_/g, '');
      const tarLower = target.toLowerCase().replace(/-/g, '').replace(/_/g, '');
      
      if (reqLower.includes(tarLower) || tarLower.includes(reqLower)) {
        targetMatches = true;
      }
    }
    
    // Dam-specific matching
    if (!targetMatches && target && currentStepObj.requiredTarget) {
      const damWords = ['dam', 'ataturk', 'gerd', 'плотин'];
      const targetHasDam = damWords.some(w => target.toLowerCase().includes(w));
      const requiredHasDam = damWords.some(w => currentStepObj.requiredTarget!.toLowerCase().includes(w));
      
      if (targetHasDam && requiredHasDam) {
        targetMatches = true;
      }
    }

    if (actionMatches && targetMatches) {
      setState(prev => ({
        ...prev,
        waitingForAction: false,
        canProceed: true
      }));
    }
  }, [getCurrentStep]);

  // Acknowledge black swan
  const acknowledgeBlackSwan = useCallback(() => {
    setState(prev => ({
      ...prev,
      showBlackSwan: false,
      blackSwanAcknowledged: true,
      showChapterIntro: false
    }));
  }, []);

  // Toggle Q&A panel
  const toggleQA = useCallback(() => {
    setState(prev => ({
      ...prev,
      showQA: !prev.showQA
    }));
  }, []);

  // Set search query
  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query
    }));
  }, []);

  // Get filtered Q&A
  const getFilteredQA = useCallback((): QAItem[] => {
    if (!state.searchQuery.trim()) return tutorialQA;
    
    const query = state.searchQuery.toLowerCase();
    return tutorialQA.filter(
      item => item.question.toLowerCase().includes(query) || 
              item.answer.toLowerCase().includes(query)
    );
  }, [state.searchQuery]);

  // Skip to end
  const skipToEnd = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentChapter: 10,
      currentStep: 0,
      progress: 95,
      showFinalScreen: false,
      showChapterIntro: true
    }));
  }, []);

  // Complete tutorial
  const completeTutorial = useCallback(() => {
    localStorage.setItem('tutorialCompleted', 'true');
    setState(prev => ({
      ...prev,
      tutorialCompleted: true,
      isActive: false,
      progress: 100
    }));
  }, []);

  // Update highlighted element when step changes
  useEffect(() => {
    const step = getCurrentStep();
    if (step && state.isActive && !state.showChapterIntro && !state.showBlackSwan) {
      setState(prev => ({
        ...prev,
        highlightedElement: step.highlightElement || null,
        waitingForAction: !!step.requiredAction,
        requiredAction: step.requiredAction || null,
        requiredTarget: step.requiredTarget || null,
        canProceed: !step.requiredAction || step.requiredAction === 'any_click'
      }));
    }
  }, [getCurrentStep, state.isActive, state.showChapterIntro, state.showBlackSwan, state.currentStep, state.currentChapter]);

  const value: TutorialContextType = {
    ...state,
    chapters: tutorialChapters,
    qaItems: tutorialQA,
    startTutorial,
    exitTutorial,
    nextStep,
    previousStep,
    goToChapter,
    completeAction,
    acknowledgeBlackSwan,
    toggleQA,
    setSearchQuery,
    skipToEnd,
    completeTutorial,
    getCurrentChapter,
    getCurrentStep,
    getFilteredQA
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};
