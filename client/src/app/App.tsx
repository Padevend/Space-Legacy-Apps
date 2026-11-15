import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/shared/api';
import { Equipment, Story, VisitorProgressDto } from '@/shared/types';
import { Navbar } from '@/widgets/navbar';
import { Footer } from '@/widgets/footer';
import { HomePage } from '@/pages/home';
import { CataloguePage } from '@/pages/catalogue';
import { EquipmentDetailPage } from '@/pages/equipment-detail';
import { StoryPage } from '@/pages/story';
import { StoryCard } from '@/entities/story';
import MissionsPage from '@/pages/missions/MissionsPage';
import { QuizzesPage } from '@/pages/quizzes';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'catalogue' | 'stories' | 'about' | 'missions' | 'quizzes'>('home');
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyFormatFilter, setStoryFormatFilter] = useState<string>('ALL');
  const [progress, setProgress] = useState<VisitorProgressDto | null>(null);
  const [stats, setStats] = useState({
    equipmentsCount: 0,
    missionsCount: 0,
    yearsSpan: 57,
    celestialBodiesCount: 2,
    quizzesCount: 26,
  });
  const [apiStatus, setApiStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [apiError, setApiError] = useState<string | null>(null);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('space_legacy_theme');
    if (saved === 'dark' || saved === 'light') return saved === 'dark';
    return !window.matchMedia('(prefers-color-scheme: light)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('space_legacy_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('space_legacy_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    let active = true;

    const loadApiData = async () => {
      try {
        // 1. Establish session & health check
        await api.initSession().catch(() => null);
        const connectionStatus = await api.checkConnection().catch(() => 'ok');

        const [equipmentData, storyData, visitorProgress] = await Promise.all([
          api.getEquipments(),
          api.getStories(),
          api.getProgress().catch(() => null),
        ]);

        if (!active) return;

        setApiStatus(connectionStatus === 'ok' ? 'connected' : 'disconnected');
        setApiError(null);
        setEquipments(equipmentData);
        setStories(storyData);
        if (visitorProgress) setProgress(visitorProgress);

        try {
          const loadedStats = await api.getStats(equipmentData);
          if (active) setStats(loadedStats);
        } catch {
          // stats fallback
        }
      } catch (error) {
        if (!active) return;
        setApiStatus('disconnected');
        setApiError(error instanceof Error ? error.message : 'Impossible de communiquer avec le serveur.');
      }
    };

    void loadApiData();
    return () => {
      active = false;
    };
  }, []);

  const handleProgressUpdated = useCallback((updated: VisitorProgressDto) => {
    setProgress(updated);
  }, []);

  const handleSelectEquipment = async (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setSelectedStory(null);
    setApiError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const detail = await api.getEquipmentBySlug(equipment.slug);
      if (detail) setSelectedEquipment(detail);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Impossible de charger le détail de cet équipement.');
    }
  };

  const handleReadStory = async (slug: string) => {
    const foundStory = stories.find((story) => story.slug.includes(slug));
    if (!foundStory) {
      setApiError('Ce récit ne figure pas dans les récits publiés par le serveur.');
      return;
    }

    setSelectedStory(foundStory);
    setSelectedEquipment(null);
    setApiError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const story = await api.getStoryBySlug(foundStory.slug);
      if (story) setSelectedStory(story);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Impossible de charger ce récit.');
    }
  };

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab as any);
    setSelectedEquipment(null);
    setSelectedStory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen geo-grid-texture flex flex-col justify-between transition-colors duration-200">
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        unlockedBadgesCount={progress?.badgesCount || progress?.badges?.length || 0}
      />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 pt-3" aria-live="polite">
          {apiError ? (
            <p
              role="alert"
              className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 font-mono text-xs text-red-800 dark:border-red-500/30 dark:bg-red-950/30 dark:text-red-200"
            >
              Serveur : {apiError}
            </p>
          ) : (
            <p
              role="status"
              className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              {apiStatus === 'connecting'
                ? 'Connexion au serveur…'
                : apiStatus === 'connected'
                  ? 'Serveur connecté'
                  : 'Mode autonome'}
            </p>
          )}
        </div>

        {selectedStory ? (
          <StoryPage
            story={selectedStory}
            onBack={() => setSelectedStory(null)}
          />
        ) : selectedEquipment ? (
          <EquipmentDetailPage
            equipment={selectedEquipment}
            onBack={() => setSelectedEquipment(null)}
            onReadStory={handleReadStory}
            onPlayQuiz={() => {
              setSelectedEquipment(null);
              setCurrentTab('quizzes');
            }}
          />
        ) : currentTab === 'catalogue' ? (
          <CataloguePage
            equipments={equipments}
            onSelectEquipment={handleSelectEquipment}
          />
        ) : currentTab === 'quizzes' ? (
          <QuizzesPage onProgressUpdated={handleProgressUpdated} />
        ) : currentTab === 'stories' ? (
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h1 className="font-tech text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-2">
                  Récits & Narrations Vocales
                </h1>
                <p className="font-sans text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                  Chaque objet abandonné prend la parole à la première personne. Découvrez leur histoire, leurs défis d'ingénierie et leur silence à travers les 4 formats éditoriaux de SPACE LEGACY.
                </p>
              </div>

              {/* Filtres par format éditorial */}
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {[
                  { id: 'ALL', label: 'Tous les récits' },
                  { id: 'LEGACY_STORY', label: 'Legacy Stories' },
                  { id: 'BEHIND_THE_TECHNOLOGY', label: 'Technologie' },
                  { id: 'FINAL_CHAPTER', label: 'Fin de Mission' },
                  { id: 'SPACE_FACT', label: 'Faits Spatiaux' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStoryFormatFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                      storyFormatFilter === tab.id
                        ? 'bg-nasa-blue text-white border-nasa-blue shadow-glow-blue font-bold'
                        : 'bg-white dark:bg-space-850 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stories
                .filter(
                  (s) =>
                    storyFormatFilter === 'ALL' ||
                    s.storyType === storyFormatFilter
                )
                .map((s) => (
                  <StoryCard
                    key={s.storyId}
                    story={s}
                    onSelect={(story) => void handleReadStory(story.slug)}
                  />
                ))}
            </div>
          </div>
        ) : currentTab === 'missions' ? (
          <div className="max-w-5xl mx-auto px-4 py-8">
            <MissionsPage />
          </div>
        ) : currentTab === 'about' ? (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="font-tech text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
              About SPACE LEGACY
            </h1>
            <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-white dark:bg-space-850 p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
              <p>
                <strong>SPACE LEGACY</strong> is a digital space museum created for the <strong>NASA Space Apps Challenge 2026</strong> addressing the challenge <em>"Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars"</em>.
              </p>
              <h3 className="font-tech text-lg text-slate-900 dark:text-white font-bold">Scientific and Editorial Integrity</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Every factual data point is derived strictly from verified NASA archives and primary mission reports.</li>
                <li>Physical Status and Operational Status are intentionally kept strictly separate to prevent any ambiguity.</li>
                <li>Every media asset features explicit provenance labeling (NASA Archive, 3D Reconstruction, AI Illustration).</li>
              </ul>
            </div>
          </div>
        ) : (
          <HomePage
            equipments={equipments}
            stats={stats}
            onExplore={() => setCurrentTab('catalogue')}
            onSelectEquipment={handleSelectEquipment}
            onReadStory={handleReadStory}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};
