"use client";
import React, { useState, useEffect, useRef } from 'react';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);

  // Initialize audio context and master gain
  useEffect(() => {
    const initAudio = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        
        const masterGain = audioContext.createGain();
        masterGain.gain.value = volume;
        masterGain.connect(audioContext.destination);
        masterGainRef.current = masterGain;
      } catch (e) {
        console.log("Audio context initialization failed:", e);
      }
    };

    // Initialize on first user interaction
    const handleFirstClick = () => {
      initAudio();
      document.removeEventListener('click', handleFirstClick);
    };

    document.addEventListener('click', handleFirstClick);

    return () => {
      document.removeEventListener('click', handleFirstClick);
      // Stop all oscillators
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
      oscillatorsRef.current = [];
    };
  }, []);

  const playMelodyLoop = () => {
    if (!audioContextRef.current || !masterGainRef.current || !isPlaying) return;

    const audioContext = audioContextRef.current;
    const masterGain = masterGainRef.current;
    const now = audioContext.currentTime;
    const tempo = 0.15;

    // Energetic melody notes
    const melodyNotes = [523.25, 587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 587.33];
    const bassNotes = [261.63, 293.66, 329.63, 349.23];

    // Play melody
    melodyNotes.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.frequency.value = freq;
      osc.type = 'square';
      
      gain.gain.setValueAtTime(0.05, now + i * tempo);
      gain.gain.linearRampToValueAtTime(0.08, now + i * tempo + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * tempo + tempo - 0.02);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start(now + i * tempo);
      osc.stop(now + i * tempo + tempo - 0.01);
      
      oscillatorsRef.current.push(osc);
    });

    // Play bass
    bassNotes.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.frequency.value = freq;
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0.08, now + i * tempo * 2);
      gain.gain.linearRampToValueAtTime(0.12, now + i * tempo * 2 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * tempo * 2 + tempo * 2 - 0.02);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start(now + i * tempo * 2);
      osc.stop(now + i * tempo * 2 + tempo * 2 - 0.01);
      
      oscillatorsRef.current.push(osc);
    });

    // Clean up stopped oscillators and schedule next loop
    const loopDuration = melodyNotes.length * tempo * 1000;
    setTimeout(() => {
      oscillatorsRef.current = oscillatorsRef.current.filter(osc => {
        try {
          return osc.context.state === 'running';
        } catch {
          return false;
        }
      });
      if (isPlaying) playMelodyLoop();
    }, loopDuration);
  };

  const togglePlay = () => {
    if (!isPlaying) {
      // Resume audio context if suspended
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      setIsPlaying(true);
      // Start music on next render
      setTimeout(() => {
        if (!isPlaying) playMelodyLoop();
      }, 0);
    } else {
      setIsPlaying(false);
      // Stop all oscillators
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
      oscillatorsRef.current = [];
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (masterGainRef.current) {
      masterGainRef.current.gain.setValueAtTime(newVolume, audioContextRef.current?.currentTime || 0);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      playMelodyLoop();
    }
  }, [isPlaying]);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border-2 border-white/20 backdrop-blur-md">
      <button
        onClick={togglePlay}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-purple-600 flex items-center justify-center hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex-shrink-0"
        aria-label={isPlaying ? "Pause music" : "Play music"}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      
      {isPlaying && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default BackgroundMusic;
