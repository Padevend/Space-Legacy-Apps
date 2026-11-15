import React from 'react';
import { Equipment } from '@/shared/types';
import { EquipmentCard } from '@/entities/equipment';
import { Sparkles, Layers, BookOpen, ArrowRight } from 'lucide-react';

interface HomePageProps {
  equipments: Equipment[];
  stats: {
    equipmentsCount: number;
    missionsCount: number;
    yearsSpan: number;
    celestialBodiesCount: number;
  };
  onExplore: () => void;
  onSelectEquipment: (equipment: Equipment) => void;
  onReadStory: (slug: string) => void;
  onShowAnimation?: () => void;
}

import { useState } from 'react';

export const HomePage: React.FC<HomePageProps> = ({
  equipments,
  stats,
  onExplore,
  onSelectEquipment,
  onReadStory,
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-16 sm:py-28 px-4 sm:px-6 text-center border-b border-slate-200 dark:border-white/10 transition-colors">
        <div className="max-w-5xl mx-auto">
          <span className="inline-flex items-center gap-2 font-mono text-xs text-nasa-blue dark:text-signal-cyan bg-blue-50 dark:bg-nasa-blue/20 border border-blue-200 dark:border-nasa-blue/40 px-3.5 py-1 rounded-full uppercase tracking-widest mb-6 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-nasa-blue dark:text-signal-cyan" />
            NASA Space Apps Challenge 2026
          </span>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
            Every object has a story.<br />
            <span className="italic font-normal text-nasa-blue dark:text-signal-cyan">
              Every mission leaves a legacy.
            </span>
          </h1>

          <p className="font-sans text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover humanity’s forgotten hardware resting permanently on the Moon and Mars through verified science, archival data, and immersive storytelling.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="bg-nasa-blue hover:bg-nasa-blue/90 text-white font-mono text-sm px-7 py-3.5 rounded-xl font-semibold shadow-glow-blue transition flex items-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Explore Relics Catalogue</span>
            </button>
            <button onClick={() => setShowAnimation(!showAnimation)} className="bg-space-850 hover:bg-space-700 text-white font-mono text-sm px-7 py-3.5 rounded-xl font-semibold shadow-sm transition flex items-center gap-2 cursor-pointer"><span>Aperçu Explorateur</span></button>
            <button
              onClick={() => onReadStory('eagle')}
              className="bg-white dark:bg-space-850 hover:bg-slate-50 dark:hover:bg-space-700 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white font-mono text-sm px-7 py-3.5 rounded-xl font-semibold shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-nasa-blue dark:text-signal-cyan" />
              <span>Read Apollo 11 Story</span>
            </button>
          </div>
        </div>
      </section>

      {/* LEGACY COUNTER SECTION */}
      <section className="bg-slate-100/70 dark:bg-space-900/60 border-b border-slate-200 dark:border-white/10 py-10 px-4 transition-colors">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <div className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-1">
              {stats.equipmentsCount}
            </div>
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
              Documented Relics
            </div>
          </div>
          <div className="p-4">
            <div className="font-display text-3xl sm:text-5xl font-extrabold text-nasa-blue dark:text-signal-cyan mb-1">
              {stats.celestialBodiesCount}
            </div>
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
              Celestial Worlds (Moon & Mars)
            </div>
          </div>
          <div className="p-4">
            <div className="font-display text-3xl sm:text-5xl font-extrabold text-indigo-900 dark:text-sky-200 mb-1">
              {stats.missionsCount}
            </div>
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
              Exploration Programs
            </div>
          </div>
          <div className="p-4">
            <div className="font-display text-3xl sm:text-5xl font-extrabold text-nasa-blue dark:text-signal-cyan mb-1">
              {stats.yearsSpan}+
            </div>
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
              Years of Robotic Presence
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED EQUIPMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="font-mono text-xs text-nasa-blue dark:text-signal-cyan uppercase tracking-widest font-semibold">
              Permanent Extraterrestrial Monuments
            </span>
            <h2 className="font-tech text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              Featured Artifacts
            </h2>
          </div>
          <button
            onClick={onExplore}
            className="font-mono text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition cursor-pointer font-medium"
          >
            <span>View All 5 V1 Equipments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {equipments.slice(0, 3).map((item) => (
            <EquipmentCard
              key={item.equipmentId}
              equipment={item}
              onSelect={onSelectEquipment}
            />
          ))}
        </div>
      </section>

      {/* EDITORIAL FORMATS (4 V1 STORY FORMATS) */}
      <section className="bg-slate-100/70 dark:bg-space-900 border-y border-slate-200 dark:border-white/10 py-16 px-4 sm:px-6 transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-mono text-xs text-nasa-blue dark:text-signal-cyan uppercase tracking-widest font-semibold">
              Educational Storytelling Formats
            </span>
            <h2 className="font-tech text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              Four Ways to Discover the Relics
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-space-850 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
              <span className="font-mono text-xs text-nasa-blue dark:text-signal-cyan font-bold block mb-2">01</span>
              <h3 className="font-tech font-bold text-slate-900 dark:text-white text-base mb-2">LEGACY STORIES</h3>
              <p className="font-sans text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Complete first-person journeys from launch to silent resting place (60–180s).
              </p>
            </div>
            <div className="bg-white dark:bg-space-850 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
              <span className="font-mono text-xs text-nasa-blue dark:text-signal-cyan font-bold block mb-2">02</span>
              <h3 className="font-tech font-bold text-slate-900 dark:text-white text-base mb-2">BEHIND THE TECH</h3>
              <p className="font-sans text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Plain-language breakdowns of thrusters, solar wings, and scientific sensors.
              </p>
            </div>
            <div className="bg-white dark:bg-space-850 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
              <span className="font-mono text-xs text-nasa-blue dark:text-signal-cyan font-bold block mb-2">03</span>
              <h3 className="font-tech font-bold text-slate-900 dark:text-white text-base mb-2">THE FINAL CHAPTER</h3>
              <p className="font-sans text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Documenting the last known communications, power loss, and current physical condition.
              </p>
            </div>
            <div className="bg-white dark:bg-space-850 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
              <span className="font-mono text-xs text-nasa-blue dark:text-signal-cyan font-bold block mb-2">04</span>
              <h3 className="font-tech font-bold text-slate-900 dark:text-white text-base mb-2">SPACE FACTS</h3>
              <p className="font-sans text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Bite-sized, surprising verified records that change how you see space history.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
