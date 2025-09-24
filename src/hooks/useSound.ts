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
  const backgroundGainRef = useRef<Tone.Gain | null>(null);
  const lockSynthRef = useRef<Tone.MembraneSynth | null>(null);
  const noiseImpactSynthRef = useRef<Tone.NoiseSynth | null>(null);
  const impactBusRef = useRef<Tone.Gain | null>(null);
  const limiterRef = useRef<Tone.Limiter | null>(null);
  const lowBoomRef = useRef<Tone.MembraneSynth | null>(null);
  const midCrackRef = useRef<Tone.FMSynth | null>(null);
  const airBurstRef = useRef<Tone.NoiseSynth | null>(null);
  const airFilterRef = useRef<Tone.Filter | null>(null);

  const [isReady, setIsReady] = useState(false);

  const disposeAudio = useCallback(() => {
    sequenceRef.current?.dispose();
    sequenceRef.current = null;

    backgroundSynthRef.current?.dispose();
    backgroundSynthRef.current = null;

    backgroundGainRef.current?.dispose();
    backgroundGainRef.current = null;

    lockSynthRef.current?.dispose();
    lockSynthRef.current = null;

    noiseImpactSynthRef.current?.dispose();
    noiseImpactSynthRef.current = null;

    impactBusRef.current?.dispose();
    impactBusRef.current = null;

    limiterRef.current?.dispose();
    limiterRef.current = null;

    lowBoomRef.current?.dispose();
    lowBoomRef.current = null;

    midCrackRef.current?.dispose();
    midCrackRef.current = null;

    airBurstRef.current?.dispose();
    airBurstRef.current = null;

    airFilterRef.current?.dispose();
    airFilterRef.current = null;
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

        const limiter = new Tone.Limiter(-6).toDestination();
        limiterRef.current = limiter;

        const impactBus = new Tone.Gain(-8).connect(limiter);
        impactBusRef.current = impactBus;

        const backgroundGain = new Tone.Gain(0.1).toDestination();
        backgroundGainRef.current = backgroundGain;

        const backgroundSynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.4, decay: 0.1, release: 0.9 },
          volume: 0,
        }).connect(backgroundGain);
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
        }).connect(impactBus);
        lockSynthRef.current = lockSynth;

        const noiseImpact = new Tone.NoiseSynth({
          volume: -18,
          envelope: { attack: 0.005, decay: 0.1, sustain: 0 },
          noise: { type: 'white' },
        });
        noiseImpact.connect(impactBus);
        noiseImpactSynthRef.current = noiseImpact;

        lowBoomRef.current = new Tone.MembraneSynth({
          pitchDecay: 0.022,
          octaves: 7,
          envelope: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.18 },
          volume: -2,
        }).connect(impactBus);

        midCrackRef.current = new Tone.FMSynth({
          harmonicity: 8,
          modulationIndex: 24,
          oscillator: { type: 'square' },
          modulation: { type: 'triangle' },
          envelope: {
            attack: 0.0005,
            decay: 0.09,
            sustain: 0,
            release: 0.06,
          },
          modulationEnvelope: {
            attack: 0.0005,
            decay: 0.12,
            sustain: 0,
            release: 0.08,
          },
          volume: -6,
        }).connect(impactBus);

        const airFilter = new Tone.Filter({
          type: 'bandpass',
          frequency: 4600,
          Q: 1.8,
        });
        airFilterRef.current = airFilter;

        airBurstRef.current = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.001, decay: 0.16, sustain: 0 },
          volume: -12,
        })
          .connect(airFilter)
          .connect(impactBus);

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

    const lowBoom = lowBoomRef.current;
    if (lowBoom) {
      lowBoom.triggerAttack('F1', now);
      lowBoom.frequency.exponentialRampToValueAtTime(45, now + 0.22);
      lowBoom.triggerRelease(now + 0.24);
    }

    const midCrack = midCrackRef.current;
    if (midCrack) {
      midCrack.triggerAttack('C3', now + 0.016);
      midCrack.frequency.exponentialRampToValueAtTime(100, now + 0.18);
      midCrack.triggerRelease(now + 0.19);
    }

    const airBurst = airBurstRef.current;
    const airFilter = airFilterRef.current;
    if (airBurst) {
      airBurst.triggerAttackRelease('16n', now + 0.01);
      if (airFilter) {
        airFilter.frequency.setValueAtTime(6200, now + 0.01);
        airFilter.frequency.exponentialRampToValueAtTime(1400, now + 0.18);
      }
    }
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
