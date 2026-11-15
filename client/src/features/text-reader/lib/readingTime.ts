/**
 * Calcule le temps de lecture estimé et le nombre de mots d'un texte.
 * En moyenne, la vitesse de lecture d'un jeune public ou d'un lecteur généraliste
 * sur un texte narratif vulgarisé est de 180 à 200 mots par minute.
 */
export function calculateReadingStats(text: string, wordsPerMinute = 190) {
  if (!text) {
    return { wordsCount: 0, minutes: 1, textFormatted: '< 1 min de lecture' };
  }

  const cleanText = text.trim();
  const words = cleanText.split(/\s+/).filter(Boolean);
  const wordsCount = words.length;
  const minutes = Math.max(1, Math.ceil(wordsCount / wordsPerMinute));

  return {
    wordsCount,
    minutes,
    textFormatted: `${minutes} min de lecture (${wordsCount} mots)`,
  };
}
