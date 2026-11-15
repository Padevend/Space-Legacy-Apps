import { useState, useEffect, useRef, useCallback } from 'react';
import { SpeechPlaybackState, AudioMode, AudioCue } from '../types';

interface UseHybridAudioProps {
  paragraphs: string[];
  audioUrl?: string | null;
  audioCues?: AudioCue[] | null;
  language?: string;
  rate?: number;
  initialMode?: AudioMode;
  onParagraphChange?: (index: number) => void;
}

export function useHybridAudio({
  paragraphs,
  audioUrl,
  audioCues,
  language = 'fr',
  rate = 1.0,
  initialMode = 'stream',
  onParagraphChange,
}: UseHybridAudioProps) {
  const hasStreamAudio = Boolean(audioUrl);
  const [audioMode, setAudioMode] = useState<AudioMode>(
    hasStreamAudio && initialMode === 'stream' ? 'stream' : 'synthesized'
  );
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused' | 'buffering'>('idle');
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speechRate, setSpeechRate] = useState(rate);
  const [volume, setVolumeState] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);

  // Web Speech states
  const [speechSupported, setSpeechSupported] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Audio HTML5 ref
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const isSpeechPausedRef = useRef(false);

  // Initialize SpeechSynthesis
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        const langPrefix = language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
        const matched =
          voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix) && (v.name.includes('Natural') || v.name.includes('Premium'))) ||
          voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix)) ||
          voices[0] ||
          null;
        setSelectedVoice((prev) => prev || matched);
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

  // Initialize HTMLAudioElement for stream mode
  useEffect(() => {
    if (!audioUrl) {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
      setAudioMode('synthesized');
      return;
    }

    const audio = new Audio(audioUrl);
    audio.preload = 'metadata';
    audio.playbackRate = speechRate;
    audio.volume = isMuted ? 0 : volume;

    audio.onloadedmetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.ontimeupdate = () => {
      const cur = audio.currentTime;
      setCurrentTime(cur);

      // Find current paragraph based on cues or even split
      if (audioCues && audioCues.length > 0) {
        const found = audioCues.find((cue) => cur >= cue.startSeconds && cur < cue.endSeconds);
        if (found && found.paragraphIndex !== currentParagraphIndex) {
          setCurrentParagraphIndex(found.paragraphIndex);
          onParagraphChange?.(found.paragraphIndex);
        }
      } else if (audio.duration && paragraphs.length > 0) {
        const estIndex = Math.min(
          paragraphs.length - 1,
          Math.floor((cur / audio.duration) * paragraphs.length)
        );
        if (estIndex !== currentParagraphIndex) {
          setCurrentParagraphIndex(estIndex);
          onParagraphChange?.(estIndex);
        }
      }
    };

    audio.onwaiting = () => setStatus('buffering');
    audio.onplaying = () => setStatus('playing');
    audio.onpause = () => {
      if (status !== 'idle') setStatus('paused');
    };
    audio.onended = () => {
      setStatus('idle');
      setCurrentTime(0);
      setCurrentParagraphIndex(0);
    };

    audio.onerror = () => {
      console.warn('Audio streaming failed, falling back to Web Speech Synthesis');
      setAudioMode('synthesized');
    };

    audioElementRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioElementRef.current = null;
    };
  }, [audioUrl, audioCues, paragraphs.length, speechRate, volume, isMuted]);

  // Speak paragraph with Web Speech
  const speakSpeechParagraph = useCallback(
    (index: number) => {
      if (!speechSupported || index < 0 || index >= paragraphs.length) {
        setStatus('idle');
        return;
      }

      window.speechSynthesis.cancel();

      const text = paragraphs[index];
      if (!text || !text.trim()) {
        if (index + 1 < paragraphs.length) speakSpeechParagraph(index + 1);
        else setStatus('idle');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.pitch = 1.0;
      utterance.volume = isMuted ? 0 : volume;

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
        if (isSpeechPausedRef.current) return;
        if (index + 1 < paragraphs.length) {
          speakSpeechParagraph(index + 1);
        } else {
          setStatus('idle');
          setCurrentParagraphIndex(0);
        }
      };

      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('Speech error:', e.error);
        }
      };

      isSpeechPausedRef.current = false;
      window.speechSynthesis.speak(utterance);
    },
    [speechSupported, paragraphs, speechRate, volume, isMuted, selectedVoice, language, onParagraphChange]
  );

  // Play action
  const play = useCallback(() => {
    if (audioMode === 'stream' && audioElementRef.current) {
      audioElementRef.current
        .play()
        .then(() => setStatus('playing'))
        .catch(() => {
          // If stream fails, switch to speech
          setAudioMode('synthesized');
          speakSpeechParagraph(currentParagraphIndex);
        });
    } else {
      if (status === 'paused') {
        isSpeechPausedRef.current = false;
        window.speechSynthesis.resume();
        setStatus('playing');
      } else {
        speakSpeechParagraph(currentParagraphIndex);
      }
    }
  }, [audioMode, status, currentParagraphIndex, speakSpeechParagraph]);

  // Pause action
  const pause = useCallback(() => {
    if (audioMode === 'stream' && audioElementRef.current) {
      audioElementRef.current.pause();
      setStatus('paused');
    } else {
      isSpeechPausedRef.current = true;
      window.speechSynthesis.pause();
      setStatus('paused');
    }
  }, [audioMode]);

  // Stop action
  const stop = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
    if (speechSupported) {
      isSpeechPausedRef.current = false;
      window.speechSynthesis.cancel();
    }
    setStatus('idle');
    setCurrentTime(0);
    setCurrentParagraphIndex(0);
  }, [speechSupported]);

  // Seek time in seconds
  const seekTime = useCallback(
    (timeInSeconds: number) => {
      const targetTime = Math.max(0, Math.min(duration, timeInSeconds));
      if (audioMode === 'stream' && audioElementRef.current) {
        audioElementRef.current.currentTime = targetTime;
        setCurrentTime(targetTime);
      }
    },
    [audioMode, duration]
  );

  // Jump to specific paragraph
  const jumpToParagraph = useCallback(
    (index: number) => {
      if (index < 0 || index >= paragraphs.length) return;
      setCurrentParagraphIndex(index);
      onParagraphChange?.(index);

      if (audioMode === 'stream' && audioElementRef.current) {
        if (audioCues && audioCues[index]) {
          const targetTime = audioCues[index].startSeconds;
          audioElementRef.current.currentTime = targetTime;
          setCurrentTime(targetTime);
        } else if (duration) {
          const targetTime = (index / paragraphs.length) * duration;
          audioElementRef.current.currentTime = targetTime;
          setCurrentTime(targetTime);
        }
        if (status === 'playing') {
          audioElementRef.current.play();
        }
      } else {
        if (status === 'playing') {
          speakSpeechParagraph(index);
        }
      }
    },
    [audioMode, paragraphs.length, onParagraphChange, audioCues, duration, status, speakSpeechParagraph]
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
      if (audioElementRef.current) {
        audioElementRef.current.playbackRate = newRate;
      }
      if (audioMode === 'synthesized' && status === 'playing') {
        speakSpeechParagraph(currentParagraphIndex);
      }
    },
    [audioMode, status, currentParagraphIndex, speakSpeechParagraph]
  );

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioElementRef.current) {
      audioElementRef.current.volume = clamped;
    }
    setIsMuted(clamped === 0);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioElementRef.current) {
        audioElementRef.current.muted = next;
      }
      return next;
    });
  }, []);

  const switchAudioMode = useCallback(
    (newMode: AudioMode) => {
      if (newMode === audioMode) return;
      const wasPlaying = status === 'playing';
      stop();
      setAudioMode(newMode);
      if (wasPlaying) {
        setTimeout(() => play(), 100);
      }
    },
    [audioMode, status, stop, play]
  );

  const playbackState: SpeechPlaybackState = {
    status,
    audioMode,
    hasStreamAudio,
    currentParagraphIndex,
    totalParagraphs: paragraphs.length,
    currentTime,
    duration,
    rate: speechRate,
    volume,
    isMuted,
    voice: selectedVoice,
    availableVoices,
    supported: true,
  };

  return {
    playbackState,
    play,
    pause,
    stop,
    seekTime,
    jumpToParagraph,
    nextParagraph,
    previousParagraph,
    changeRate,
    setVolume,
    toggleMute,
    switchAudioMode,
    setSelectedVoice,
  };
}
