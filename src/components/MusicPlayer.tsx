import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Nights",
    artist: "Synthwave Pro",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/300/300"
  },
  {
    id: 2,
    title: "Cyber Rush",
    artist: "Digital Ghost",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/cyber/300/300"
  },
  {
    id: 3,
    title: "Electric Dreams",
    artist: "Retro Wave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/electric/300/300"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  }, [currentTrackIndex, isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  return (
    <div className="w-full hardware-card p-8 relative overflow-hidden">
      {/* Hardware Details */}
      <div className="absolute top-4 right-4 flex gap-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
        <div className="relative">
          <div className="w-32 h-32 radial-track p-2 animate-spin-slow">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full rounded-full object-cover grayscale contrast-125"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Playhead Indicator */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-neon-green shadow-[0_0_10px_#00FF00]" />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="status-label mb-1">Now Processing</div>
          <h3 className="text-white font-black text-2xl uppercase tracking-tighter mb-1">{currentTrack.title}</h3>
          <p className="text-neon-green font-mono text-xs uppercase tracking-[0.3em]">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Progress Display */}
        <div className="space-y-2">
          <div className="flex justify-between status-label">
            <span>Signal Progress</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="relative h-4 w-full bg-black border border-zinc-800 rounded-sm overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-neon-green shadow-[0_0_15px_#00FF00] transition-all duration-300" 
              style={{ width: `${progress}%` }}
            >
              {/* Scanline on progress */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] bg-[length:20px_100%] animate-scan" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button onClick={prevTrack} className="w-12 h-12 border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <SkipBack size={20} />
            </button>
            <button 
              onClick={togglePlay}
              className={`w-20 h-20 border-2 flex items-center justify-center transition-all duration-300 ${isPlaying ? 'border-neon-green text-neon-green shadow-[0_0_20px_rgba(0,255,0,0.2)]' : 'border-white text-white'}`}
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={nextTrack} className="w-12 h-12 border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <SkipForward size={20} />
            </button>
          </div>
          
          <div className="flex-1 min-w-[150px] space-y-2">
            <div className="flex justify-between status-label">
              <span>Output Gain</span>
              <Volume2 size={14} />
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-zinc-400" />
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
    </div>
  );
};
