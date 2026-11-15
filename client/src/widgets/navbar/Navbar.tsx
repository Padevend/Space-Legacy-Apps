import React from 'react';
import { Compass, BookOpen, Layers, Info, Moon, Sun, Rocket, Award } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  unlockedBadgesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  isDarkMode = true,
  onToggleTheme,
  unlockedBadgesCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-space-950/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-nasa-red inline-block shadow-glow-red group-hover:scale-125 transition-transform"></span>
          <div className="flex flex-col">
            <span className="font-tech text-base sm:text-lg font-bold tracking-wider text-slate-900 dark:text-white">
              SPACE LEGACY
            </span>
            <span className="text-[10px] font-mono text-signal-cyan/90 tracking-widest uppercase">
              Digital Museum // Relics
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              currentTab === 'home'
                ? 'bg-nasa-blue text-white font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="hidden md:inline">Home</span>
          </button>

          <button
            onClick={() => onNavigate('catalogue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              currentTab === 'catalogue'
                ? 'bg-nasa-blue text-white font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Explore</span>
          </button>

          <button
            onClick={() => onNavigate('missions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              currentTab === 'missions'
                ? 'bg-nasa-blue text-white font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span className="hidden sm:inline">Missions</span>
          </button>

          <button
            onClick={() => onNavigate('quizzes')}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              currentTab === 'quizzes'
                ? 'bg-nasa-blue text-white font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Quiz & Badges</span>
            {unlockedBadgesCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                {unlockedBadgesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('stories')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              currentTab === 'stories'
                ? 'bg-nasa-blue text-white font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Stories</span>
          </button>

          <button
            onClick={() => onNavigate('about')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              currentTab === 'about'
                ? 'bg-nasa-blue text-white font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Info className="w-4 h-4" />
            <span className="hidden md:inline">About</span>
          </button>

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 ml-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition"
              title="Basculer le thème"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
