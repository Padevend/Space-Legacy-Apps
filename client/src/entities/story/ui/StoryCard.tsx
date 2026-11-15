import React from 'react';
import { Story } from '@/shared/types';
import { Clock, ArrowRight, Volume2, BookOpen } from 'lucide-react';
import { Badge } from '@/shared/ui';

interface StoryCardProps {
  story: Story;
  onSelect: (story: Story) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onSelect }) => {
  const formatLabels: Record<string, { label: string; variant: 'tech' | 'accent' | 'neutral' }> = {
    LEGACY_STORY: { label: 'LEGACY STORY', variant: 'accent' },
    BEHIND_THE_TECHNOLOGY: { label: 'BEHIND THE TECH', variant: 'tech' },
    FINAL_CHAPTER: { label: 'FINAL CHAPTER', variant: 'neutral' },
    SPACE_FACT: { label: 'SPACE FACT', variant: 'tech' },
  };

  const currentFormat = formatLabels[story.storyType] || {
    label: story.storyType,
    variant: 'tech',
  };

  const words = story.content ? story.content.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 190));

  return (
    <article
      onClick={() => onSelect(story)}
      className="bg-white dark:bg-space-850 border border-slate-200 dark:border-white/10 hover:border-signal-cyan dark:hover:border-signal-cyan rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-glow-cyan flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <Badge variant={currentFormat.variant}>{currentFormat.label}</Badge>
            <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-space-800 text-signal-cyan border border-signal-cyan/20">
              {story.language?.toUpperCase() || 'FR'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="font-mono text-xs text-signal-cyan flex items-center gap-1 bg-signal-cyan/10 px-2 py-0.5 rounded-lg border border-signal-cyan/20"
              title="Narration vocale disponible"
            >
              <Volume2 className="w-3 h-3 text-signal-cyan animate-pulse" />
              <span>Audio</span>
            </span>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-nasa-blue dark:text-signal-cyan" />
              {minutes} min
            </span>
          </div>
        </div>

        <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-nasa-blue dark:group-hover:text-signal-cyan transition-colors leading-snug">
          {story.title}
        </h3>

        {story.hook && (
          <p className="font-sans text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed italic border-l-2 border-nasa-blue/40 pl-3">
            « {story.hook} »
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between font-mono text-xs text-nasa-blue dark:text-signal-cyan font-medium">
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Lire & Écouter</span>
        </span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </article>
  );
};
