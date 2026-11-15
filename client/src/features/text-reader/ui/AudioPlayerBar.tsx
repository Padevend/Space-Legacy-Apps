import React, { useState } from 'react';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  FastForward,
  Volume2,
  VolumeX,
  Radio,
  Cpu,
  Loader2,
} from 'lucide-react';
import { SpeechPlaybackState, AudioMode } from '../types';

interface AudioPlayerBarProps {
  playbackState: SpeechPlaybackState;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seconds: number) => void;
  onChangeRate: (rate: number) => void;
  onSetVolume: (volume: number) => void;
  onToggleMute: () => void;
  onSwitchAudioMode: (mode: AudioMode) => void;
  onSelectVoice: (voice: SpeechSynthesisVoice) => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  playbackState,
  onPlay,
  onPause,
  onStop,
  onNext,
  onPrevious,
  onSeek,
  onChangeRate,
  onSetVolume,
  onToggleMute,
  onSwitchAudioMode,
  onSelectVoice,
}) => {
  const {
    status,
    audioMode,
    hasStreamAudio,
    currentParagraphIndex,
    totalParagraphs,
    currentTime,
    duration,
    rate,
    volume,
    isMuted,
    voice,
    availableVoices,
  } = playbackState;

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (status === 'idle') return null;

  const rates = [0.75, 1.0, 1.25, 1.5];
  const isStreaming = audioMode === 'stream';
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : ((currentParagraphIndex + 1) / totalParagraphs) * 100;

  return (
    <nav
      aria-label="Lecteur audio de récit immersif"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl bg-space-950/95 border border-signal-cyan/40 rounded-2xl p-4 shadow-glow-cyan backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="flex flex-col gap-3">
        {/* Ligne 1 : Statut, Badge Mode et Infos */}
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-signal-cyan animate-ping" />
            <span className="text-white font-bold flex items-center gap-1.5 font-tech">
              {status === 'buffering' ? (
                <Loader2 className="w-4 h-4 text-signal-cyan animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4 text-signal-cyan" />
              )}
              {status === 'buffering' ? 'CHARGEMENT AUDIO...' : 'NARRATION ACTIVE'}
            </span>

            {/* Toggle Mode Audio (HQ Stream vs Synthèse) */}
            {hasStreamAudio && (
              <div className="flex items-center bg-space-850 rounded-lg p-0.5 border border-white/10 ml-2">
                <button
                  type="button"
                  onClick={() => onSwitchAudioMode('stream')}
                  className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition cursor-pointer ${
                    isStreaming
                      ? 'bg-nasa-blue text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Narration Studio HQ"
                >
                  <Radio className="w-3 h-3" />
                  <span>Studio HQ</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchAudioMode('synthesized')}
                  className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition cursor-pointer ${
                    !isStreaming
                      ? 'bg-nasa-blue text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Synthèse Vocale Assistée"
                >
                  <Cpu className="w-3 h-3" />
                  <span>Synthèse</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            {isStreaming && duration > 0 ? (
              <span className="text-signal-cyan font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            ) : (
              <span>
                Paragraphe <strong className="text-signal-cyan">{currentParagraphIndex + 1}</strong> / {totalParagraphs}
              </span>
            )}
          </div>
        </div>

        {/* Ligne 2 : Barre de timeline / scrubbing interactif */}
        <div className="relative w-full flex items-center group">
          <input
            type="range"
            min={0}
            max={isStreaming && duration > 0 ? duration : totalParagraphs - 1}
            step={isStreaming ? 0.1 : 1}
            value={isStreaming ? currentTime : currentParagraphIndex}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (isStreaming) {
                onSeek(val);
              }
            }}
            aria-label="Progression de l'audio"
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-signal-cyan focus:outline-none"
          />
          <div
            className="absolute left-0 top-0 h-1.5 bg-gradient-to-r from-nasa-blue to-signal-cyan rounded-full pointer-events-none"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>

        {/* Ligne 3 : Commandes audio */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Groupe de transport principal */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrevious}
              disabled={currentParagraphIndex === 0}
              className="p-2 rounded-xl bg-space-850 hover:bg-space-700 text-slate-300 hover:text-white disabled:opacity-30 transition cursor-pointer"
              title="Paragraphe précédent (-5s)"
              aria-label="Précédent"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {status === 'playing' ? (
              <button
                type="button"
                onClick={onPause}
                className="flex items-center gap-1.5 bg-nasa-red hover:bg-nasa-red/90 text-white px-4 py-2 rounded-xl font-mono text-xs font-bold transition shadow-glow-red cursor-pointer"
                aria-label="Mettre en pause la lecture"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onPlay}
                className="flex items-center gap-1.5 bg-signal-cyan hover:bg-signal-cyan/90 text-space-950 px-4 py-2 rounded-xl font-mono text-xs font-bold transition shadow-glow-cyan cursor-pointer"
                aria-label="Reprendre la lecture"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Écouter</span>
              </button>
            )}

            <button
              type="button"
              onClick={onNext}
              disabled={currentParagraphIndex >= totalParagraphs - 1}
              className="p-2 rounded-xl bg-space-850 hover:bg-space-700 text-slate-300 hover:text-white disabled:opacity-30 transition cursor-pointer"
              title="Paragraphe suivant (+5s)"
              aria-label="Suivant"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onStop}
              className="p-2 rounded-xl bg-space-850 hover:bg-space-700 text-slate-400 hover:text-nasa-red transition cursor-pointer ml-1"
              title="Arrêter et fermer"
              aria-label="Arrêter la lecture"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>

          {/* Vitesse de lecture */}
          <div className="flex items-center gap-1 bg-space-850 p-1 rounded-xl border border-white/10 text-xs font-mono">
            <FastForward className="w-3.5 h-3.5 text-slate-400 ml-1" />
            {rates.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onChangeRate(r)}
                className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${
                  rate === r
                    ? 'bg-signal-cyan text-space-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {r}x
              </button>
            ))}
          </div>

          {/* Volume et Mute */}
          <div
            className="relative flex items-center gap-1"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              type="button"
              onClick={onToggleMute}
              className="p-2 rounded-xl bg-space-850 hover:bg-space-700 text-slate-300 hover:text-white transition cursor-pointer"
              title={isMuted ? 'Activer le son' : 'Couper le son'}
              aria-label="Contrôle du volume"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-nasa-red" />
              ) : (
                <Volume2 className="w-4 h-4 text-signal-cyan" />
              )}
            </button>

            {showVolumeSlider && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-space-900 border border-white/10 rounded-xl shadow-xl flex items-center animate-in fade-in duration-100">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onSetVolume(parseFloat(e.target.value))}
                  aria-label="Volume"
                  className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-signal-cyan"
                />
              </div>
            )}
          </div>

          {/* Choix de voix pour la synthèse vocale */}
          {!isStreaming && availableVoices.length > 1 && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-300">
              <label htmlFor="voice-select" className="sr-only">Voix</label>
              <select
                id="voice-select"
                value={voice?.name || ''}
                onChange={(e) => {
                  const found = availableVoices.find((v) => v.name === e.target.value);
                  if (found) onSelectVoice(found);
                }}
                className="bg-space-850 border border-white/10 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-signal-cyan font-mono cursor-pointer"
              >
                {availableVoices
                  .filter((v) => v.lang.startsWith('fr') || v.lang.startsWith('en'))
                  .map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name.length > 18 ? `${v.name.slice(0, 18)}...` : v.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
