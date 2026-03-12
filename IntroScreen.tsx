import { useState, useEffect } from 'react';

interface IntroScreenProps {
  onComplete: () => void;
  campaign: string;
}

export default function IntroScreen({ onComplete, campaign }: IntroScreenProps) {
  const [opacity, setOpacity] = useState(0);
  const [yearOpacity, setYearOpacity] = useState(0);
  const [showStart, setShowStart] = useState(false);

  useEffect(() => {
    // Fade in sequence
    setTimeout(() => setOpacity(1), 500);
    setTimeout(() => setYearOpacity(1), 2000);
    setTimeout(() => setShowStart(true), 4000);
  }, []);

  const campaignData: Record<string, { title: string; year: string; image: string; color: string }> = {
    nile: {
      title: 'Grand Ethiopian Renaissance Dam',
      year: 'МАЙ 2021',
      image: 'Инфракрасный снимок GERD: синий — холод, красный — турбины',
      color: '#3B82F6'
    },
    indus: {
      title: 'Indus Waters Treaty',
      year: 'ЯНВАРЬ 2025',
      image: 'Спутниковый снимок кашмирской линии контроля',
      color: '#D94F3B'
    },
    mekong: {
      title: 'Mekong River Commission',
      year: 'МАРТ 2024',
      image: 'Вид с дрона на плотину Сяованьцзы ночью',
      color: '#2D6A4F'
    },
    aral: {
      title: 'Аральское море',
      year: 'ДЕКАБРЬ 1991',
      image: 'Корабль в пустыне. Муйнак, Узбекистан.',
      color: '#9CA3AF'
    },
    tigris: {
      title: 'Güneydoğu Anadolu Projesi',
      year: 'ИЮНЬ 2023',
      image: 'Плотина Ататюрка на рассвете',
      color: '#FFB74D'
    },
    colorado: {
      title: 'Colorado River Compact',
      year: 'АПРЕЛЬ 2026',
      image: 'Озеро Мид. Белые кольца солевых отложений.',
      color: '#EF4444'
    },
    un: {
      title: 'UN Special Envoy for Water',
      year: 'ЯНВАРЬ 2025',
      image: 'Зал Генеральной Ассамблеи. Нью-Йорк.',
      color: '#60A5FA'
    }
  };

  const data = campaignData[campaign] || campaignData.nile;

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      {/* Simulated satellite/infrared image */}
      <div 
        className="absolute inset-0 transition-opacity duration-3000"
        style={{ opacity }}
      >
        {/* Simulated thermal gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${data.color}22 0%, transparent 50%), 
                         radial-gradient(ellipse at 30% 40%, #D94F3B22 0%, transparent 30%),
                         radial-gradient(ellipse at 70% 60%, #3B82F622 0%, transparent 30%),
                         linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%)`
          }}
        />
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Scan lines effect */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
          }}
        />
      </div>
      
      {/* Campaign title */}
      <div 
        className="relative z-10 text-center transition-opacity duration-2000"
        style={{ opacity }}
      >
        <h1 
          className="text-5xl md:text-7xl font-extralight tracking-widest mb-4"
          style={{ color: data.color }}
        >
          {data.title}
        </h1>
        <p className="text-[#E8E7E4]/40 text-sm">{data.image}</p>
      </div>
      
      {/* Year ticker */}
      <div 
        className="absolute top-8 right-8 transition-opacity duration-2000"
        style={{ opacity: yearOpacity }}
      >
        <div className="text-4xl font-light tracking-wider" style={{ color: data.color }}>
          {data.year}
        </div>
      </div>
      
      {/* Start button */}
      {showStart && (
        <button
          onClick={onComplete}
          className="absolute bottom-16 px-12 py-4 border rounded-lg transition-all duration-500 hover:bg-white/5"
          style={{ borderColor: `${data.color}66`, color: data.color }}
        >
          Начать
        </button>
      )}
      
      {/* Corner data elements */}
      <div 
        className="absolute bottom-8 left-8 text-xs text-[#E8E7E4]/30 font-mono transition-opacity duration-2000"
        style={{ opacity: yearOpacity }}
      >
        <div>LAT: 11.2147° N</div>
        <div>LON: 35.0939° E</div>
        <div>ALT: 643m</div>
      </div>
      
      <div 
        className="absolute bottom-8 right-8 text-xs text-[#E8E7E4]/30 font-mono text-right transition-opacity duration-2000"
        style={{ opacity: yearOpacity }}
      >
        <div>IR BAND: 10.8μm</div>
        <div>RESOLUTION: 30m</div>
        <div>SOURCE: SENTINEL-3</div>
      </div>
    </div>
  );
}