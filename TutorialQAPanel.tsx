import React, { useState } from 'react';
import { useTutorial, QAItem } from '../../context/TutorialContext';

const categoryLabels: Record<string, string> = {
  basics: '📚 Основы',
  water: '💧 Вода',
  dam: '🏭 Плотина',
  budget: '💰 Бюджет',
  pressure: '🌍 Давление',
  emergency: '⚠️ ЧП',
  social: '🎉 Социальные',
  diplomacy: '🤝 Дипломатия',
  military: '⚔️ Военное',
  events: '🌪️ События'
};

const categoryColors: Record<string, string> = {
  basics: 'bg-blue-900/50 text-blue-400',
  water: 'bg-cyan-900/50 text-cyan-400',
  dam: 'bg-indigo-900/50 text-indigo-400',
  budget: 'bg-green-900/50 text-green-400',
  pressure: 'bg-purple-900/50 text-purple-400',
  emergency: 'bg-red-900/50 text-red-400',
  social: 'bg-pink-900/50 text-pink-400',
  diplomacy: 'bg-yellow-900/50 text-yellow-400',
  military: 'bg-red-900/50 text-red-400',
  events: 'bg-orange-900/50 text-orange-400'
};

// Полный список Q&A на русском языке
const FULL_QA_LIST: QAItem[] = [
  // === ПЛОТИНА (dam) ===
  { id: 1, question: 'Как открыть панель управления плотиной?', answer: 'Нажмите на красную точку плотины на карте. Откроется полноэкранная панель с 4 режимами работы.', category: 'dam' },
  { id: 2, question: 'Какие режимы работы плотины существуют?', answer: '4 режима: 1) Нормальный — 48-62 млрд м³/год, +$1.4B дохода. 2) Максимальная выработка — 62-68 млрд м³, +$2.2B, нужно ≥50% заполнения. 3) Аварийный сброс — 100-140 млрд м³, нужно ≥90% заполнения. 4) Режим переполнения — секретный, требует высокое доверие.', category: 'dam' },
  { id: 3, question: 'Когда доступен аварийный сброс?', answer: 'Только когда плотина заполнена на 90% и более. Это экстренная мера, которая вызывает наводнение внизу, но резко снижает международное давление.', category: 'dam' },
  { id: 4, question: 'Что такое режим переполнения?', answer: 'Секретный режим плотины, доступный при: доверии нижней страны ≥60, завершённом мониторинге уровня 4, платежах за экосистемы ≥$700M/год. Даёт стабильный поток 68-74 млрд м³/год навсегда.', category: 'dam' },
  { id: 5, question: 'Стоит ли делать аварийный сброс?', answer: 'Да, если: 1) Международное давление >80 и грозит война. 2) Нижняя страна на грани коллапса. 3) Вам нужно резко улучшить отношения. Но это снизит уровень воды до 15-30%.', category: 'dam' },
  { id: 6, question: 'Почему аварийный сброс требует двойного подтверждения?', answer: 'Это крайняя мера с серьёзными последствиями: наводнение в нижних странах, потеря накопленной воды. В реальности такие решения принимаются на уровне президента.', category: 'dam' },
  { id: 7, question: 'Как быстрее заполнить плотину?', answer: 'Плотина заполняется быстрее в сезон дождей (июнь-сентябрь). Используйте нормальный режим и не открывайте аварийный сброс без необходимости.', category: 'dam' },
  { id: 8, question: 'Что показывает уровень заполнения?', answer: 'Круговой индикатор показывает процент заполнения водохранилища. 100% = полная ёмкость. Цвет меняется: красный (<30%), жёлтый (30-60%), синий (>60%).', category: 'dam' },

  // === БЮДЖЕТ (budget) ===
  { id: 20, question: 'Почему денег постоянно не хватает?', answer: 'Постоянные расходы: 1) Обслуживание долга — 1% от госдолга ежемесячно. 2) Эксплуатация инфраструктуры — $15M/мес за капельное, $37.5M за десалинизацию. 3) Коррупция — 4-25% бюджета. 4) Импорт виртуальной воды — минимум $0.1B/мес.', category: 'budget' },
  { id: 21, question: 'Как работает коррупция?', answer: 'Каждый месяц теряется 4-25% бюджета (зависит от сложности и доверия к власти). Если доверие <40% — коррупция до 25%. Это реалистично: в странах с водным кризисом коррупция огромна.', category: 'budget' },
  { id: 22, question: 'Что такое эксплуатация инфраструктуры?', answer: 'Построенные объекты требуют обслуживания: капельное орошение — $180M/год, десалинизация — $450M-$2.2B/год, фонтаны — $20M/год, бассейны — $45M/год. Это навсегда.', category: 'budget' },
  { id: 23, question: 'Что будет при банкротстве?', answer: 'Если дефицит превысит $50B — игра окончена. Вы не сможете платить армии, начнутся бунты, страна развалится.', category: 'budget' },
  { id: 24, question: 'Как снизить расходы?', answer: 'Не стройте лишнего! Каждая инициатива имеет эксплуатационные расходы. Поднимайте доверие к власти — это снизит коррупцию. Используйте дипломатию вместо военных мер.', category: 'budget' },
  { id: 25, question: 'Что такое обслуживание долга?', answer: 'Вы платите 1% от госдолга каждый месяц. Турция: $2.8B/год. Индия: до $98B/год. Это реальные цифры, основанные на данных 2024 года.', category: 'budget' },

  // === МЕЖДУНАРОДНОЕ ДАВЛЕНИЕ (pressure) ===
  { id: 30, question: 'Что такое международное давление?', answer: '5 уровней санкций: 0-40 — ничего. 41-60 — -15% дохода. 61-80 — -35% дохода + эмбарго. 81-95 — заморозка счетов. 96-100 — полная блокада + 15% шанс военного вмешательства.', category: 'pressure' },
  { id: 31, question: 'Как снизить давление?', answer: 'Дипломатия: совместный мониторинг, платежи за экосистемы, международный арбитраж. Максимум -8 давления в год. Аварийный сброс плотины даёт -30 мгновенно.', category: 'pressure' },
  { id: 32, question: 'Что будет при давлении 100?', answer: 'Полная блокада: -70% дохода. Каждый год 15% шанс военного вмешательства — США, Китай или ООН введут войска и заставят вас открыть плотину.', category: 'pressure' },
  { id: 33, question: 'Почему давление растёт само?', answer: 'Если вы перекрываете воду нижним странам, они жалуются в ООН. СМИ раздувают кризис. Каждое жёсткое действие даёт +15-30 давления мгновенно.', category: 'pressure' },
  { id: 34, question: 'Что такое заморозка счетов?', answer: 'При давлении 81-95 западные банки замораживают ваши счета. Вы теряете $2-8B разово и не можете брать кредиты Всемирного банка.', category: 'pressure' },

  // === ЧРЕЗВЫЧАЙНОЕ ПОЛОЖЕНИЕ (emergency) ===
  { id: 40, question: 'Как работает чрезвычайное положение?', answer: 'Фаза 1 (0-6 мес): армия раздаёт воду, комендантский час, -55% напряжения. Фаза 2 (6-18 мес): люди устали, +8% напряжения/мес, -15 доверия/мес. Фаза 3 (18+ мес): +25% шанс ополчений каждый месяц.', category: 'emergency' },
  { id: 41, question: 'Когда вводить ЧП?', answer: 'Только когда напряжение >85% и вот-вот начнётся восстание. ЧП — это морфий: сначала облегчение, потом жёсткая ломка.', category: 'emergency' },
  { id: 42, question: 'Когда отменять ЧП?', answer: 'Через 4-5 месяцев максимум! После 6 месяцев начинается деградация. После 18 — появляются ополчения. Идеально: ввели → снизили напряжение → отменили.', category: 'emergency' },
  { id: 43, question: 'Что будет если не отменить ЧП?', answer: 'После 18 месяцев каждый месяц 25% шанс появления ополчений. Они начнут взрывать вашу инфраструктуру. Это путь к гражданской войне.', category: 'emergency' },
  { id: 44, question: 'Почему ЧП называют "морфием"?', answer: 'Потому что сначала даёт огромное облегчение (-55% напряжения!), но потом вызывает зависимость и ломку. Чем дольше держите — тем хуже последствия.', category: 'emergency' },

  // === СОЦИАЛЬНЫЕ ИНИЦИАТИВЫ (social) ===
  { id: 50, question: 'Зачем нужны фонтаны и парки?', answer: 'Публичные фонтаны: $80M, -18% напряжения, +12 доверия. Люди видят воду — успокаиваются. Это работает даже если воды реально не хватает.', category: 'social' },
  { id: 51, question: 'Что такое пропаганда?', answer: '5 уровней: 1) Билборды $50M, 2) Листовки $120M, 3) Радио $280M, 4) ТВ $520M, 5) Блокбастер $800M. Каждый уровень снижает напряжение на 8-25%.', category: 'social' },
  { id: 52, question: 'Как работают праздники?', answer: 'Праздник "День реки": $120M, -22% напряжения на 24 месяца. Бесплатная вода и еда отвлекают людей от проблем. Хлеб и зрелища.', category: 'social' },
  { id: 53, question: 'Что такое программа "Герой нации"?', answer: '4 уровня наград для фермеров, которые экономят воду. От $30M до $320M. Снижает напряжение и повышает доверие. Фермеры становятся вашими союзниками.', category: 'social' },
  { id: 54, question: 'Зачем строить храмы с фонтанами?', answer: 'Храм с огромным фонтаном: $100M-$1.2B (5 уровней). До -30% напряжения, +25 доверия. Работает в любой стране: мечети, церкви, храмы. Религия + вода = мир.', category: 'social' },
  { id: 55, question: 'Что даёт раздача воды автоцистернами?', answer: '$240M/год, -35% напряжения. Армия развозит воду по деревням. Люди благодарны. Но это подписка — платите каждый год.', category: 'social' },

  // === ВОДА (water) ===
  { id: 60, question: 'Почему река стала тонкой?', answer: 'Толщина реки на карте = текущий расход воды. Если верхняя страна перекрыла плотину или засуха — река истончается. 1 пиксель = 0 м³/с, 28 пикселей = 4000 м³/с.', category: 'water' },
  { id: 61, question: 'Зачем нужно капельное орошение?', answer: 'Снижает водный стресс на 12-28%. Но стоит $180M + $180M/год эксплуатации. Израильские технологии — лучшее, что есть для экономии воды.', category: 'water' },
  { id: 62, question: 'Что такое водный стресс?', answer: 'Процент нехватки воды в регионе. 0% = воды достаточно. 100% = катастрофа. Выше 80% — начинаются бунты. Выше 92% — массовая миграция.', category: 'water' },
  { id: 63, question: 'Что такое виртуальная вода?', answer: 'Импорт зерна вместо выращивания. 1 кг пшеницы = 1000 литров воды. Покупая зерно, вы "импортируете" воду. $600M/год снижает стресс на 15%.', category: 'water' },
  { id: 64, question: 'Как работает десалинизация?', answer: 'Малая: $1.1B + $450M/год, +400 млн м³ воды. Крупная: $11B + $2.2B/год, +3.5 млрд м³. Дорого, но даёт чистую воду без зависимости от реки.', category: 'water' },

  // === ДИПЛОМАТИЯ (diplomacy) ===
  { id: 70, question: 'Что даёт совместный мониторинг?', answer: '4 уровня. Уровень 1: $80M, +15 доверия. Уровень 4: $1.2B, +45 доверия и -30% вероятности чёрных лебедей. Прозрачность = мир.', category: 'diplomacy' },
  { id: 71, question: 'Что такое платежи за экосистемы?', answer: 'Вы платите верхней стране $300-800M/год, она спускает вам воду. Каждые $100M = +3 млрд м³/год. Если прекратите — мгновенно -50 доверия.', category: 'diplomacy' },
  { id: 72, question: 'Стоит ли идти в Гаагу?', answer: 'Международный арбитраж: $450M, 8-15 лет. 50% шанс получить +15-25 млрд м³/год навсегда. 50% шанс проиграть и получить -40 доверия. Рискованно.', category: 'diplomacy' },
  { id: 73, question: 'Что такое секретное соглашение?', answer: 'Договор "вода в обмен на...": оружие, голос в ООН, территория. +20-40 млрд м³/год на 10 лет. Но если вскроется — 70% шанс мгновенной войны.', category: 'diplomacy' },

  // === ВОЕННОЕ (military) ===
  { id: 80, question: 'Что даёт охрана инфраструктуры?', answer: '3 уровня: $400M-$2.1B. Снижает успех терактов на 60%. Но +15 напряжения по всей стране — людям не нравятся танки у плотин.', category: 'military' },
  { id: 81, question: 'Что такое кибератака на плотину?', answer: '$800M, враг теряет контроль на 1-4 месяца, вы получаете всю воду. Но 80% шанс быть пойманным = мгновенная война.', category: 'military' },
  { id: 82, question: 'Что такое саботаж?', answer: '$1.5B, уничтожение одной плотины или канала врага. 95% шанс начала полномасштабной войны. Только для отчаянных.', category: 'military' },
  { id: 83, question: 'Можно ли полностью перекрыть реку?', answer: 'Да, если вы верхняя страна. Нижняя теряет 100% стока. Война через 6-18 месяцев с вероятностью 99%. Это ядерный вариант.', category: 'military' },

  // === СОБЫТИЯ (events) ===
  { id: 90, question: 'Что такое чёрный лебедь?', answer: 'Непредсказуемое событие: засуха, наводнение, теракт, политический переворот, эпидемия. Нельзя предотвратить, можно только пережить.', category: 'events' },
  { id: 91, question: 'Как часто бывают чёрные лебеди?', answer: 'Nobel: никогда. Realistic: каждые 3-5 лет. Brutal: каждые 1-2 года. Hell: каждые 14-28 месяцев гарантированно.', category: 'events' },
  { id: 92, question: 'Что делать при засухе?', answer: 'Засуха снижает сток на 30-60%. Используйте резервы плотины, импортируйте виртуальную воду, вводите рационирование. Длится 6-24 месяца.', category: 'events' },
  { id: 93, question: 'Что такое война с соседом?', answer: 'Если напряжение в соседней стране >95% + ваше давление >80% — война. Армия требует бюджет, население паникует, инфраструктура под угрозой.', category: 'events' },

  // === ОСНОВЫ (basics) ===
  { id: 100, question: 'Как выиграть игру?', answer: 'Дожить до конечного года (2040-2050) без: войны, ядерной катастрофы, полного коллапса, банкротства. Вода должна течь. Люди должны быть живы.', category: 'basics' },
  { id: 101, question: 'Что такое социальное напряжение?', answer: 'Насколько люди злы. 0% = рай. 100% = восстание. Выше 85% — появляются ополчения. Выше 95% + ополчения ≥3 = гражданская война.', category: 'basics' },
  { id: 102, question: 'Что такое доверие к власти?', answer: 'Насколько люди верят правительству. Высокое доверие = меньше коррупции, быстрее инициативы, меньше бунтов. Низкое = саботаж и хаос.', category: 'basics' },
  { id: 103, question: 'Как контролировать скорость игры?', answer: 'Клавиши 0-3 или кнопки в хедере. 0 = пауза. 1 = медленно (4 сек/мес). 2 = стандарт (2 сек/мес). 3 = быстро (0.8 сек/мес). Пробел = пауза/плей.', category: 'basics' },
  { id: 104, question: 'Что означают цвета регионов?', answer: 'Зелёный = всё хорошо. Жёлтый = напряжение растёт. Оранжевый = критично. Красный = на грани восстания. Пульсация = ополчения активны.', category: 'basics' },
  { id: 105, question: 'Зачем нужны инициативы?', answer: '72 инициативы: гражданские (инфраструктура), социальные (праздники, пропаганда), дипломатические (переговоры), военные (охрана, саботаж). Каждая меняет баланс.', category: 'basics' },
];

