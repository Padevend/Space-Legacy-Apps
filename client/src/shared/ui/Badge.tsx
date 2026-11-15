import React from 'react';
import { OperationalStatus, PhysicalStatus, MediaProvenance } from '@/shared/types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'operational' | 'physical' | 'provenance' | 'neutral' | 'accent' | 'tech' | 'info' | 'secondary' | 'default';
  status?: OperationalStatus | PhysicalStatus | MediaProvenance | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  status,
  className = '',
}) => {
  let colorClasses = 'bg-slate-100 dark:bg-space-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-space-600';

  if (variant === 'operational') {
    switch (status) {
      case 'OPERATIONAL':
        colorClasses = 'bg-emerald-50 dark:bg-signal-cyan/20 text-emerald-700 dark:text-signal-cyan border-emerald-200 dark:border-signal-cyan/40 font-semibold';
        break;
      case 'MISSION_ENDED':
        colorClasses = 'bg-slate-100 dark:bg-space-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600/50';
        break;
      case 'FAILED':
        colorClasses = 'bg-rose-50 dark:bg-slate-800 text-rose-700 dark:text-slate-400 border-rose-200 dark:border-slate-700';
        break;
      case 'INACTIVE':
      default:
        colorClasses = 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/50';
        break;
    }
  } else if (variant === 'physical') {
    switch (status) {
      case 'LEFT_ON_SURFACE':
        colorClasses = 'bg-blue-50 dark:bg-nasa-blue/30 text-nasa-blue dark:text-sky-200 border-blue-200 dark:border-nasa-blue/50 font-medium';
        break;
      case 'IN_ORBIT':
        colorClasses = 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 border-purple-200 dark:border-purple-700/40';
        break;
      case 'DESTROYED':
      case 'LOST':
        colorClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700';
        break;
      case 'RETURNED_TO_EARTH':
        colorClasses = 'bg-teal-50 dark:bg-space-700 text-teal-800 dark:text-slate-200 border-teal-200 dark:border-space-500';
        break;
      default:
        colorClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
        break;
    }
  } else if (variant === 'provenance') {
    switch (status) {
      case 'NASA_ARCHIVE':
        colorClasses = 'bg-nasa-blue text-white border-nasa-blue shadow-sm font-semibold';
        break;
      case '3D_RECONSTRUCTION':
        colorClasses = 'bg-blue-50 dark:bg-space-700 text-nasa-blue dark:text-sky-300 border-blue-200 dark:border-space-500';
        break;
      case 'AI_GENERATED_ILLUSTRATION':
        colorClasses = 'bg-amber-50 dark:bg-space-800 text-amber-800 dark:text-slate-300 border-amber-200 dark:border-space-600';
        break;
      default:
        colorClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        break;
    }
  } else if (variant === 'accent') {
    colorClasses = 'bg-nasa-blue text-white border-nasa-blue font-semibold shadow-sm';
  } else if (variant === 'tech') {
    colorClasses = 'bg-blue-50 dark:bg-space-800 text-nasa-blue dark:text-signal-cyan border-blue-200 dark:border-space-600 font-semibold';
  } else if (variant === 'info') {
    colorClasses = 'bg-cyan-50 dark:bg-signal-cyan/20 text-cyan-700 dark:text-signal-cyan border-cyan-200 dark:border-signal-cyan/40 font-semibold';
  } else if (variant === 'secondary') {
    colorClasses = 'bg-slate-100 dark:bg-space-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600';
  }

  const label = children || (typeof status === 'string' ? status.replace(/_/g, ' ') : '');

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider uppercase border ${colorClasses} ${className}`}
    >
      {label}
    </span>
  );
};
