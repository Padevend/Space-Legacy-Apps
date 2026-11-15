import { useState, useEffect, useRef, useCallback } from 'react';
import { SpeechPlaybackState } from '../types';

interface UseSpeechSynthesisProps {
  paragraphs: string[];
  language?: string; // 'fr' | 'en'
  rate?: number;
  onParagraphChange?: (index: number) => void;
}

export function useSpeechSynthesis({
  paragraphs,
  language = 'fr',
  rate = 1.0,
  onParagraphChange,
}: UseSpeechSynthesisProps) {
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechRate, setSpeechRate] = useState(rate);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isManuallyPausedRef = useRef(false);

  // Check support and load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
      return;
    }

    setSupported(true);

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);

        // Find default voice matching story language
        const langPrefix = language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
        const matchedVoice =
          voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix) && (v.name.includes('Natural') || v.name.includes('Premium'))) ||
          voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix)) ||
          voices[0] ||
          null;

        setSelectedVoice((prev) => prev || matchedVoice);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  // Sync internal rate with prop if changed
  useEffect(() => {
    setSpeechRate(rate);
  }, [rate]);

  // Speak a specific paragraph
  const speakParagraph = useCallback(
    (index: number) => {
      if (!supported || index < 0 || index >= paragraphs.length) {
        setStatus('idle');
        return;
      }

      window.speechSynthesis.cancel();

      const textToSpeak = paragraphs[index];
      if (!textToSpeak || !textToSpeak.trim()) {
        if (index + 1 < paragraphs.length) {
          speakParagraph(index + 1);
        } else {
          setStatus('idle');
        }
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = speechRate;
      utterance.pitch = 1.0;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      } else {
        utterance.lang = language.toLowerCase().startsWith('fr') ? 'fr-FR' : 'en-US';
      }

      utterance.onstart = () => {
        setStatus('playing');
        setCurrentParagraphIndex(index);
        onParagraphChange?.(index);
      };

      utterance.onend = () => {
        if (isManuallyPausedRef.current) return;

        if (index + 1 < paragraphs.length) {
          speakParagraph(index + 1);
        } else {
          setStatus('idle');
          setCurrentParagraphIndex(0);
        }
      };

      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('SpeechSynthesis error:', e.error);
        }
      };

      utteranceRef.current = utterance;
      isManuallyPausedRef.current = false;
      window.speechSynthesis.speak(utterance);
    },
    [supported, paragraphs, speechRate, selectedVoice, language, onParagraphChange]
  );

  const play = useCallback(() => {
    if (!supported) return;

    if (status === 'paused') {
      isManuallyPausedRef.current = false;
      window.speechSynthesis.resume();
      setStatus('playing');
    } else {
      speakParagraph(currentParagraphIndex);
    }
  }, [supported, status, speakParagraph, currentParagraphIndex]);

  const pause = useCallback(() => {
    if (!supported) return;
    isManuallyPausedRef.current = true;
    window.speechSynthesis.pause();
    setStatus('paused');
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    isManuallyPausedRef.current = false;
    window.speechSynthesis.cancel();
    setStatus('idle');
    setCurrentParagraphIndex(0);
  }, [supported]);

  const jumpToParagraph = useCallback(
    (index: number) => {
      if (index >= 0 && index < paragraphs.length) {
        setCurrentParagraphIndex(index);
        if (status === 'playing') {
          speakParagraph(index);
        }
      }
    },
    [paragraphs.length, status, speakParagraph]
  );

  const nextParagraph = useCallback(() => {
    if (currentParagraphIndex + 1 < paragraphs.length) {
      jumpToParagraph(currentParagraphIndex + 1);
    }
  }, [currentParagraphIndex, paragraphs.length, jumpToParagraph]);

  const previousParagraph = useCallback(() => {
    if (currentParagraphIndex > 0) {
      jumpToParagraph(currentParagraphIndex - 1);
    }
  }, [currentParagraphIndex, jumpToParagraph]);

  const changeRate = useCallback(
    (newRate: number) => {
      setSpeechRate(newRate);
      if (status === 'playing') {
        // Restart current paragraph with new speed
        speakParagraph(currentParagraphIndex);
      }
    },
    [status, currentParagraphIndex, speakParagraph]
  );

  const playbackState: SpeechPlaybackState = {
    status,
    audioMode: 'synthesized',
    hasStreamAudio: false,
    currentParagraphIndex,
    totalParagraphs: paragraphs.length,
    currentTime: 0,
    duration: 0,
    rate: speechRate,
    volume: 1.0,
    isMuted: false,
    voice: selectedVoice,
    availableVoices,
    supported,
  };

  return {
    playbackState,
    play,
    pause,
    stop,
    jumpToParagraph,
    nextParagraph,
    previousParagraph,
    changeRate,
    setSelectedVoice,
  };
}
