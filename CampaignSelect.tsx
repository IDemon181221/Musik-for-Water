import CampaignCard from './CampaignCard';

interface CampaignSelectProps {
  onSelect: (campaign: string) => void;
}

const campaigns = [
  {
    id: 'nile',
    title: 'Нил — Эфиопия',
    river: 'Нил',
    years: '2021–2040',
    description: 'Управляй GERD — крупнейшей плотиной Африки. Балансируй между энергетической безопасностью и угрозами Египта.',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0f1117 100%)',
    icon: '🏛️'
  },
  {
    id: 'indus',
    title: 'Инд — Индия',
    river: 'Инд',
    years: '2025–2045',
    description: 'Ядерные соседи. Каждое решение о воде может привести к апокалипсису. Часы судного дня тикают.',
    color: '#D94F3B',
    gradient: 'linear-gradient(135deg, #5c2018 0%, #0f1117 100%)',
    icon: '☢️'
  },
  {
    id: 'mekong',
    title: 'Меконг — Китай/Лаос',
    river: 'Меконг',
    years: '2024–2040',
    description: '11 плотин Китая контролируют жизнь 60 миллионов людей ниже по течению. Рыба вымирает.',
    color: '#2D6A4F',
    gradient: 'linear-gradient(135deg, #1a3d2e 0%, #0f1117 100%)',
    icon: '🐟'
  },
  {
    id: 'aral',
    title: 'Аральское море',
    river: 'Сырдарья / Амударья',
    years: '1991–2035',
    description: 'Спаси то, что ещё можно спасти. Или наблюдай, как море превращается в пустыню навсегда.',
    color: '#9CA3AF',
    gradient: 'linear-gradient(135deg, #3d3d3d 0%, #0f1117 100%)',
    icon: '🚢'
  },
  {
    id: 'tigris',
    title: 'Тигр и Евфрат — Турция',
    river: 'Тигр / Евфрат',
    years: '2023–2045',
    description: 'Проект GAP: 22 плотины, которые высушат Ирак и Сирию. Твой выбор — процветание или война.',
    color: '#FFB74D',
    gradient: 'linear-gradient(135deg, #5c4a1e 0%, #0f1117 100%)',
    icon: '🕌'
  },
  {
    id: 'colorado',
    title: 'Колорадо — США/Мексика',
    river: 'Колорадо',
    years: '2026–2050',
    description: 'Лас-Вегас или фермеры? Калифорния или Аризона? Верховный суд решит. Но река уже мертва.',
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #4a1a1a 0%, #0f1117 100%)',
    icon: '🏜️'
  },
  {
    id: 'un',
    title: 'Blue Helmets — ООН',
    river: 'Все бассейны мира',
    years: '2025–2050',
    description: 'Нет армии. Нет жёстких мер. Только дипломатия и мольбы. Сможешь ли ты предотвратить водные войны?',
    color: '#60A5FA',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0f1117 100%)',
    icon: '🪖'
  }
];

const difficulties = [
  { id: 'nobel', name: 'Nobel Peace Prize', color: '#22c55e', description: 'Для тех, кто хочет понять механики' },
  { id: 'realistic', name: 'Realistic', color: '#3B82F6', description: 'Рекомендуемая сложность' },
  { id: 'hard', name: 'Hard', color: '#FFB74D', description: 'Исторически точные условия' },
  { id: 'brutal', name: 'Brutal', color: '#f97316', description: 'Каждое решение на счету' },
  { id: 'nightmare', name: 'Nightmare', color: '#D94F3B', description: 'Почти невозможно' },
  { id: 'hell', name: 'Hell on Earth', color: '#7f1d1d', description: 'Худший сценарий + все чёрные лебеди' },
  { id: 'custom', name: 'Custom', color: '#9CA3AF', description: 'Настрой сам' }
];

export default function CampaignSelect({ onSelect }: CampaignSelectProps) {
  return (
    <div className="min-h-screen bg-[#0F1117] p-8">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-extralight tracking-wider text-[#E8E7E4] mb-4">
          ТОЧКА КИПЕНИЯ
        </h1>
        <p className="text-lg text-[#E8E7E4]/60">
          Вода закончится. Вопрос — кто выживет.
        </p>
      </div>

      {/* Campaigns */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-[#E8E7E4] mb-6">Выберите кампанию</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {campaigns.map(campaign => (
            <CampaignCard
              key={campaign.id}
              {...campaign}
              onClick={() => onSelect(campaign.id)}
            />
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[#E8E7E4] mb-6">Уровень сложности</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {difficulties.map(diff => (
            <button
              key={diff.id}
              className="p-4 rounded-lg border border-white/10 hover:border-opacity-50 transition-all text-center group"
              style={{ borderColor: `${diff.color}40` }}
            >
              <div 
                className="w-3 h-3 rounded-full mx-auto mb-2"
                style={{ backgroundColor: diff.color }}
              />
              <div className="text-sm font-medium text-[#E8E7E4] mb-1">{diff.name}</div>
              <div className="text-xs text-[#E8E7E4]/40 group-hover:text-[#E8E7E4]/60">{diff.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty parameters info */}
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-lg font-bold text-[#E8E7E4] mb-4">Параметры сложности</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-[#E8E7E4]/60">Стартовый долг</div>
            <div className="text-[#E8E7E4]">0–130% ВВП</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🌡️</div>
            <div className="text-[#E8E7E4]/60">Климат</div>
            <div className="text-[#E8E7E4]">SSP1 → SSP5</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🤝</div>
            <div className="text-[#E8E7E4]/60">Доверие соседей</div>
            <div className="text-[#E8E7E4]">+30 → −80</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">⚔️</div>
            <div className="text-[#E8E7E4]/60">Внутренние войны</div>
            <div className="text-[#E8E7E4]">Нет → Да</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📈</div>
            <div className="text-[#E8E7E4]/60">Рост спроса</div>
            <div className="text-[#E8E7E4]">×0.5 → ×2.0</div>
          </div>
        </div>
      </div>
    </div>
  );
}