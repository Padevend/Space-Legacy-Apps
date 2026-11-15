import React from 'react';
import { Event } from '@/shared/types';
import { Calendar, CheckCircle } from 'lucide-react';

interface TimelineProps {
  events: { event: Event }[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return <p className="font-mono text-xs text-slate-400">No chronological events documented.</p>;
  }

  const sortedEvents = [...events].sort(
    (a, b) => a.event.sequenceOrder - b.event.sequenceOrder
  );

  return (
    <div className="relative border-l-2 border-slate-300 dark:border-space-600 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8 my-6">
      {sortedEvents.map(({ event }) => {
        const isTerminalEvent =
          event.eventType === 'LAST_SIGNAL' || event.eventType === 'MISSION_END';

        return (
          <div key={event.eventId} className="relative group">
            <span
              className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 transition-transform duration-200 group-hover:scale-125 ${
                isTerminalEvent
                  ? 'bg-nasa-blue border-white shadow-glow-blue'
                  : 'bg-white dark:bg-space-950 border-nasa-blue dark:border-signal-cyan shadow-sm dark:shadow-glow-cyan'
              }`}
            ></span>

            <div className="bg-slate-50 dark:bg-space-850 border border-slate-200 dark:border-white/10 rounded-xl p-4 sm:p-5 hover:border-nasa-blue dark:hover:border-space-500 shadow-sm transition">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-nasa-blue dark:text-signal-cyan" />
                  {event.eventDate || 'Date Unknown'}
                  {event.datePrecision && event.datePrecision !== 'EXACT' && (
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">({event.datePrecision})</span>
                  )}
                </span>
                <span
                  className={`font-mono text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
                    isTerminalEvent
                      ? 'bg-blue-100 dark:bg-nasa-blue/20 text-nasa-blue dark:text-sky-200 border border-blue-200 dark:border-nasa-blue/40'
                      : 'bg-slate-200 dark:bg-space-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {event.eventType.replace(/_/g, ' ')}
                </span>
              </div>

              <h4 className="font-tech text-base font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-nasa-blue dark:text-signal-cyan shrink-0" />
                {event.title}
              </h4>

              {event.description && (
                <p className="font-sans text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
