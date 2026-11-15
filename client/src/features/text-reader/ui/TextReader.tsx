import React, { useRef, useEffect } from 'react';
import { useReaderSettings } from '../model/useReaderSettings';
import { useReadingProgress } from '../model/useReadingProgress';
import { useHybridAudio } from '../model/useHybridAudio';
import { calculateReadingStats } from '../lib/readingTime';
import { ReadingProgressBar } from './ReadingProgressBar';
import { ReaderToolbar } from './ReaderToolbar';
import { AudioPlayerBar } from './AudioPlayerBar';
import { GlossaryTooltipText } from './GlossaryTooltip';
import { Volume2 } from 'lucide-react';
import { AudioCue } from '../types';

interface TextReaderProps {
  content: string;
  language?: string;
  title?: string;
  audioUrl?: string | null;
  audioCues?: AudioCue[] | null;
  className?: string;
}

export const TextReader: React.FC<TextReaderProps> = ({
  content,
  language = 'fr',
  audioUrl,
  audioCues,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  // Split content into clean paragraphs
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const stats = calculateReadingStats(content);

  const {
    settings,
    increaseTextSize,
    decreaseTextSize,
    cycleLineSpacing,
    cycleFontFamily,
    toggleFocusMode,
    updateSetting,
  } = useReaderSettings();

  const { progressPercent, remainingMinutes } = useReadingProgress(containerRef, stats.minutes);

  const {
    playbackState,
    play,
    pause,
    stop,
    seekTime,
    jumpToParagraph,
    nextParagraph,
    previousParagraph,
    changeRate,
    setVolume,
    toggleMute,
    switchAudioMode,
    setSelectedVoice,
  } = useHybridAudio({
    paragraphs,
    audioUrl,
    audioCues,
    language,
    rate: settings.speechRate,
    initialMode: settings.preferredAudioMode,
  });

  // Auto-scroll to active paragraph when reading aloud
  useEffect(() => {
    if (playbackState.status === 'playing' && settings.autoScrollAudio) {
      const targetElement = paragraphRefs.current[playbackState.currentParagraphIndex];
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [playbackState.currentParagraphIndex, playbackState.status, settings.autoScrollAudio]);

  // Typography class computation
  const textSizeClass = {
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
  }[settings.textSize];

  const lineSpacingClass = {
    normal: 'leading-normal space-y-4',
    relaxed: 'leading-relaxed space-y-6',
    loose: 'leading-loose space-y-8',
  }[settings.lineSpacing];

  const fontClass = {
    sans: 'font-sans',
    display: 'font-display',
    mono: 'font-mono',
    dyslexic: 'font-sans tracking-wide word-spacing-wide',
  }[settings.fontFamily];

  return (
    <section
      ref={containerRef}
      className={`relative transition-all duration-300 ${
        settings.focusMode ? 'max-w-3xl mx-auto py-6' : 'max-w-4xl mx-auto'
      } ${className}`}
    >
      {/* 1. Barre de progression supérieure */}
      <ReadingProgressBar
        progressPercent={progressPercent}
        remainingMinutes={remainingMinutes}
      />

      {/* 2. Barre d'outils du lecteur */}
      <ReaderToolbar
        settings={settings}
        playbackState={playbackState}
        readingStats={stats}
        onIncreaseTextSize={increaseTextSize}
        onDecreaseTextSize={decreaseTextSize}
        onCycleLineSpacing={cycleLineSpacing}
        onCycleFontFamily={cycleFontFamily}
        onToggleFocusMode={toggleFocusMode}
        onToggleAudio={playbackState.status === 'playing' ? pause : play}
      />

      {/* 3. Zone de lecture principale */}
      <div
        className={`bg-white/80 dark:bg-space-850/50 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-white/5 transition-all shadow-xl dark:shadow-2xl ${
          settings.focusMode ? 'ring-2 ring-nasa-blue dark:ring-signal-cyan/20 bg-white dark:bg-space-900/95' : ''
        }`}
      >
        <div className={`${fontClass} ${textSizeClass} ${lineSpacingClass} text-slate-800 dark:text-slate-200`}>
          {paragraphs.map((paragraph, index) => {
            const isPlayingThis =
              playbackState.status !== 'idle' &&
              playbackState.currentParagraphIndex === index;

            return (
              <div
                key={index}
                ref={(el) => {
                  paragraphRefs.current[index] = el;
                }}
                className={`group relative rounded-2xl p-3 sm:p-4 -mx-3 sm:-mx-4 transition-all duration-200 ${
                  isPlayingThis
                    ? 'bg-blue-50/80 dark:bg-space-800/90 border-l-4 border-nasa-blue dark:border-signal-cyan shadow-sm dark:shadow-glow-cyan text-slate-950 dark:text-white ring-1 ring-blue-200 dark:ring-signal-cyan/20'
                    : 'hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                }`}
              >
                {/* Bouton rapide d'écoute du paragraphe */}
                <button
                  type="button"
                  onClick={() => jumpToParagraph(index)}
                  className={`absolute -left-3 sm:-left-8 top-4 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${
                    isPlayingThis
                      ? 'opacity-100 text-nasa-blue dark:text-signal-cyan bg-blue-100 dark:bg-space-800'
                      : 'text-slate-400 hover:text-nasa-blue dark:hover:text-signal-cyan bg-white dark:bg-space-900 shadow-sm border border-slate-200 dark:border-white/10'
                  }`}
                  title={`Écouter à partir du paragraphe ${index + 1}`}
                  aria-label={`Écouter à partir du paragraphe ${index + 1}`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>

                <p
                  className={
                    index === 0
                      ? 'first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-nasa-blue dark:first-letter:text-signal-cyan first-letter:leading-none'
                      : ''
                  }
                >
                  <GlossaryTooltipText text={paragraph} />
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Barre audio flottante sticky */}
      <AudioPlayerBar
        playbackState={playbackState}
        onPlay={play}
        onPause={pause}
        onStop={stop}
        onNext={nextParagraph}
        onPrevious={previousParagraph}
        onSeek={seekTime}
        onChangeRate={(newRate) => {
          changeRate(newRate);
          updateSetting('speechRate', newRate);
        }}
        onSetVolume={(newVol) => {
          setVolume(newVol);
          updateSetting('volume', newVol);
        }}
        onToggleMute={toggleMute}
        onSwitchAudioMode={(newMode) => {
          switchAudioMode(newMode);
          updateSetting('preferredAudioMode', newMode);
        }}
        onSelectVoice={setSelectedVoice}
      />
    </section>
  );
};
