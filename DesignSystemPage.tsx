interface DesignSystemPageProps {
  onBack: () => void;
}

export default function DesignSystemPage({ onBack }: DesignSystemPageProps) {
  return (
    <div className="min-h-screen bg-[#0F1117] p-8">
      <button 
        onClick={onBack}
        className="mb-8 px-4 py-2 border border-white/20 text-[#E8E7E4]/60 rounded hover:border-white/40 hover:text-[#E8E7E4]"
      >
        ← Назад к игре
      </button>
      
      <h1 className="text-4xl font-extralight text-[#E8E7E4] mb-12 text-center">
        ДИЗАЙН-СИСТЕМА «ТОЧКА КИПЕНИЯ»
      </h1>

      {/* Color Palette */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[#E8E7E4] mb-6">Цветовая палитра</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { name: 'Фон карты', hex: '#0F1117', desc: 'Почти чёрный' },
            { name: 'Основной текст', hex: '#E8E7E4', desc: 'Тёплый белый' },
            { name: 'Акцент / Критич.', hex: '#D94F3B', desc: 'Ржаво-красный' },
            { name: 'Вода / Успех', hex: '#3B82F6', desc: 'Прозрачный синий' },
            { name: 'Выделение', hex: '#FFB74D', desc: 'Тёплое золото' },
            { name: 'Бумага', hex: '#F5E6D3', desc: 'Документы' },
            { name: 'Меконг', hex: '#2D6A4F', desc: 'Влажный зелёный' },
          ].map(color => (
            <div key={color.hex} className="text-center">
              <div 
                className="w-full h-24 rounded-lg mb-3 border border-white/10"
                style={{ backgroundColor: color.hex }}
              />
              <div className="text-sm font-bold text-[#E8E7E4]">{color.name}</div>
              <div className="text-xs text-[#E8E7E4]/60 font-mono">{color.hex}</div>
              <div className="text-xs text-[#E8E7E4]/40">{color.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[#E8E7E4] mb-6">Типографика</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#FFB74D] mb-4">Заголовки — PP Mori</h3>
            <div className="space-y-4">
              <div className="text-6xl font-extralight">Extralight 72pt</div>
              <div className="text-4xl font-semibold">SemiBold 36pt</div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#FFB74D] mb-4">Основной — Inter</h3>
            <div className="space-y-4">
              <div className="text-xl font-normal">Regular 400 — основной текст</div>
              <div className="text-xl font-medium">Medium 500 — акценты</div>
              <div className="text-xl font-bold">Bold 700 — заголовки секций</div>
            </div>
          </div>
        </div>
      </section>

      {/* UI Components */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[#E8E7E4] mb-6">UI Компоненты</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Region Card */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#FFB74D] mb-4">Карточка региона</h3>
            <div className="bg-[#1a1d26] rounded-lg p-4 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm">Tigray</h4>
                <span className="text-xs bg-[#D94F3B] px-2 py-0.5 rounded">CRITICAL</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-lg">💧</div>
                  <div className="text-sm font-bold text-[#D94F3B]">78%</div>
                  <div className="text-[9px] text-[#E8E7E4]/40">WATER</div>
                </div>
                <div>
                  <div className="text-lg">🔥</div>
                  <div className="text-sm font-bold text-[#D94F3B]">92%</div>
                  <div className="text-[9px] text-[#E8E7E4]/40">TENSION</div>
                </div>
                <div>
                  <div className="text-lg">❤️</div>
                  <div className="text-sm font-bold text-[#D94F3B]">12%</div>
                  <div className="text-[9px] text-[#E8E7E4]/40">TRUST</div>
                </div>
                <div>
                  <div className="text-lg">🔫</div>
                  <div className="text-sm font-bold text-[#D94F3B]">8</div>
                  <div className="text-[9px] text-[#E8E7E4]/40">MILITIAS</div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-[#E8E7E4]/40">
              380×120 px • Пульсация при tension &gt;85%
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#FFB74D] mb-4">Индикаторы</h3>
            <div className="space-y-4">
              {/* Circular */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#1f2937" strokeWidth="4" />
                    <circle 
                      cx="32" cy="32" r="28" fill="none" 
                      stroke="#3B82F6" strokeWidth="4"
                      strokeDasharray={`${62 * Math.PI / 100 * 176} ${100 * Math.PI}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#3B82F6]">62%</div>
                </div>
                <div className="text-sm text-[#E8E7E4]/60">Круговой прогресс (GERD)</div>
              </div>
              
              {/* Linear */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#E8E7E4]/60">Pressure</span>
                  <span className="text-[#D94F3B]">73</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-500 to-[#D94F3B] rounded-full w-[73%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#FFB74D] mb-4">Кнопки</h3>
            <div className="space-y-3">
              <button className="w-full py-3 bg-[#3B82F6] text-white rounded-lg font-bold">
                Primary (Blue)
              </button>
              <button className="w-full py-3 bg-[#D94F3B] text-white rounded-lg font-bold">
                Danger (Red)
              </button>
              <button className="w-full py-3 border border-white/30 text-[#E8E7E4]/60 rounded-lg">
                Secondary (Ghost)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Initiative Cards */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[#E8E7E4] mb-6">Карточки инициатив (360×180 px)</h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {[
            { cat: 'Гражданские', color: '#3B82F6', border: 'blue' },
            { cat: 'Дипломатические', color: '#FFB74D', border: 'gold' },
            { cat: 'Военные', color: '#D94F3B', border: 'red' },
          ].map(type => (
            <div 
              key={type.cat}
              className="flex-shrink-0 w-[360px] h-[180px] rounded-lg border-2 p-4"
              style={{ borderColor: type.color, backgroundColor: `${type.color}11` }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-bold text-[#E8E7E4]">{type.cat}</h4>
                <span className="text-2xl">{type.cat === 'Гражданские' ? '💧' : type.cat === 'Дипломатические' ? '🤝' : '⚔️'}</span>
              </div>
              <div className="flex gap-4 mb-3 text-xs">
                <div className="bg-black/30 rounded px-2 py-1">
                  <span className="text-green-400 font-medium">$180M</span>
                </div>
                <div className="bg-black/30 rounded px-2 py-1">
                  <span className="text-[#3B82F6] font-medium">18 мес.</span>
                </div>
              </div>
              <div className="text-xs text-[#E8E7E4]/80 mb-2">
                <span className="text-green-400">✓</span> Положительный эффект
              </div>
              <div className="text-xs text-[#D94F3B]/80">
                <span className="text-[#D94F3B]">⚠</span> Скрытые последствия
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Difficulty Levels */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[#E8E7E4] mb-6">Уровни сложности</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-3 text-[#E8E7E4]/60">Сложность</th>
                <th className="p-3 text-[#E8E7E4]/60">Долг</th>
                <th className="p-3 text-[#E8E7E4]/60">Климат</th>
                <th className="p-3 text-[#E8E7E4]/60">Доверие</th>
                <th className="p-3 text-[#E8E7E4]/60">Войны</th>
                <th className="p-3 text-[#E8E7E4]/60">Рост спроса</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Nobel Peace Prize', color: '#22c55e', debt: '0%', climate: 'SSP1-2.6', trust: '+30', wars: 'Нет', growth: '×0.5' },
                { name: 'Realistic', color: '#3B82F6', debt: '45%', climate: 'SSP2-4.5', trust: '+10', wars: 'Возможны', growth: '×1.0' },
                { name: 'Hard', color: '#FFB74D', debt: '70%', climate: 'SSP3-7.0', trust: '−20', wars: 'Да', growth: '×1.3' },
                { name: 'Brutal', color: '#f97316', debt: '95%', climate: 'SSP4-6.0', trust: '−50', wars: 'Да', growth: '×1.6' },
                { name: 'Nightmare', color: '#D94F3B', debt: '115%', climate: 'SSP5-8.5', trust: '−70', wars: 'Да', growth: '×1.8' },
                { name: 'Hell on Earth', color: '#7f1d1d', debt: '130%', climate: 'SSP5-8.5+', trust: '−80', wars: 'Все', growth: '×2.0' },
              ].map(diff => (
                <tr key={diff.name} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3 font-medium" style={{ color: diff.color }}>{diff.name}</td>
                  <td className="p-3 text-center">{diff.debt}</td>
                  <td className="p-3 text-center">{diff.climate}</td>
                  <td className="p-3 text-center">{diff.trust}</td>
                  <td className="p-3 text-center">{diff.wars}</td>
                  <td className="p-3 text-center">{diff.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sound Design */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[#E8E7E4] mb-6">Звуковой дизайн</h2>
        <div className="bg-white/5 rounded-xl p-6">
          <p className="text-[#E8E7E4]/80 mb-4">
            Только реальные полевые записи. Никакой синтетики.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: '💧', name: 'Капли воды', desc: 'Интерфейсные действия' },
              { icon: '🏜️', name: 'Ветер в пустыне', desc: 'Засуха, безнадёжность' },
              { icon: '⚡', name: 'Гул турбин', desc: 'Плотины, энергия' },
              { icon: '👥', name: 'Далёкие крики', desc: 'Социальное напряжение' },
            ].map(sound => (
              <div key={sound.name} className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-3xl mb-2">{sound.icon}</div>
                <div className="font-medium text-[#E8E7E4]">{sound.name}</div>
                <div className="text-xs text-[#E8E7E4]/40">{sound.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Over */}
      <section>
        <h2 className="text-2xl font-bold text-[#E8E7E4] mb-6">Экран поражения</h2>
        <div className="bg-black rounded-xl p-12 text-center border border-white/10">
          <div className="text-[#E8E7E4]/40 text-sm mb-8">
            Пролёт дрона над высохшей рекой → пустыня → миллионы людей идут по бывшему руслу → камера поднимается вверх
          </div>
          <div className="text-3xl font-light text-[#E8E7E4] mb-4">
            Вода закончилась.
          </div>
          <div className="text-xl font-light text-[#E8E7E4]/60">
            Всё остальное — вопрос времени.
          </div>
        </div>
      </section>
    </div>
  );
}