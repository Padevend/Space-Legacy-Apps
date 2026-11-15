import { useState, useEffect } from 'react';
import { ReaderSettings, TextSize, LineSpacing, ReaderFont } from '../types';

const STORAGE_KEY = 'space_legacy_reader_settings';

const DEFAULT_SETTINGS: ReaderSettings = {
  textSize: 'base',
  lineSpacing: 'relaxed',
  fontFamily: 'sans',
  focusMode: false,
  autoScrollAudio: true,
  speechRate: 1.0,
  preferredAudioMode: 'stream',
  volume: 1.0,
};

export function useReaderSettings() {
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // Ignore localStorage issues
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore localStorage issues
    }
  }, [settings]);

  const updateSetting = <K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const increaseTextSize = () => {
    const sizes: TextSize[] = ['sm', 'base', 'lg', 'xl'];
    const currentIndex = sizes.indexOf(settings.textSize);
    if (currentIndex < sizes.length - 1) {
      updateSetting('textSize', sizes[currentIndex + 1]);
    }
  };

  const decreaseTextSize = () => {
    const sizes: TextSize[] = ['sm', 'base', 'lg', 'xl'];
    const currentIndex = sizes.indexOf(settings.textSize);
    if (currentIndex > 0) {
      updateSetting('textSize', sizes[currentIndex - 1]);
    }
  };

  const cycleLineSpacing = () => {
    const spacings: LineSpacing[] = ['normal', 'relaxed', 'loose'];
    const currentIndex = spacings.indexOf(settings.lineSpacing);
    const nextIndex = (currentIndex + 1) % spacings.length;
    updateSetting('lineSpacing', spacings[nextIndex]);
  };

  const cycleFontFamily = () => {
    const fonts: ReaderFont[] = ['sans', 'display', 'mono', 'dyslexic'];
    const currentIndex = fonts.indexOf(settings.fontFamily);
    const nextIndex = (currentIndex + 1) % fonts.length;
    updateSetting('fontFamily', fonts[nextIndex]);
  };

  const toggleFocusMode = () => {
    updateSetting('focusMode', !settings.focusMode);
  };

  return {
    settings,
    updateSetting,
    increaseTextSize,
    decreaseTextSize,
    cycleLineSpacing,
    cycleFontFamily,
    toggleFocusMode,
  };
}
