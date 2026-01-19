"use client";
import React, { useState, useEffect, useRef } from 'react';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio context with Web Audio API for better control
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    
    // Energetic background music data URL (upbeat electronic/game theme)
    // This is a simple synthesized melody using Web Audio API
    createEnergeticTheme();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const createEnergeticTheme = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(audioContext.destination);

    // Function to create energetic theme music
    const playTheme = () => {
      if (!isPlaying) return;

      const now = audioContext.currentTime;
      const tempo = 0.15; // Fast tempo for energy

      // Melody notes (energetic scale)
      const melodyNotes = [523.25, 587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 587.33];
      const bassNotes = [261.63, 293.66, 329.63, 349.23];

      // Play melody
      melodyNotes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.frequency.value = freq;
        osc.type = 'square';
        
        gain.gain.setValueAtTime(0, now + i * tempo);
        gain.gain.linearRampToValueAtTime(0.1, now + i * tempo + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * tempo + tempo - 0.01);
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        osc.start(now + i * tempo);
        osc.stop(now + i * tempo + tempo);
      });

      // Play bass line
      bassNotes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.frequency.value = freq;
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0, now + i * tempo * 2);
        gain.gain.linearRampToValueAtTime(0.15, now + i * tempo * 2 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * tempo * 2 + tempo * 2 - 0.01);
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        osc.start(now + i * tempo * 2);
        osc.stop(now + i * tempo * 2 + tempo * 2);
      });

      // Loop the theme
      setTimeout(() => {
        if (isPlaying) playTheme();
      }, melodyNotes.length * tempo * 1000);
    };

    if (isPlaying && audioContext.state === 'suspended') {
      audioContext.resume();
    }

    if (isPlaying) {
      playTheme();
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      createEnergeticTheme();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl p-3 flex items-center gap-3">
      <button
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-white text-purple-600 flex items-center justify-center hover:bg-purple-50 transition-all duration-300 shadow-lg"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      
      {isPlaying && (
        <div className="flex items-center gap-2 pr-2 animate-fade-in">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-2 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, white ${volume * 100}%, rgba(255,255,255,0.3) ${volume * 100}%)`
            }}
          />
        </div>
      )}
      
      {isPlaying && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default BackgroundMusic;
