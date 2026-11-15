export type TextSize = 'sm' | 'base' | 'lg' | 'xl';
export type LineSpacing = 'normal' | 'relaxed' | 'loose';
export type ReaderFont = 'sans' | 'display' | 'mono' | 'dyslexic';
export type AudioMode = 'stream' | 'synthesized';

export interface ReaderSettings {
  textSize: TextSize;
  lineSpacing: LineSpacing;
  fontFamily: ReaderFont;
  focusMode: boolean;
  autoScrollAudio: boolean;
  speechRate: number; // 0.75, 1.0, 1.25, 1.5
  preferredAudioMode: AudioMode;
  volume: number; // 0 à 1
}

export interface GlossaryTerm {
  term: string;
  aliases?: string[];
  definition: string;
  nasaRef?: string;
  category: 'instrument' | 'science' | 'mission' | 'technology';
}

export interface AudioCue {
  paragraphIndex: number;
  startSeconds: number;
  endSeconds: number;
}

export interface SpeechPlaybackState {
  status: 'idle' | 'playing' | 'paused' | 'buffering';
  audioMode: AudioMode;
  hasStreamAudio: boolean;
  currentParagraphIndex: number;
  totalParagraphs: number;
  currentTime: number;
  duration: number;
  rate: number;
  volume: number;
  isMuted: boolean;
  voice: SpeechSynthesisVoice | null;
  availableVoices: SpeechSynthesisVoice[];
  supported: boolean;
}
