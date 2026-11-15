import React, { useState, useEffect, useRef, useMemo } from 'react';
import { api } from '@/shared/api';
import {
  QuizSummaryDto,
  QuizDetailDto,
  BadgeDto,
  VisitorProgressDto,
  QuizAttemptResult,
} from '@/shared/types';
import {
  Award,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Trophy,
  Star,
  MapPin,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface QuizzesPageProps {
  onProgressUpdated?: (progress: VisitorProgressDto) => void;
}

function getDestinationInfo(quiz: QuizSummaryDto | QuizDetailDto): {
  label: string;
  category: 'moon' | 'mars' | 'deep_space';
} {
  const slug = quiz.slug.toLowerCase();
  const bodySlug = quiz.body?.slug?.toLowerCase() || '';

  if (
    bodySlug === 'moon' ||
    slug.includes('moon') ||
    slug.includes('lune') ||
    slug.includes('apollo') ||
    slug.includes('alsep') ||
    slug.includes('lrv')
  ) {
    return {
      label: quiz.machine?.name ? `Lune • ${quiz.machine.name}` : 'Lune (Moon)',
      category: 'moon',
    };
  }

  if (
    bodySlug === 'mars' ||
    slug.includes('mars') ||
    slug.includes('viking') ||
    slug.includes('ingenuity') ||
    slug.includes('sojourner') ||
    slug.includes('phoenix') ||
    slug.includes('insight')
  ) {
    return {
      label: quiz.machine?.name ? `Mars • ${quiz.machine.name}` : 'Mars',
      category: 'mars',
    };
  }

  // Deep space / Asteroid / Exoplanet missions
  if (slug.includes('kepler')) {
    return { label: 'Télescope Spatial Kepler', category: 'deep_space' };
  }
  if (slug.includes('dawn')) {
    return { label: "Ceinture d'Astéroïdes (Dawn)", category: 'deep_space' };
  }
  if (slug.includes('shoemaker') || slug.includes('near')) {
    return { label: 'Astéroïde 433 Éros (NEAR)', category: 'deep_space' };
  }
  if (slug.includes('pioneer')) {
    return { label: 'Espace Profond (Pioneer 10 & 11)', category: 'deep_space' };
  }

  return { label: 'Espace Lointain', category: 'deep_space' };
}

// Persistent in-memory cache to prevent flickering / refetch flashes on tab switches
let cachedQuizzes: QuizSummaryDto[] | null = null;
let cachedBadges: BadgeDto[] | null = null;
let cachedProgress: VisitorProgressDto | null = null;

export const QuizzesPage: React.FC<QuizzesPageProps> = ({ onProgressUpdated }) => {
  const [activeTab, setActiveTab] = useState<'quizzes' | 'badges'>('quizzes');
  const [quizzes, setQuizzes] = useState<QuizSummaryDto[]>(() => cachedQuizzes || []);
  const [badges, setBadges] = useState<BadgeDto[]>(() => cachedBadges || []);
  const [progress, setProgress] = useState<VisitorProgressDto | null>(() => cachedProgress);
  const [isLoading, setIsLoading] = useState<boolean>(() => !cachedQuizzes || cachedQuizzes.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'EXPLORER' | 'EXPERT'>('ALL');
  const [bodyFilter, setBodyFilter] = useState<'ALL' | 'moon' | 'mars' | 'deep_space'>('ALL');

  // Active quiz gameplay state
  const [activeQuizSlug, setActiveQuizSlug] = useState<string | null>(null);
  const [activeQuizDetail, setActiveQuizDetail] = useState<QuizDetailDto | null>(null);
  const [loadingQuizDetail, setLoadingQuizDetail] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptResult, setAttemptResult] = useState<QuizAttemptResult | null>(null);

  const onProgressUpdatedRef = useRef(onProgressUpdated);
  useEffect(() => {
    onProgressUpdatedRef.current = onProgressUpdated;
  }, [onProgressUpdated]);

  // Load initial quizzes, badges, and visitor progress strictly once on mount
  useEffect(() => {
    let active = true;

    const loadData = async () => {
      // Only set loading if no cached quizzes exist to prevent layout blink
      if (!cachedQuizzes || cachedQuizzes.length === 0) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const [quizzesList, badgesList, visitorProgress] = await Promise.all([
          api.getQuizzes(),
          api.getBadges(),
          api.getProgress(),
        ]);

        if (!active) return;
        cachedQuizzes = quizzesList;
        cachedBadges = badgesList;
        cachedProgress = visitorProgress;

        setQuizzes(quizzesList);
        setBadges(badgesList);
        setProgress(visitorProgress);
        if (visitorProgress && onProgressUpdatedRef.current) {
          onProgressUpdatedRef.current(visitorProgress);
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Impossible de charger les quiz et badges.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadData();
    return () => {
      active = false;
    };
  }, []);

  // Start a quiz
  const handleStartQuiz = async (slug: string) => {
    setError(null);
    setActiveQuizSlug(slug);
    setActiveQuizDetail(null);
    setLoadingQuizDetail(true);
    setSelectedAnswers({});
    setAttemptResult(null);

    try {
      const detail = await api.getQuizBySlug(slug);
      setActiveQuizDetail(detail);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger les questions du quiz.');
      setActiveQuizSlug(null);
    } finally {
      setLoadingQuizDetail(false);
    }
  };

  // Option selection
  const handleSelectOption = (questionId: string, optionId: string) => {
    if (attemptResult) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Submit attempt
  const handleSubmitQuiz = async () => {
    if (!activeQuizDetail || !activeQuizSlug) return;

    // Check that all questions are answered
    const unanswered = activeQuizDetail.questions.filter((q) => !selectedAnswers[q.id]);
    if (unanswered.length > 0) {
      setError(`Veuillez répondre à toutes les questions (${unanswered.length} restante(s)).`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const answers = Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
        questionId,
        optionId,
      }));

      const result = await api.submitQuizAttempt(activeQuizSlug, answers);
      setAttemptResult(result);

      // Refresh progress
      const updatedProgress = await api.getProgress();
      if (updatedProgress) {
        cachedProgress = updatedProgress;
        setProgress(updatedProgress);
        if (onProgressUpdatedRef.current) {
          onProgressUpdatedRef.current(updatedProgress);
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la soumission du quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExitQuiz = () => {
    setActiveQuizSlug(null);
    setActiveQuizDetail(null);
    setLoadingQuizDetail(false);
    setAttemptResult(null);
    setSelectedAnswers({});
    setError(null);
  };

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      if (levelFilter !== 'ALL' && q.level !== levelFilter) return false;
      if (bodyFilter !== 'ALL') {
        const dest = getDestinationInfo(q);
        if (dest.category !== bodyFilter) return false;
      }
      return true;
    });
  }, [quizzes, levelFilter, bodyFilter]);

  const unlockedBadgesMap = useMemo(() => {
    return new Set(progress?.badges?.map((b) => b.slug) || []);
  }, [progress]);

  const totalAnsweredCount = Object.keys(selectedAnswers).length;
  const totalQuestionsCount = activeQuizDetail?.questions?.length || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Quiz Active View */}
      {activeQuizSlug ? (
        loadingQuizDetail || !activeQuizDetail ? (
          <div className="p-16 text-center space-y-4 bg-white dark:bg-space-850 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
            <Loader2 className="w-10 h-10 text-nasa-blue dark:text-signal-cyan animate-spin mx-auto" />
            <p className="font-mono text-sm text-slate-700 dark:text-slate-300">
              Initialisation du module d'évaluation NASA…
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
              <button
                onClick={handleExitQuiz}
                className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour à la liste des quiz</span>
              </button>
              <div className="flex items-center gap-3">
                <span
                  className={`badge-pill text-[11px] font-mono px-2.5 py-0.5 rounded-full ${
                    activeQuizDetail.level === 'EXPERT'
                      ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                      : 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30'
                  }`}
                >
                  {activeQuizDetail.level}
                </span>
                <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-space-950 px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/5">
                  Progression : {totalAnsweredCount} / {totalQuestionsCount}
                </span>
              </div>
            </div>

            {/* Quiz Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3.5 h-3.5 text-nasa-blue dark:text-signal-cyan" />
                <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                  {getDestinationInfo(activeQuizDetail).label}
                </span>
              </div>
              <h1 className="font-tech text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
                {activeQuizDetail.title}
              </h1>
              {activeQuizDetail.description && (
                <p className="text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  {activeQuizDetail.description}
                </p>
              )}
            </div>

            {/* Results Summary if submitted */}
            {attemptResult && (
              <div className="p-6 rounded-2xl bg-white dark:bg-space-850 border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-full ${
                        attemptResult.attempt.percentage >= 80
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-tech text-xl font-bold text-slate-900 dark:text-white">
                        Score final : {attemptResult.attempt.score} / {attemptResult.attempt.maxScore} (
                        {attemptResult.attempt.percentage}%)
                      </h3>
                      <p className="text-xs font-sans text-slate-600 dark:text-slate-400">
                        {attemptResult.attempt.percentage === 100
                          ? 'Exploration parfaite ! Félicitations pour ce 100% sans faute.'
                          : attemptResult.attempt.percentage >= 60
                            ? 'Mission réussie ! Les connaissances scientifiques sont validées.'
                            : 'Tentative terminée. Vous pouvez relire les archives et recommencer.'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(activeQuizSlug)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nasa-blue text-white font-mono text-xs font-bold hover:bg-nasa-blue/80 transition cursor-pointer shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Recommencer ce quiz</span>
                  </button>
                </div>

                {/* Badges unlocked alert */}
                {attemptResult.newBadges && attemptResult.newBadges.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-amber-500 shrink-0" />
                    <div>
                      <span className="font-tech font-bold text-amber-700 dark:text-amber-300 text-sm">
                        Nouveau badge scientifique débloqué !
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {attemptResult.newBadges.map((b) => (
                          <span
                            key={b.id}
                            className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 font-semibold"
                          >
                            🏆 {b.name} : {b.description}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Question List */}
            <div className="space-y-5">
              {activeQuizDetail.questions.map((q, qIndex) => {
                const submittedAnswer = attemptResult?.attempt.answers.find((a) => a.questionId === q.id);
                const isAnswered = Boolean(selectedAnswers[q.id]);

                return (
                  <div
                    key={q.id}
                    className={`p-6 rounded-2xl bg-white dark:bg-space-850 border transition shadow-sm ${
                      submittedAnswer
                        ? submittedAnswer.isCorrect
                          ? 'border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-950/10'
                          : 'border-red-500/50 bg-red-500/5 dark:bg-red-950/10'
                        : isAnswered
                          ? 'border-slate-300 dark:border-white/20'
                          : 'border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <span className="font-mono text-xs text-nasa-blue dark:text-signal-cyan font-bold tracking-wider">
                        QUESTION {qIndex + 1} / {activeQuizDetail.questions.length}
                      </span>
                      {submittedAnswer && (
                        <span
                          className={`flex items-center gap-1 text-xs font-mono font-bold ${
                            submittedAnswer.isCorrect
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {submittedAnswer.isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Exact (+1)</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              <span>Incorrect (0)</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    <p className="font-sans text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-5 leading-relaxed">
                      {q.prompt}
                    </p>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIndex) => {
                        const isSelected = selectedAnswers[q.id] === opt.id;
                        const optionLetter = String.fromCharCode(65 + optIndex);

                        let buttonClasses =
                          'border-slate-200 dark:border-white/10 hover:border-nasa-blue/50 dark:hover:border-white/30 bg-slate-50/50 dark:bg-space-950/50';

                        if (attemptResult) {
                          if (isSelected && submittedAnswer?.isCorrect) {
                            buttonClasses =
                              'border-emerald-500 bg-emerald-500/15 dark:bg-emerald-500/20 ring-1 ring-emerald-500';
                          } else if (isSelected && !submittedAnswer?.isCorrect) {
                            buttonClasses =
                              'border-red-500 bg-red-500/15 dark:bg-red-500/20 ring-1 ring-red-500';
                          } else {
                            buttonClasses = 'opacity-60 border-slate-200 dark:border-white/5';
                          }
                        } else if (isSelected) {
                          buttonClasses =
                            'border-nasa-blue bg-nasa-blue/10 dark:bg-nasa-blue/25 ring-2 ring-nasa-blue shadow-sm';
                        }

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={Boolean(attemptResult)}
                            onClick={() => handleSelectOption(q.id, opt.id)}
                            className={`p-3.5 rounded-xl border text-left text-xs font-sans transition flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${buttonClasses}`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-6 h-6 rounded-lg font-mono text-[11px] font-bold flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? 'bg-nasa-blue text-white'
                                    : 'bg-slate-200 dark:bg-space-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {optionLetter}
                              </span>
                              <span
                                className={`leading-relaxed ${
                                  attemptResult
                                    ? isSelected
                                      ? submittedAnswer?.isCorrect
                                        ? 'text-emerald-800 dark:text-emerald-200 font-bold'
                                        : 'text-red-800 dark:text-red-200 font-bold'
                                      : 'text-slate-700 dark:text-slate-300'
                                    : isSelected
                                      ? 'text-slate-900 dark:text-white font-bold'
                                      : 'text-slate-800 dark:text-slate-200 font-medium'
                                }`}
                              >
                                {opt.label}
                              </span>
                            </div>

                            {isSelected && (
                              <span className="w-2.5 h-2.5 rounded-full bg-nasa-blue shrink-0"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Scientific Explanation after submission */}
                    {submittedAnswer?.explanation && (
                      <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-white/10 text-xs font-sans text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-space-950 p-3 rounded-xl">
                        <strong className="text-nasa-blue dark:text-signal-cyan font-mono font-bold block mb-1">
                          Explication archivistique NASA :
                        </strong>
                        {submittedAnswer.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            {!attemptResult && (
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="font-mono text-xs text-slate-500">
                  {totalQuestionsCount - totalAnsweredCount > 0
                    ? `${totalQuestionsCount - totalAnsweredCount} question(s) restante(s)`
                    : 'Toutes les questions sont répondues !'}
                </span>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitQuiz}
                  className="px-6 py-3 rounded-xl bg-nasa-red hover:bg-nasa-red/90 text-white font-tech font-bold tracking-wider text-sm transition shadow-glow-red disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Validation en cours…' : 'Valider mes réponses'}
                </button>
              </div>
            )}
          </div>
        )
      ) : (
        /* Quizzes & Badges Overview List */
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-nasa-red shadow-glow-red"></span>
                <span className="font-mono text-xs uppercase tracking-widest text-nasa-blue dark:text-signal-cyan font-semibold">
                  Mission Control // Training & Rewards
                </span>
              </div>
              <h1 className="font-tech text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
                Quiz & Badges d'Exploration
              </h1>
              <p className="font-sans text-sm text-slate-600 dark:text-slate-300 max-w-2xl mt-2 leading-relaxed">
                Testez vos connaissances sur les reliques lunaires et martiennes abandonnées par la NASA. Complétez les missions d'apprentissage pour débloquer les badges authentiques Space Legacy.
              </p>
            </div>

            {/* Sub-tabs: Quizzes vs Badges */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-space-850 p-1.5 rounded-xl border border-slate-200 dark:border-white/10 shrink-0">
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                  activeTab === 'quizzes'
                    ? 'bg-nasa-blue text-white shadow-sm font-bold'
                    : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Tous les Quiz ({quizzes.length})
              </button>
              <button
                onClick={() => setActiveTab('badges')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                  activeTab === 'badges'
                    ? 'bg-nasa-blue text-white shadow-sm font-bold'
                    : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  Badges ({unlockedBadgesMap.size}/{badges.length})
                </span>
              </button>
            </div>
          </div>

          {/* Visitor Progress Bar */}
          {progress && (
            <div className="p-5 rounded-2xl bg-white dark:bg-space-850 border border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[11px] uppercase text-slate-500 dark:text-slate-400">
                    Progression Explorateur
                  </span>
                  <div className="font-tech text-base font-bold text-slate-900 dark:text-white">
                    {progress.completedQuizzesCount} quiz complétés • {progress.perfectScoresCount} scores parfaits
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-700 dark:text-amber-300 bg-amber-500/15 px-3 py-1.5 rounded-lg border border-amber-500/30 font-semibold">
                <Trophy className="w-4 h-4" />
                <span>{progress.badgesCount} badge(s) obtenu(s)</span>
              </div>
            </div>
          )}

          {/* Quizzes Tab */}
          {activeTab === 'quizzes' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Niveau :</span>
                  {(['ALL', 'EXPLORER', 'EXPERT'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLevelFilter(lvl)}
                      className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                        levelFilter === lvl
                          ? 'bg-nasa-blue text-white border-nasa-blue font-bold shadow-sm'
                          : 'bg-white dark:bg-space-850 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {lvl === 'ALL' ? 'Tous niveaux' : lvl}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Destination :</span>
                  {[
                    { id: 'ALL', label: 'Toutes' },
                    { id: 'moon', label: 'Lune' },
                    { id: 'mars', label: 'Mars' },
                    { id: 'deep_space', label: 'Espace & Astéroïdes' },
                  ].map((body) => (
                    <button
                      key={body.id}
                      onClick={() => setBodyFilter(body.id as any)}
                      className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                        bodyFilter === body.id
                          ? 'bg-nasa-blue text-white border-nasa-blue font-bold shadow-sm'
                          : 'bg-white dark:bg-space-850 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {body.label}
                    </button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="p-16 text-center text-xs font-mono text-slate-500 dark:text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-nasa-blue dark:text-signal-cyan" />
                  Chargement des quiz d'exploration…
                </div>
              ) : filteredQuizzes.length === 0 ? (
                <div className="p-16 text-center text-xs font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-space-850 rounded-2xl border border-slate-200 dark:border-white/10">
                  Aucun quiz ne correspond aux filtres sélectionnés.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredQuizzes.map((quiz) => {
                    const destination = getDestinationInfo(quiz);

                    return (
                      <div
                        key={quiz.id}
                        className="group p-5 rounded-2xl bg-white dark:bg-space-850 border border-slate-200 dark:border-white/10 hover:border-nasa-blue transition flex flex-col justify-between shadow-sm hover:shadow-glow-blue"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span
                              className={`badge-pill text-[10px] font-mono px-2.5 py-0.5 rounded-full ${
                                quiz.level === 'EXPERT'
                                  ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                                  : 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30'
                              }`}
                            >
                              {quiz.level}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                              {quiz.questionCount} questions
                            </span>
                          </div>

                          <h3 className="font-tech text-base font-bold text-slate-900 dark:text-white group-hover:text-nasa-blue dark:group-hover:text-signal-cyan transition-colors mb-2 line-clamp-2">
                            {quiz.title}
                          </h3>

                          {quiz.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed font-sans">
                              {quiz.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                          <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1 truncate max-w-[150px]">
                            <MapPin className="w-3 h-3 text-nasa-blue dark:text-signal-cyan shrink-0" />
                            <span className="truncate">{destination.label}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStartQuiz(quiz.slug)}
                            className="px-3 py-1.5 rounded-lg bg-nasa-blue/10 dark:bg-nasa-blue/20 hover:bg-nasa-blue text-nasa-blue dark:text-signal-cyan hover:text-white dark:hover:text-white font-mono text-xs font-bold transition cursor-pointer shrink-0"
                          >
                            Démarrer &rarr;
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Badges Tab */}
          {activeTab === 'badges' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {badges.map((b) => {
                  const isUnlocked = unlockedBadgesMap.has(b.slug) || Boolean(b.unlocked);

                  return (
                    <div
                      key={b.id}
                      className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                        isUnlocked
                          ? 'bg-amber-500/10 border-amber-500/40 shadow-glow-amber'
                          : 'bg-white dark:bg-space-850 border-slate-200 dark:border-white/10 opacity-75'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`p-3 rounded-xl ${
                              isUnlocked
                                ? 'bg-amber-500/20 text-amber-500'
                                : 'bg-slate-100 dark:bg-space-950 text-slate-400'
                            }`}
                          >
                            <Award className="w-6 h-6" />
                          </div>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                              isUnlocked
                                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                : 'bg-slate-200 dark:bg-space-950 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {isUnlocked ? 'DÉBLOQUÉ' : 'VERROUILLÉ'}
                          </span>
                        </div>

                        <h3 className="font-tech text-base font-bold text-slate-900 dark:text-white mb-1.5">
                          {b.name}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed mb-3">
                          {b.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        Règle : {b.rule} (Seuil : {b.threshold})
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