export const TutorialQAPanel: React.FC = () => {
  const tutorial = useTutorial();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтруем вопросы
  const filteredQA = FULL_QA_LIST.filter(item => {
    const matchesSearch = !searchQuery || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const displayQA = filteredQA;

  // Подсчёт по категориям
  const categoryCounts = Object.keys(categoryLabels).reduce((acc, key) => {
    acc[key] = FULL_QA_LIST.filter(q => q.category === key).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[450px] bg-[#0F1117] border-l border-gray-700 z-50 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-[#1a1a2e]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center">
              <span className="text-xl">👩‍🔬</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">Доктор Айше</h3>
              <p className="text-xs text-gray-500">Гидролог-консультант</p>
            </div>
          </div>
          <button
            onClick={() => tutorial.toggleQA()}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="text-gray-400">✕</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск по вопросам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="p-3 border-b border-gray-800 flex flex-wrap gap-2 max-h-[120px] overflow-y-auto">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            !selectedCategory 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          Все ({FULL_QA_LIST.length})
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => {
          const count = categoryCounts[key] || 0;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === key 
                  ? categoryColors[key]
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Q&A List */}
      <div className="flex-1 overflow-y-auto">
        {displayQA.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <span className="text-4xl mb-4 block">🔍</span>
            <p>Ничего не найдено</p>
            <p className="text-sm mt-2">Попробуйте изменить запрос</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {displayQA.map((item: QAItem) => (
              <div 
                key={item.id}
                className="hover:bg-gray-800/50 transition-colors"
              >
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-blue-400 text-lg flex-shrink-0">❓</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium leading-snug">
                        {item.question}
                      </p>
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${categoryColors[item.category] || 'bg-gray-800 text-gray-400'}`}>
                        {categoryLabels[item.category] || item.category}
                      </span>
                    </div>
                    <span className={`text-gray-500 transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>
                
                {expandedId === item.id && (
                  <div className="px-4 pb-4 pl-12">
                    <div className="bg-gray-800/50 rounded-lg p-4 border-l-2 border-blue-500">
                      <div className="flex items-start gap-3">
                        <span className="text-green-400 text-lg flex-shrink-0">💬</span>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 bg-[#1a1a2e]">
        <p className="text-xs text-gray-500 text-center">
          {FULL_QA_LIST.length} вопросов и ответов • Оффлайн база знаний
        </p>
      </div>
    </div>
  );
};
