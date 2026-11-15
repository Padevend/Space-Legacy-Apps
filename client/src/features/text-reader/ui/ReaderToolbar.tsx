import React from 'react';
import {
  Type,
  AlignJustify,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ReaderSettings, SpeechPlaybackState } from '../types';

interface ReaderToolbarProps {
  settings: ReaderSettings;
  playbackState: SpeechPlaybackState;
  readingStats: { wordsCount: number; minutes: number; textFormatted: string };
  onIncreaseTextSize: () => void;
  onDecreaseTextSize: () => void;
  onCycleLineSpacing: () => void;
  onCycleFontFamily: () => void;
  onToggleFocusMode: () => void;
  onToggleAudio: () => void;
}

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  settings,
  playbackState,
  readingStats,
  onIncreaseTextSize,
  onDecreaseTextSize,
  onCycleLineSpacing,
  onCycleFontFamily,
  onToggleFocusMode,
  onToggleAudio,
}) => {
  const fontLabels: Record<string, string> = {
    sans: 'Inter',
    display: 'Fraunces',
    mono: 'Mono',
    dyslexic: 'Accessible',
  };

  const lineSpacingLabels: Record<string, string> = {
    normal: 'Dense',
    relaxed: 'Aéré',
    loose: 'Confort',
  };

  return (
    <aside
      aria-label="Contrôles de confort de lecture"
      className="bg-white/90 dark:bg-space-900/90 border border-slate-200 dark:border-white/10 rounded-2xl p-3 mb-8 shadow-sm dark:shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors"
    >
      {/* Statut de lecture & temps estimé */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-nasa-blue dark:text-signal-cyan font-tech font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>{readingStats.textFormatted}</span>
        </span>
        <span className="hidden sm:inline-block text-slate-300 dark:text-slate-600">|</span>
        <span className="hidden sm:flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <Sparkles className="w-3 h-3 text-nasa-blue" />
          NASA Story Reader
        </span>
      </div>

      {/* Outils de personnalisation visuelle & audio */}
      <div className="flex items-center flex-wrap gap-1.5">
        {/* Synthèse vocale Read-Aloud */}
        {playbackState.supported && (
          <button
            type="button"
            onClick={onToggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs transition cursor-pointer ${
              playbackState.status === 'playing'
                ? 'bg-nasa-red text-white shadow-glow-red animate-pulse'
                : playbackState.status === 'paused'
                ? 'bg-signal-amber text-white'
                : 'bg-blue-50 dark:bg-nasa-blue/40 text-nasa-blue dark:text-signal-cyan border border-blue-200 dark:border-signal-cyan/30 hover:bg-nasa-blue hover:text-white'
            }`}
            aria-pressed={playbackState.status === 'playing'}
            aria-label={
              playbackState.status === 'playing'
                ? 'Mettre la lecture audio en pause'
                : 'Lancer la lecture audio à voix haute'
            }
          >
            {playbackState.status === 'playing' ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Pause Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Écouter le récit</span>
              </>
            )}
          </button>
        )}

        {/* Taille de police A- / A+ */}
        <div className="flex items-center bg-slate-100 dark:bg-space-850 rounded-xl border border-slate-200 dark:border-white/10 p-0.5">
          <button
            type="button"
            onClick={onDecreaseTextSize}
            disabled={settings.textSize === 'sm'}
            className="px-2 py-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition cursor-pointer"
            title="Diminuer la taille du texte"
            aria-label="Diminuer la taille du texte"
          >
            A-
          </button>
          <span className="px-1 text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">
            {settings.textSize}
          </span>
          <button
            type="button"
            onClick={onIncreaseTextSize}
            disabled={settings.textSize === 'xl'}
            className="px-2 py-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition cursor-pointer"
            title="Augmenter la taille du texte"
            aria-label="Augmenter la taille du texte"
          >
            A+
          </button>
        </div>

        {/* Choix de typographie */}
        <button
          type="button"
          onClick={onCycleFontFamily}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-space-850 hover:bg-slate-200 dark:hover:bg-space-700 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          title="Changer la police de caractères"
          aria-label={`Police actuelle : ${fontLabels[settings.fontFamily]}. Cliquer pour changer.`}
        >
          <Type className="w-3.5 h-3.5 text-nasa-blue dark:text-signal-cyan" />
          <span>{fontLabels[settings.fontFamily]}</span>
        </button>

        {/* Interlignage */}
        <button
          type="button"
          onClick={onCycleLineSpacing}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-space-850 hover:bg-slate-200 dark:hover:bg-space-700 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          title="Modifier l'interlignage"
          aria-label={`Interlignage : ${lineSpacingLabels[settings.lineSpacing]}`}
        >
          <AlignJustify className="w-3.5 h-3.5 text-nasa-blue dark:text-signal-cyan" />
          <span>{lineSpacingLabels[settings.lineSpacing]}</span>
        </button>

        {/* Mode Focus */}
        <button
          type="button"
          onClick={onToggleFocusMode}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition cursor-pointer ${
            settings.focusMode
              ? 'bg-blue-100 dark:bg-signal-cyan/20 border-nasa-blue dark:border-signal-cyan text-nasa-blue dark:text-signal-cyan font-bold'
              : 'bg-slate-100 dark:bg-space-850 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-space-700'
          }`}
          title={settings.focusMode ? 'Quitter le mode focus' : 'Activer le mode focus sans distraction'}
          aria-pressed={settings.focusMode}
          aria-label="Mode focus"
        >
          {settings.focusMode ? (
            <EyeOff className="w-3.5 h-3.5 text-nasa-blue dark:text-signal-cyan" />
          ) : (
            <Eye className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">Focus</span>
        </button>
      </div>
    </aside>
  );
};
