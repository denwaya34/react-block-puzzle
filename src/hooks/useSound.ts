import { useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import type { GameStatus } from '@/types/game';

interface GameSoundControls {
  initializeAudio: (status?: GameStatus) => Promise<void>;
  syncGameStatus: (status: GameStatus) => void;
  playBlockLockSound: () => void;
  isReady: boolean;
}

type SequenceStep = string | null;

export function useGameSound(): GameSoundControls {
  const initializedRef = useRef(false);
  const initPromiseRef = useRef<Promise<void> | null>(null);
  const lastStatusRef = useRef<GameStatus>('idle');

  const backgroundSynthRef = useRef<Tone.PolySynth | null>(null);
  const sequenceRef = useRef<Tone.Part<SequenceStep> | Tone.Sequence<SequenceStep> | null>(null);
  const lockSynthRef = useRef<Tone.MembraneSynth | null>(null);
  const noiseImpactSynthRef = useRef<Tone.NoiseSynth | null>(null);

  const [isReady, setIsReady] = useState(false);

  const disposeAudio = useCallback(() => {
    sequenceRef.current?.dispose();
    sequenceRef.current = null;

    backgroundSynthRef.current?.dispose();
    backgroundSynthRef.current = null;

    lockSynthRef.current?.dispose();
    lockSynthRef.current = null;

    noiseImpactSynthRef.current?.dispose();
    noiseImpactSynthRef.current = null;
  }, []);

  const syncTransport = useCallback((status: GameStatus) => {
    if (!initializedRef.current) {
      return;
    }

    const transport = Tone.getTransport();

    if (status === 'playing') {
      if (transport.state !== 'started') {
        transport.start();
      }
      return;
    }

    if (transport.state === 'started') {
      transport.pause();
    }
  }, []);

  const initializeAudio = useCallback(
    async (status?: GameStatus) => {
      if (initializedRef.current) {
        setIsReady(true);
        return;
      }

      if (status) {
        lastStatusRef.current = status;
      }

      initPromiseRef.current ??= (async () => {
        await Tone.start();

        Tone.getDestination().volume.value = -10;

        const backgroundSynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.4, decay: 0.1, release: 0.9 },
          volume: -6,
        }).toDestination();
        backgroundSynthRef.current = backgroundSynth;

        const steps: SequenceStep[] = [
          'C4',
          'E4',
          'G4',
          'B3',
          null,
          'A3',
          'E4',
          'G4',
          null,
          'F4',
          'A4',
          'C5',
          'G4',
          null,
          'E4',
          'D4',
        ];

        const sequence = new Tone.Sequence((time, note) => {
          if (note) {
            backgroundSynth.triggerAttackRelease(note, '8n', time);
          }
        }, steps, '4n');

        sequence.loop = true;
        sequence.start(0);
        sequenceRef.current = sequence;

        Tone.getTransport().bpm.value = 95;
        Tone.getTransport().swing = 0.1;

        const lockSynth = new Tone.MembraneSynth({
          volume: -4,
          envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.2 },
          octaves: 5,
        }).toDestination();
        lockSynthRef.current = lockSynth;

        const noiseImpact = new Tone.NoiseSynth({
          volume: -18,
          envelope: { attack: 0.005, decay: 0.1, sustain: 0 },
          noise: { type: 'white' },
        });
        noiseImpact.toDestination();
        noiseImpactSynthRef.current = noiseImpact;

        initializedRef.current = true;
        setIsReady(true);
      })();

      await initPromiseRef.current;
    },
    [],
  );

  const syncGameStatus = useCallback(
    (status: GameStatus) => {
      lastStatusRef.current = status;
      syncTransport(status);
    },
    [syncTransport],
  );

  const playBlockLockSound = useCallback(() => {
    if (!initializedRef.current) {
      return;
    }

    const transport = Tone.getTransport();
    if (transport.state !== 'started') {
      transport.start();
    }

    const now = Tone.now();

    lockSynthRef.current?.triggerAttackRelease('C2', '16n', now);
    noiseImpactSynthRef.current?.triggerAttackRelease('16n', now + 0.02);
  }, []);

  useEffect(() => {
    return () => {
      if (initializedRef.current) {
        Tone.getTransport().stop();
      }
      disposeAudio();
    };
  }, [disposeAudio]);

  return {
    initializeAudio,
    syncGameStatus,
    playBlockLockSound,
    isReady,
  };
}
