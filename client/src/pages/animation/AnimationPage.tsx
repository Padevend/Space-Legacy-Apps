import React from 'react';
import { OrbitalAnimation } from '@/components/OrbitalAnimation';

/**
 * Page that shows the orbital animation preview.
 * No additional styling – it relies on the component’s own CSS.
 */
export const AnimationPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-space-850">
    <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
      Aperçu Explorateur
    </h1>
    <OrbitalAnimation />
  </div>
);
