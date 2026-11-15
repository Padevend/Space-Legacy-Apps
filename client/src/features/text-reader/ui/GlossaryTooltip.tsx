import React, { useState, useRef, useEffect } from 'react';
import { SPACE_GLOSSARY } from '../lib/glossary';
import { GlossaryTerm } from '../types';
import { Info, ExternalLink } from 'lucide-react';

interface GlossaryTooltipProps {
  text: string;
  className?: string;
}

export const GlossaryTooltipText: React.FC<GlossaryTooltipProps> = ({ text, className = '' }) => {
  const [activeTerm, setActiveTerm] = useState<GlossaryTerm | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Close popover when clicking outside or pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveTerm(null);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.glossary-popover') && !(e.target as HTMLElement).closest('.glossary-trigger')) {
        setActiveTerm(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prepare regex pattern matching terms
  const termsMap = new Map<string, GlossaryTerm>();
  const patterns: string[] = [];

  SPACE_GLOSSARY.forEach((entry) => {
    termsMap.set(entry.term.toLowerCase(), entry);
    patterns.push(entry.term);
    entry.aliases?.forEach((alias) => {
      termsMap.set(alias.toLowerCase(), entry);
      patterns.push(alias);
    });
  });

  // Sort by length descending to match longest phrases first
  patterns.sort((a, b) => b.length - a.length);
  const regex = new RegExp(`\\b(${patterns.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');

  const parts: (string | { matched: string; entry: GlossaryTerm })[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const matchedWord = match[0];
    const foundEntry = termsMap.get(matchedWord.toLowerCase()) || SPACE_GLOSSARY[0];
    parts.push({ matched: matchedWord, entry: foundEntry });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  const handleTriggerClick = (entry: GlossaryTerm, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (activeTerm?.term === entry.term) {
      setActiveTerm(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setPopoverPos({
        top: rect.bottom + window.scrollY + 8,
        left: Math.min(window.innerWidth - 300, Math.max(16, rect.left + window.scrollX - 40)),
      });
      setActiveTerm(entry);
    }
  };

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (typeof part === 'string') {
          return <React.Fragment key={idx}>{part}</React.Fragment>;
        }

        const isCurrentActive = activeTerm?.term === part.entry.term;

        return (
          <button
            key={idx}
            type="button"
            ref={(el) => { triggerRefs.current[`${part.entry.term}-${idx}`] = el; }}
            onClick={(e) => handleTriggerClick(part.entry, e)}
            className={`glossary-trigger inline border-b border-dashed transition text-inherit cursor-help font-inherit ${
              isCurrentActive
                ? 'border-signal-cyan text-signal-cyan bg-signal-cyan/10 px-1 rounded'
                : 'border-signal-cyan/60 hover:border-signal-cyan hover:text-signal-cyan'
            }`}
            aria-expanded={isCurrentActive}
            aria-label={`Définition scientifique pour ${part.matched}`}
          >
            {part.matched}
          </button>
        );
      })}

      {activeTerm && popoverPos && (
        <span
          className="glossary-popover fixed z-50 w-72 sm:w-80 p-4 rounded-2xl bg-white dark:bg-space-950/95 border border-slate-200 dark:border-signal-cyan/40 shadow-xl dark:shadow-glow-cyan backdrop-blur-md text-left font-sans animate-in fade-in zoom-in-95 duration-150"
          style={{ top: `${popoverPos.top - window.scrollY}px`, left: `${popoverPos.left}px` }}
        >
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200 dark:border-white/10">
            <span className="font-tech text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-nasa-blue dark:text-signal-cyan" />
              {activeTerm.term}
            </span>
            <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-blue-50 dark:bg-nasa-blue/40 text-nasa-blue dark:text-slate-200 border border-blue-200 dark:border-nasa-blue/60 font-semibold">
              NASA Lexicon
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            {activeTerm.definition}
          </p>

          {activeTerm.nasaRef && (
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
              <span>Réf : {activeTerm.nasaRef}</span>
              <span className="text-nasa-blue dark:text-signal-cyan font-semibold flex items-center gap-0.5">
                Vérifié <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </div>
          )}
        </span>
      )}
    </span>
  );
};
