import { useState, useEffect } from 'react';

export default function Header() {
  const [year, setYear] = useState(2021);
  const [month, setMonth] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setMonth(prev => {
        if (prev >= 12) {
          setYear(y => Math.min(y + 1, 2050));
          return 1;
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  return (
    <header className="fixed top-0 left-0 right-0 h-[90px] bg-[#0F1117]/95 backdrop-blur-sm z-50 flex items-center justify-between px-8 border-b border-white/10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-8 bg-gradient-to-b from-green-500 via-yellow-400 to-red-500 rounded-sm"></div>
        <span className="text-sm text-[#E8E7E4]/80">Federal Democratic Republic of Ethiopia</span>
      </div>
      
      <div className="text-center">
        <span className="text-6xl font-extralight tracking-wider text-[#E8E7E4]">
          {months[month - 1]} {year}
        </span>
      </div>
      
      <div className="flex items-center gap-6">
        {/* GERD Fill Level */}
        <div className="relative w-[120px] h-[120px]">
          <svg className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#1f2937" strokeWidth="8" />
            <circle 
              cx="60" cy="60" r="50" fill="none" 
              stroke="url(#gradient)" strokeWidth="8"
              strokeDasharray={`${62 * Math.PI} ${100 * Math.PI}`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D94F3B" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-[#3B82F6]">62%</span>
            <span className="text-[10px] text-[#E8E7E4]/60">GERD</span>
          </div>
        </div>
        
        {/* Water Release */}
        <div className="text-center">
          <div className="text-2xl font-bold text-[#3B82F6]">18.4</div>
          <div className="text-[10px] text-[#E8E7E4]/60">млрд м³/год</div>
        </div>
        
        {/* Budget */}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">$42.3bn</div>
          <div className="text-[10px] text-[#E8E7E4]/60">Budget</div>
        </div>
        
        {/* International Pressure */}
        <div className="w-24">
          <div className="flex justify-between text-[10px] text-[#E8E7E4]/60 mb-1">
            <span>Pressure</span>
            <span className="text-[#D94F3B]">73</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-500 to-[#D94F3B] rounded-full" style={{ width: '73%' }}></div>
          </div>
        </div>
      </div>
    </header>
  );
}