import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface ComplimentControls {
  speakCompliment: () => void;
  isSupported: boolean;
}

const COMPLIMENTS = [
  'さすが、君はできる人だね！',
  'おめでとう！見事なプレイだよ。',
  'この調子！君は天才だね。',
  '最高のタイミング！素晴らしいよ。',
  '完璧だよ。その腕に感動した！',
];

const isSpeechSupported = typeof window !== 'undefined'
  && 'speechSynthesis' in window;

function pickCompliment() {
  const index = Math.floor(Math.random() * COMPLIMENTS.length);
  return COMPLIMENTS[index];
}

function selectVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  if (voices.length === 0) {
    return null;
  }

  const japaneseVoice = voices.find(voice => voice.lang.startsWith('ja'));
  return japaneseVoice ?? voices[0];
}

export function useCompliment(): ComplimentControls {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const canSpeakRef = useRef(isSpeechSupported);
  const lastUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!isSpeechSupported) {
      return;
    }

    const synthesis = window.speechSynthesis;

    const updateVoices = () => {
      const available = synthesis.getVoices();
      setVoices(available);
    };

    updateVoices();
    synthesis.addEventListener('voiceschanged', updateVoices);

    return () => {
      synthesis.removeEventListener('voiceschanged', updateVoices);
    };
  }, []);

  const selectedVoice = useMemo(() => selectVoice(voices), [voices]);

  const speakCompliment = useCallback(() => {
    if (!canSpeakRef.current || !isSpeechSupported) {
      return;
    }

    const synthesis = window.speechSynthesis;
    if (synthesis.speaking) {
      return;
    }

    const compliment = pickCompliment();
    const utterance = new SpeechSynthesisUtterance(compliment);
    utterance.rate = 1.05;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    lastUtteranceRef.current = utterance;
    synthesis.speak(utterance);
  }, [selectedVoice]);

  return {
    speakCompliment,
    isSupported: canSpeakRef.current,
  };
}
