import React from 'react';

interface ReadingProgressBarProps {
  progressPercent: number;
  remainingMinutes: number;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  progressPercent,
  remainingMinutes,
}) => {
  return (
    <div
      role="progressbar"
      aria-valuenow={progressPercent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progression de lecture: ${progressPercent}%`}
      className="fixed top-0 left-0 right-0 h-1 z-50 bg-space-950/80 backdrop-blur-sm pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-nasa-blue via-signal-cyan to-signal-cyan transition-all duration-150 ease-out shadow-glow-cyan"
        style={{ width: `${progressPercent}%` }}
      />
      {progressPercent > 2 && progressPercent < 98 && (
        <span
          className="absolute top-2 font-mono text-[10px] text-signal-cyan bg-space-950/90 px-1.5 py-0.5 rounded border border-signal-cyan/30 shadow transition-all duration-150 -translate-x-1/2 pointer-events-auto"
          style={{ left: `${Math.min(95, Math.max(5, progressPercent))}%` }}
        >
          {progressPercent}% · {remainingMinutes} min restante{remainingMinutes > 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};
