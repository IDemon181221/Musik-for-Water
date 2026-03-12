import { useIndiaGame, IndiaRegion } from '../../contexts/IndiaGameContext';

function RegionCard({ region, isSelected, onClick }: { 
  region: IndiaRegion; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const isCritical = region.waterStress > 85 || region.socialTension > 80;
  
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'bg-[#FFB74D]/20 border-2 border-[#FFB74D]' 
          : isCritical
            ? 'bg-red-900/30 border border-red-800 hover:bg-red-900/40'
            : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800/70'
      } ${isCritical ? 'animate-pulse' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-sm">{region.nameRu}</h3>
          <p className="text-xs text-gray-500">{region.name}</p>
        </div>
        {region.militias > 0 && (
          <span className="px-2 py-0.5 bg-red-600 rounded text-xs">
            {region.militias} ⚔️
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-xs">
        {/* Water stress */}
        <div className="text-center">
          <div className="text-blue-400 mb-1">💧</div>
          <div className={`font-bold ${region.waterStress > 85 ? 'text-red-400' : region.waterStress > 70 ? 'text-yellow-400' : 'text-green-400'}`}>
            {Math.round(region.waterStress)}%
          </div>
        </div>
        
        {/* Social tension */}
        <div className="text-center">
          <div className="text-orange-400 mb-1">🔥</div>
          <div className={`font-bold ${region.socialTension > 80 ? 'text-red-400' : region.socialTension > 60 ? 'text-yellow-400' : 'text-green-400'}`}>
            {Math.round(region.socialTension)}%
          </div>
        </div>
        
        {/* Trust */}
        <div className="text-center">
          <div className="text-pink-400 mb-1">❤️</div>
          <div className={`font-bold ${region.trustInGovernment < 40 ? 'text-red-400' : region.trustInGovernment < 60 ? 'text-yellow-400' : 'text-green-400'}`}>
            {Math.round(region.trustInGovernment)}%
          </div>
        </div>
        
        {/* Population */}
        <div className="text-center">
          <div className="text-gray-400 mb-1">👥</div>
          <div className="font-bold text-gray-300">
            {region.population}M
          </div>
        </div>
      </div>
      
      {isSelected && (
        <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
          <p>{region.description}</p>
          <div className="flex gap-2 mt-1">
            <span className="px-1 py-0.5 bg-gray-700 rounded">{region.terrain}</span>
            {region.isCoastal && <span className="px-1 py-0.5 bg-blue-900 rounded">🌊 Побережье</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export function IndiaRegionsPanel() {
  const { state, selectRegion } = useIndiaGame();
  
  // Sort regions by water stress (most critical first)
  const sortedRegions = [...state.regions].sort((a, b) => b.waterStress - a.waterStress);
  
  // Average stats
  const avgWaterStress = state.regions.reduce((sum, r) => sum + r.waterStress, 0) / state.regions.length;
  const avgTension = state.regions.reduce((sum, r) => sum + r.socialTension, 0) / state.regions.length;
  const totalMilitias = state.regions.reduce((sum, r) => sum + r.militias, 0);
  
  return (
    <div className="w-[420px] bg-[#0F1117]/90 border-r border-gray-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold mb-3">Регионы Индии</h2>
        
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-800/50 p-2 rounded">
            <div className="text-xs text-gray-500">Ср. стресс</div>
            <div className={`text-lg font-bold ${avgWaterStress > 80 ? 'text-red-400' : 'text-yellow-400'}`}>
              {Math.round(avgWaterStress)}%
            </div>
          </div>
          <div className="bg-gray-800/50 p-2 rounded">
            <div className="text-xs text-gray-500">Ср. напряжение</div>
            <div className={`text-lg font-bold ${avgTension > 70 ? 'text-red-400' : 'text-yellow-400'}`}>
              {Math.round(avgTension)}%
            </div>
          </div>
          <div className="bg-gray-800/50 p-2 rounded">
            <div className="text-xs text-gray-500">Ополчения</div>
            <div className={`text-lg font-bold ${totalMilitias > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {totalMilitias}
            </div>
          </div>
        </div>
      </div>
      
      {/* Region list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sortedRegions.map(region => (
          <RegionCard
            key={region.id}
            region={region}
            isSelected={state.selectedRegion === region.id}
            onClick={() => selectRegion(state.selectedRegion === region.id ? null : region.id)}
          />
        ))}
      </div>
    </div>
  );
}
