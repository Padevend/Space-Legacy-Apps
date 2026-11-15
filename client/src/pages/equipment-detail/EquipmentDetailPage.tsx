import React, { useState, useEffect } from 'react';
import { Equipment, LogbookEntryDto } from '@/shared/types';
import { Badge, Button } from '@/shared/ui';
import { Timeline } from '@/entities/event';
import { api } from '@/shared/api';
import {
  ArrowLeft,
  Rocket,
  MapPin,
  Gauge,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Radio,
  Award,
  Video,
} from 'lucide-react';

interface EquipmentDetailPageProps {
  equipment: Equipment;
  onBack: () => void;
  onReadStory: (slug: string) => void;
  onPlayQuiz?: (slug: string) => void;
}

export const EquipmentDetailPage: React.FC<EquipmentDetailPageProps> = ({
  equipment,
  onBack,
  onReadStory,
  onPlayQuiz,
}) => {
  const [logbookEntries, setLogbookEntries] = useState<LogbookEntryDto[]>([]);
  const [, setLoadingLogbook] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchLogbook = async () => {
      setLoadingLogbook(true);
      try {
        const res = await api.getMachineLogbook(equipment.slug);
        if (active && res?.entries) {
          setLogbookEntries(res.entries);
        }
      } catch {
        // Logbook may be empty for some machines
      } finally {
        if (active) setLoadingLogbook(false);
      }
    };

    void fetchLogbook();
    return () => {
      active = false;
    };
  }, [equipment.slug]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue</span>
        </button>
        <span className="font-mono text-xs text-nasa-blue dark:text-signal-cyan font-semibold">
          SLUG : {equipment.slug}
        </span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white dark:bg-space-850 border border-slate-200 dark:border-white/15 rounded-3xl overflow-hidden mb-10 shadow-lg dark:shadow-2xl transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-5 relative aspect-square sm:aspect-video lg:aspect-auto bg-slate-100 dark:bg-space-950">
            <img
              src={equipment.mainImageUrl}
              alt={equipment.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="provenance" status="NASA_ARCHIVE" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-space-950/80 backdrop-blur-md p-2 rounded-lg border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between shadow-sm">
              <span>PHOTO: NASA Public Domain</span>
              <span className="text-nasa-blue dark:text-signal-cyan font-semibold">VERIFIED FACT</span>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-slate-100 dark:bg-space-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border border-slate-200 dark:border-transparent font-medium">
                  <Rocket className="w-3.5 h-3.5 text-nasa-blue dark:text-signal-cyan" />
                  {equipment.missions?.[0]?.mission.name || 'NASA Mission'}
                </span>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-slate-100 dark:bg-space-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border border-slate-200 dark:border-transparent font-medium">
                  <MapPin className="w-3.5 h-3.5 text-nasa-blue dark:text-signal-cyan" />
                  {equipment.celestialBodyName}
                  {equipment.latitude !== undefined && equipment.latitude !== null && (
                    <span className="text-[10px] text-slate-400">
                      ({equipment.latitude.toFixed(2)}°, {equipment.longitude?.toFixed(2)}°)
                    </span>
                  )}
                </span>
              </div>

              <h1 className="font-tech text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
                {equipment.name}
              </h1>

              {/* Strict Dual Status Display */}
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">Physical:</span>
                  <Badge variant="physical" status={equipment.physicalStatus} />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">Operational:</span>
                  <Badge variant="operational" status={equipment.operationalStatus} />
                </div>
              </div>

              <p className="font-sans text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-6">
                {equipment.overview || equipment.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
              <Button
                variant="primary"
                onClick={() => onReadStory(equipment.slug)}
                icon={<BookOpen className="w-4 h-4" />}
              >
                Read Legacy Narrative
              </Button>
              {onPlayQuiz && (
                <button
                  type="button"
                  onClick={() => onPlayQuiz(equipment.slug)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono text-xs font-bold transition cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Tester mes connaissances (Quiz)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Technical Specifications & Measurements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <section className="bg-white dark:bg-space-850 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-colors">
          <h2 className="font-tech text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-nasa-blue dark:text-signal-cyan" />
            Documented Specifications
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Manufacturer</span>
              <span className="text-slate-900 dark:text-white font-medium">{equipment.manufacturer || 'NASA / JPL'}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Equipment Type</span>
              <span className="text-nasa-blue dark:text-signal-cyan font-semibold">{equipment.equipmentType}</span>
            </div>
            {equipment.launchYear && (
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Launch Year</span>
                <span className="text-slate-900 dark:text-white font-medium">{equipment.launchYear}</span>
              </div>
            )}
            {equipment.arrivalYear && (
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Arrival Year</span>
                <span className="text-slate-900 dark:text-white font-medium">{equipment.arrivalYear}</span>
              </div>
            )}
            {equipment.facts && equipment.facts.length > 0
              ? equipment.facts.map((f) => (
                  <div key={f.id} className="py-2.5 flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{f.label}</span>
                    <span className="text-slate-900 dark:text-white font-medium">
                      {f.value} {f.unit || ''}
                    </span>
                  </div>
                ))
              : equipment.measurements?.map((m) => (
                  <div key={m.measurementId} className="py-2.5 flex flex-col gap-0.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{m.name}</span>
                      <span className="text-slate-900 dark:text-white font-medium">
                        {m.value} {m.unit}
                      </span>
                    </div>
                    {m.context && <span className="text-[10px] text-slate-500 font-sans">{m.context}</span>}
                  </div>
                ))}
          </div>
        </section>

        <section className="bg-white dark:bg-space-850 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-colors">
          <h2 className="font-tech text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-nasa-blue dark:text-signal-cyan" />
            Verified Scientific Legacy
          </h2>
          {equipment.discoveries && equipment.discoveries.length > 0 ? (
            <ul className="space-y-3 font-sans text-xs text-slate-700 dark:text-slate-200">
              {equipment.discoveries.map((disc, idx) => (
                <li key={idx} className="flex gap-2.5">
                  <span className="font-mono text-nasa-blue dark:text-signal-cyan font-bold">•</span>
                  <span className="leading-relaxed">{disc}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-mono text-xs text-slate-500 dark:text-slate-400">No discoveries documented in primary sources.</p>
          )}

          {equipment.currentStatusNote && (
            <div className="mt-5 p-3 rounded-xl bg-slate-100 dark:bg-space-950 border border-slate-200 dark:border-white/5">
              <span className="font-mono text-[10px] uppercase text-signal-cyan block mb-1">Current Status Note</span>
              <p className="text-xs font-sans text-slate-700 dark:text-slate-300 leading-relaxed">
                {equipment.currentStatusNote}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Logbook Section */}
      {logbookEntries.length > 0 && (
        <section className="bg-white dark:bg-space-850 border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 mb-10 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-nasa-red animate-pulse" />
              <h2 className="font-tech text-xl font-bold text-slate-900 dark:text-white">
                Journal de Bord & Transmissions (Logbook)
              </h2>
            </div>
            <span className="font-mono text-xs text-slate-500">
              {logbookEntries.length} transmission(s) enregistrée(s)
            </span>
          </div>

          <div className="space-y-4">
            {logbookEntries.map((entry) => (
              <article
                key={entry.id}
                className="p-5 rounded-xl bg-slate-50 dark:bg-space-950 border border-slate-200 dark:border-white/5 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-tech text-base font-bold text-slate-900 dark:text-white">
                    {entry.title}
                  </h3>
                  {entry.publishedAt && (
                    <span className="text-[11px] font-mono text-signal-cyan">
                      {new Date(entry.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {entry.summary && (
                  <p className="font-sans text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {entry.summary}
                  </p>
                )}

                {entry.videoUrl && (
                  <div className="pt-2">
                    <a
                      href={entry.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-nasa-red hover:underline"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Archive multimédia NASA ({entry.videoDurationSec || 0}s) &rarr;</span>
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Mission Timeline Section */}
      <section className="bg-white dark:bg-space-850 border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 mb-10 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-tech text-xl font-bold text-slate-900 dark:text-white">
            Chronological Mission Events
          </h2>
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">Recorded in UTC</span>
        </div>
        <Timeline events={equipment.events || []} />
      </section>

      {/* Sources Section */}
      <section className="bg-white dark:bg-space-850 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-colors">
        <h2 className="font-tech text-lg font-bold text-slate-900 dark:text-white mb-3">
          Primary NASA Documentation
        </h2>
        <div className="space-y-2">
          {equipment.sources?.map((src) => (
            <a
              key={src.sourceId}
              href={src.url}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl bg-slate-50 dark:bg-space-950 border border-slate-200 dark:border-white/5 hover:border-nasa-blue flex items-center justify-between text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition group"
            >
              <div>
                <div className="font-semibold">{src.title}</div>
                <div className="text-[10px] text-slate-500">{src.publisher}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-nasa-blue dark:group-hover:text-signal-cyan shrink-0" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
