import React from 'react';
import { Equipment } from '@/shared/types';
import { Badge } from '@/shared/ui';
import { ArrowRight, MapPin, Rocket } from 'lucide-react';

interface EquipmentCardProps {
  equipment: Equipment;
  onSelect: (equipment: Equipment) => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onSelect }) => {
  return (
    <article
      onClick={() => onSelect(equipment)}
      className="group relative bg-white dark:bg-space-850 border border-slate-200 dark:border-white/10 hover:border-nasa-blue/80 dark:hover:border-nasa-blue/80 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-glow-blue flex flex-col justify-between cursor-pointer"
    >
      <div>
        <div className="relative aspect-[16/10] bg-slate-100 dark:bg-space-950 overflow-hidden">
          <img
            src={equipment.mainImageUrl || 'https://images.nasa.gov/images/placeholder.jpg'}
            alt={equipment.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge variant="provenance" status="NASA_ARCHIVE" />
          </div>
          <div className="absolute top-3 right-3">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/90 dark:bg-space-950/80 backdrop-blur border border-slate-200 dark:border-white/20 text-slate-800 dark:text-white font-medium flex items-center gap-1 shadow-sm">
              <MapPin className="w-3 h-3 text-nasa-blue dark:text-signal-cyan" />
              {equipment.celestialBodyName}
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-2 font-mono text-xs text-slate-500 dark:text-slate-400">
            <Rocket className="w-3.5 h-3.5 text-nasa-blue dark:text-signal-cyan" />
            <span>{equipment.missions?.[0]?.mission.name || 'NASA Mission'}</span>
            <span>•</span>
            <span className="text-nasa-blue dark:text-signal-cyan font-medium">{equipment.equipmentType}</span>
          </div>

          <h3 className="font-tech text-xl font-bold text-slate-900 dark:text-white group-hover:text-nasa-blue dark:group-hover:text-signal-cyan transition-colors mb-2 line-clamp-1">
            {equipment.name}
          </h3>

          <p className="font-sans text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
            {equipment.hook || equipment.description}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="physical" status={equipment.physicalStatus} />
          <Badge variant="operational" status={equipment.operationalStatus} />
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 group-hover:text-nasa-blue dark:group-hover:text-white flex items-center gap-1 transition-colors font-medium">
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
};
