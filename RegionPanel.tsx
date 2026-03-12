import { useState } from 'react';

interface Region {
  name: string;
  waterStress: number;
  socialTension: number;
  trust: number;
  militias: number;
}

const regions: Region[] = [
  { name: 'Amhara', waterStress: 45, socialTension: 72, trust: 58, militias: 3 },
  { name: 'Tigray', waterStress: 78, socialTension: 92, trust: 12, militias: 8 },
  { name: 'Oromia', waterStress: 52, socialTension: 68, trust: 45, militias: 5 },
  { name: 'Afar', waterStress: 89, socialTension: 55, trust: 67, militias: 1 },
  { name: 'Somali Region', waterStress: 95, socialTension: 48, trust: 72, militias: 2 },
  { name: 'Benishangul-Gumuz', waterStress: 35, socialTension: 82, trust: 38, militias: 4 },
  { name: 'Gambela', waterStress: 28, socialTension: 45, trust: 78, militias: 1 },
  { name: 'SNNPR', waterStress: 42, socialTension: 38, trust: 82, militias: 0 },
  { name: 'Harari', waterStress: 67, socialTension: 32, trust: 75, militias: 0 },
  { name: 'Addis Ababa', waterStress: 55, socialTension: 25, trust: 88, militias: 0 },
  { name: 'Dire Dawa', waterStress: 72, socialTension: 35, trust: 70, militias: 1 },
];

export default function RegionPanel() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div 
      className={`fixed left-0 top-[90px] bottom-0 bg-[#0F1117]/95 backdrop-blur-sm border-r border-white/10 transition-all duration-300 z-40 overflow-hidden ${
        isOpen ? 'w-[420px]' : 'w-[48px]'
      }`}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-0 top-4 w-8 h-8 bg-[#3B82F6]/20 rounded-l flex items-center justify-center text-[#3B82F6] hover:bg-[#3B82F6]/30"
      >
        {isOpen ? '◀' : '▶'}
      </button>
      
      {isOpen && (
        <div className="p-4 overflow-y-auto h-full pb-20">
          <h2 className="text-lg font-bold text-[#E8E7E4] mb-4">Регионы Эфиопии</h2>
          
          <div className="space-y-3">
            {regions.map((region) => (
              <div 
                key={region.name}
                className={`bg-[#1a1d26] rounded-lg p-4 border transition-all ${
                  region.socialTension > 85 
                    ? 'border-[#D94F3B] animate-pulse-red' 
                    : 'border-white/5 hover:border-[#FFB74D]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm">{region.name}</h3>
                  {region.socialTension > 85 && (
                    <span className="text-xs bg-[#D94F3B] px-2 py-0.5 rounded">CRITICAL</span>
                  )}
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  <Indicator 
                    icon="💧" 
                    value={region.waterStress} 
                    label="Water"
                    color={region.waterStress > 70 ? '#D94F3B' : region.waterStress > 50 ? '#FFB74D' : '#3B82F6'}
                  />
                  <Indicator 
                    icon="🔥" 
                    value={region.socialTension} 
                    label="Tension"
                    color={region.socialTension > 70 ? '#D94F3B' : region.socialTension > 50 ? '#FFB74D' : '#22c55e'}
                  />
                  <Indicator 
                    icon="❤️" 
                    value={region.trust} 
                    label="Trust"
                    color={region.trust < 30 ? '#D94F3B' : region.trust < 60 ? '#FFB74D' : '#22c55e'}
                  />
                  <Indicator 
                    icon="🔫" 
                    value={region.militias} 
                    label="Militias"
                    color={region.militias > 3 ? '#D94F3B' : region.militias > 0 ? '#FFB74D' : '#22c55e'}
                    isCount
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Indicator({ 
  icon, value, label, color, isCount 
}: { 
  icon: string; 
  value: number; 
  label: string; 
  color: string;
  isCount?: boolean;
}) {
  return (
    <div className="text-center">
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-sm font-bold" style={{ color }}>
        {isCount ? value : `${value}%`}
      </div>
      <div className="text-[9px] text-[#E8E7E4]/40 uppercase">{label}</div>
    </div>
  );
}