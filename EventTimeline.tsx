import { useState, useEffect } from 'react';

interface Event {
  id: number;
  date: string;
  title: string;
  description: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  image?: string;
}

const initialEvents: Event[] = [
  {
    id: 1,
    date: 'МАЙ 2021',
    title: 'Второе заполнение GERD',
    description: 'Эфиопия начинает второе заполнение водохранилища (+13.5 млрд м³)',
    type: 'warning'
  },
  {
    id: 2,
    date: 'ИЮН 2021',
    title: 'Египет созывает Совбез ООН',
    description: 'Каир требует остановить заполнение, угрожает «всеми средствами»',
    type: 'critical'
  },
  {
    id: 3,
    date: 'АВГ 2021',
    title: 'Тигрейские силы отступают',
    description: 'Эфиопская армия берёт под контроль ключевые районы Тиграя',
    type: 'info'
  },
  {
    id: 4,
    date: 'СЕН 2021',
    title: 'Засуха в Афаре',
    description: 'Водный стресс в регионе достиг 89%. Гуманитарная катастрофа',
    type: 'critical'
  },
  {
    id: 5,
    date: 'ОКТ 2021',
    title: 'Соглашение с Суданом',
    description: 'Подписан протокол об обмене гидрологическими данными',
    type: 'success'
  },
];

export default function EventTimeline() {
  const [events, setEvents] = useState(initialEvents);
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvents: Event[] = [
        {
          id: Date.now(),
          date: 'НОВОЕ',
          title: 'Срочное сообщение',
          description: ['Уровень напряжения в Оромии достиг критического', 'Международное давление возросло на 5 пунктов', 'Египет приостановил переговоры'][Math.floor(Math.random() * 3)],
          type: ['critical', 'warning', 'info'][Math.floor(Math.random() * 3)] as Event['type']
        },
        ...events.slice(0, 4)
      ];
      setEvents(newEvents);
    }, 15000);
    return () => clearInterval(interval);
  }, [events]);

  const typeColors = {
    critical: 'border-[#D94F3B] bg-[#D94F3B]/10',
    warning: 'border-[#FFB74D] bg-[#FFB74D]/10',
    info: 'border-[#3B82F6] bg-[#3B82F6]/10',
    success: 'border-green-500 bg-green-500/10'
  };

  const typeIcons = {
    critical: '🔴',
    warning: '🟡',
    info: '🔵',
    success: '🟢'
  };

  return (
    <div className="fixed bottom-0 left-[420px] right-[400px] h-[180px] paper-texture border-t border-white/10 z-30">
      <div className="h-full overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 p-4 h-full">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
              className={`flex-shrink-0 w-[280px] h-[140px] rounded-lg border-2 p-4 cursor-pointer transition-all ${typeColors[event.type]} ${
                event.type === 'critical' ? 'animate-pulse-red' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0F1117]/60">{event.date}</span>
                <span>{typeIcons[event.type]}</span>
              </div>
              <h4 className="font-bold text-[#0F1117] text-sm mb-2 line-clamp-2">{event.title}</h4>
              <p className="text-xs text-[#0F1117]/70 line-clamp-3">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Event overlay for critical events */}
      {expandedEvent && events.find(e => e.id === expandedEvent)?.type === 'critical' && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setExpandedEvent(null)}
        >
          <div className="bg-[#0F1117] border-2 border-[#D94F3B] rounded-xl p-8 max-w-lg animate-pulse-red">
            <div className="text-6xl text-center mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-[#D94F3B] text-center mb-4">
              {events.find(e => e.id === expandedEvent)?.title}
            </h2>
            <p className="text-[#E8E7E4]/80 text-center">
              {events.find(e => e.id === expandedEvent)?.description}
            </p>
            <button className="mt-6 w-full py-3 bg-[#D94F3B] text-white rounded-lg font-bold hover:bg-[#c94535]">
              Принять меры
            </button>
          </div>
        </div>
      )}
    </div>
  );
}