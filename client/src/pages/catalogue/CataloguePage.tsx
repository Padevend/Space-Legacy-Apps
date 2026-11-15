import React, { useState, useMemo } from 'react';
import { Equipment } from '@/shared/types';
import { EquipmentCard } from '@/entities/equipment';
import { Search, Filter, RefreshCw } from 'lucide-react';

interface CataloguePageProps {
  equipments: Equipment[];
  onSelectEquipment: (equipment: Equipment) => void;
}

export const CataloguePage: React.FC<CataloguePageProps> = ({
  equipments,
  onSelectEquipment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBody, setSelectedBody] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredEquipments = useMemo(() => {
    return equipments.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      const matchText =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.missions?.some((m) => m.mission.name.toLowerCase().includes(query));

      const matchBody =
        selectedBody === 'ALL' || item.celestialBodyName?.toUpperCase() === selectedBody;

      const matchType = selectedType === 'ALL' || item.equipmentType === selectedType;

      return matchText && matchBody && matchType;
    });
  }, [equipments, searchQuery, selectedBody, selectedType]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBody('ALL');
    setSelectedType('ALL');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2 font-mono text-xs text-nasa-blue dark:text-signal-cyan uppercase tracking-widest font-semibold">
          <Filter className="w-3.5 h-3.5" />
          <span>Extraterrestrial Artifact Directory</span>
        </div>
        <h1 className="font-tech text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
          Explore Discarded Space Equipment
        </h1>
        <p className="font-sans text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
          Browse the catalog of rovers, landers, descent stages, and scientific instruments resting permanently on the Moon and Mars.
        </p>
      </div>

      <div className="bg-white dark:bg-space-850 border border-slate-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 mb-8 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center transition-colors">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by equipment, mission, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-space-950 border border-slate-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-nasa-blue font-sans transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 font-mono text-xs">
            {['ALL', 'MOON', 'MARS'].map((body) => (
              <button
                key={body}
                onClick={() => setSelectedBody(body)}
                className={`px-3 py-1.5 rounded-lg border transition font-medium cursor-pointer ${
                  selectedBody === body
                    ? 'bg-nasa-blue text-white border-nasa-blue font-bold shadow-glow-blue'
                    : 'bg-slate-100 dark:bg-space-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5'
                }`}
              >
                {body}
              </button>
            ))}
          </div>

          {(searchQuery || selectedBody !== 'ALL' || selectedType !== 'ALL') && (
            <button
              onClick={resetFilters}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition flex items-center gap-1 text-xs font-mono cursor-pointer"
              title="Reset filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 text-xs font-mono text-slate-500 dark:text-slate-400 px-1">
        <span>Showing {filteredEquipments.length} of {equipments.length} documented relics</span>
        <span className="text-nasa-blue dark:text-signal-cyan font-medium">Data source: NASA Primary Archives</span>
      </div>

      {filteredEquipments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipments.map((equipment) => (
            <EquipmentCard
              key={equipment.equipmentId}
              equipment={equipment}
              onSelect={onSelectEquipment}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-space-850 border border-slate-200 dark:border-white/10 rounded-2xl p-12 text-center shadow-sm">
          <p className="font-mono text-sm text-slate-600 dark:text-slate-300 mb-4">
            No equipment matches your current search criteria.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-nasa-blue text-white rounded-xl font-mono text-xs hover:bg-nasa-blue/80 transition cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
