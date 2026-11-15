import React, { useState } from 'react';
import { Story } from '@/shared/types';
import { ArrowLeft, Clock, Sparkles, Zap } from 'lucide-react';
import { Badge, Button } from '@/shared/ui';
import { TextReader } from '@/features/text-reader';

interface StoryPageProps {
  story: Story;
  onBack: () => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({ story, onBack }) => {
  const [laserActive, setLaserActive] = useState(false);
  const [laserResult, setLaserResult] = useState<string | null>(null);

  const triggerLaserSimulation = () => {
    setLaserActive(true);
    setLaserResult('Firing pulse towards Tranquility Base retroreflector array...');
    setTimeout(() => {
      const rtt = (2.562 + Math.random() * 0.003 - 0.0015).toFixed(4);
      setLaserResult(`Echo received! Round-trip time: ${rtt} seconds. Distance: 384,402.14 km (Precision < 2 cm).`);
      setLaserActive(false);
    }, 1200);
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Relics</span>
        </button>
        <Badge variant="tech">NASA Storytelling</Badge>
      </div>

      <header className="mb-10 text-center sm:text-left">
        <div className="flex flex-wrap items-center gap-2 mb-4 justify-center sm:justify-start">
          <Badge
            variant={
              story.storyType === 'BEHIND_THE_TECHNOLOGY'
                ? 'tech'
                : story.storyType === 'FINAL_CHAPTER'
                ? 'neutral'
                : 'accent'
            }
          >
            {story.storyType.replace(/_/g, ' ')}
          </Badge>
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-nasa-blue dark:text-signal-cyan" />
            {Math.round((story.durationSeconds || 180) / 60)} min read
          </span>
          <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-space-800 text-signal-cyan border border-signal-cyan/20">
            {story.language?.toUpperCase() || 'FR'}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
          {story.title}
        </h1>

        {story.hook && (
          <p className="font-display italic text-lg sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed border-l-2 border-nasa-blue pl-4 my-6">
            « {story.hook} »
          </p>
        )}
      </header>

      {story.slug.includes('eagle') && (
        <div className="bg-white dark:bg-space-850 border border-blue-200 dark:border-signal-cyan/30 rounded-2xl p-6 mb-10 shadow-sm dark:shadow-glow-cyan transition-colors">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-nasa-blue dark:text-signal-cyan animate-pulse" />
              <h3 className="font-tech text-base font-bold text-slate-900 dark:text-white">
                Interactive Telemetry: EASEP Laser Ranging Retroreflector
              </h3>
            </div>
            <span className="font-mono text-[10px] text-nasa-blue dark:text-signal-cyan uppercase px-2 py-0.5 rounded bg-blue-50 dark:bg-signal-cyan/10 border border-blue-200 dark:border-signal-cyan/20 font-semibold">
              Active Experiment
            </span>
          </div>
          <p className="font-sans text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            The 100 quartz retroreflectors deployed by Neil Armstrong on July 21, 1969 require no electricity. Test an Earth-Moon laser shot in real time.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={triggerLaserSimulation}
              disabled={laserActive}
              className="bg-nasa-blue hover:bg-nasa-blue/90 text-white font-mono text-xs px-4 py-2 rounded-xl transition shadow-glow-blue disabled:opacity-50 cursor-pointer"
            >
              {laserActive ? 'Beam in Flight...' : 'Fire Earth-to-Moon Laser Pulse'}
            </button>
            {laserResult && (
              <span className="font-mono text-xs text-nasa-blue dark:text-signal-cyan bg-slate-100 dark:bg-space-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 font-medium">
                {laserResult}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Feature Lecteur Immersif & Vocal (Hybrid Audio: Stream & WebSpeech) */}
      <TextReader
        content={story.content}
        language={story.language || 'fr'}
        title={story.title}
        audioUrl={story.audioUrl}
        audioCues={story.audioCues}
        className="mb-12"
      />

      <footer className="mt-10 pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-nasa-blue dark:text-signal-cyan" />
          <span>Every forgotten object tells a story worth remembering.</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onBack}>
            Discover Another Object
          </Button>
        </div>
      </footer>
    </article>
  );
};
