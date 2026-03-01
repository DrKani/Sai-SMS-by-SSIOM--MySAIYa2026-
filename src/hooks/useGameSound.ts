import { useCallback, useEffect, useRef, useState } from 'react';

type SoundType = 'tap' | 'click' | 'success' | 'fail' | 'levelComplete' | 'hint' | 'reveal' | 'gameover' | 'found' | 'win';


// Global state for mute to share across components
let globalMuted = false;
const listeners = new Set<(muted: boolean) => void>();

export const useGameSound = () => {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const [isMuted, setIsMuted] = useState(globalMuted);

    useEffect(() => {
        const listener = (muted: boolean) => setIsMuted(muted);
        listeners.add(listener);
        return () => { listeners.delete(listener); };
    }, []);

    useEffect(() => {
        // Try to recover mute state from localStorage if you want persistence
        // const savedMute = localStorage.getItem('sms_sound_muted');
        // if (savedMute) setIsMuted(savedMute === 'true');
    }, []);

    const getAudioContext = useCallback(() => {
        if (isMuted) return null;
        try {
            if (!audioCtxRef.current) {
                const AC = window.AudioContext || (window as any).webkitAudioContext;
                if (AC) audioCtxRef.current = new AC();
            }
            if (audioCtxRef.current?.state === 'suspended') {
                audioCtxRef.current.resume().catch(() => { });
            }
            return audioCtxRef.current;
        } catch {
            return null;
        }
    }, [isMuted]);

    const playSound = useCallback((type: SoundType) => {
        if (isMuted) return;

        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const now = ctx.currentTime;

            switch (type) {
                case 'tap':
                case 'click': {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.frequency.setValueAtTime(600, now);
                    gain.gain.setValueAtTime(0.05, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                    osc.type = 'sine';
                    osc.start(now);
                    osc.stop(now + 0.1);
                    break;
                }
                case 'hint':
                case 'reveal': {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.linearRampToValueAtTime(150, now + 0.2);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                    osc.type = 'square';
                    osc.start(now);
                    osc.stop(now + 0.2);
                    break;
                }
                case 'found':
                case 'success': {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.frequency.setValueAtTime(400, now);
                    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    osc.type = 'triangle';
                    osc.start(now);
                    osc.stop(now + 0.3);
                    break;
                }
                case 'fail':
                case 'gameover': {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.frequency.setValueAtTime(200, now);
                    osc.frequency.linearRampToValueAtTime(50, now + 0.5);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.5);
                    osc.type = 'sawtooth';
                    osc.start(now);
                    osc.stop(now + 0.5);
                    break;
                }
                case 'levelComplete':
                case 'win': {
                    // Arpeggio Major 7th for celebration
                    [523.25, 659.25, 783.99, 987.77].forEach((freq, i) => {
                        const o = ctx.createOscillator();
                        const g = ctx.createGain();
                        o.connect(g);
                        g.connect(ctx.destination);
                        o.frequency.value = freq;
                        g.gain.setValueAtTime(0.05, now + i * 0.1);
                        g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);
                        o.start(now + i * 0.1);
                        o.stop(now + i * 0.1 + 0.5);
                    });
                    break;
                }
            }
        } catch {
            // Ignore audio errors
        }
    }, [getAudioContext, isMuted]);

    const toggleMute = useCallback(() => {
        globalMuted = !globalMuted;
        listeners.forEach(l => l(globalMuted));
    }, []);

    return { playSound, isMuted, toggleMute };
};
