interface CampaignCardProps {
  title: string;
  river: string;
  years: string;
  description: string;
  color: string;
  gradient: string;
  icon: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function CampaignCard({ 
  title, river, years, description, color, gradient, icon, isSelected, onClick 
}: CampaignCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`campaign-card relative overflow-hidden rounded-xl p-6 cursor-pointer border-2 transition-all ${
        isSelected 
          ? `border-[${color}] ring-2 ring-[${color}]/50` 
          : 'border-white/10 hover:border-white/30'
      }`}
      style={{ 
        background: gradient,
        borderColor: isSelected ? color : undefined 
      }}
    >
      <div className="absolute top-4 right-4 text-4xl opacity-30">{icon}</div>
      
      <div className="relative z-10">
        <div className="text-xs uppercase tracking-wider opacity-70 mb-1">{river}</div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <div className="text-sm opacity-80 mb-3">{years}</div>
        <p className="text-sm opacity-60 leading-relaxed">{description}</p>
      </div>
      
      <div 
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
}