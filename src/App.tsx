import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Activity, Terminal, Zap, Cpu } from 'lucide-react';

export default function App() {
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Pane: Branding & Marquee (Brutalist) */}
      <aside className="lg:w-1/3 bg-black text-white flex flex-col border-r-2 border-black overflow-hidden">
        <div className="p-8 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-neon-green rounded-full shadow-[0_0_15px_#00FF00]" />
              <span className="font-mono text-xs uppercase tracking-[0.4em]">Unit-01 // Core</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter uppercase mb-8">
              Neon<br />
              <span className="text-neon-green">Snake</span><br />
              Beats
            </h1>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-mono font-black text-neon-green">01</div>
                <div className="text-xs uppercase tracking-widest leading-tight">
                  Neural Link<br />Established
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-mono font-black opacity-20">02</div>
                <div className="text-xs uppercase tracking-widest leading-tight opacity-40">
                  Audio Sync<br />Active
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="status-label mb-2">System High Score</div>
            <div className="text-6xl font-mono font-black text-neon-green drop-shadow-[0_0_10px_#00FF00]">
              {highScore.toString().padStart(4, '0')}
            </div>
          </div>
        </div>

        {/* Marquee Footer */}
        <div className="bg-neon-green text-black py-4 border-t-2 border-black overflow-hidden">
          <div className="marquee-track font-mono font-black uppercase text-2xl">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="mx-8">
                System Online • Neural Link Active • High Performance Mode • 
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* Right Pane: Main Interface (Hardware Widget Style) */}
      <main className="flex-1 bg-[#E6E6E6] p-4 md:p-12 flex flex-col gap-8">
        <header className="flex items-center justify-between border-b-2 border-black pb-6">
          <div className="flex items-center gap-4">
            <Terminal className="w-6 h-6" />
            <h2 className="font-mono font-bold uppercase tracking-widest text-sm">Interface Terminal v2.5</h2>
          </div>
          <div className="flex gap-2">
            {[Zap, Cpu, Activity].map((Icon, i) => (
              <div key={i} className="w-10 h-10 border-2 border-black flex items-center justify-center bg-white hover:bg-neon-green transition-colors cursor-pointer">
                <Icon size={18} />
              </div>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
          {/* Game Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <span className="status-label">Visual Output</span>
              <span className="text-[10px] font-mono text-zinc-400">FPS: 60.0</span>
            </div>
            <div className="hardware-card p-8 flex justify-center">
              <SnakeGame onScoreChange={handleScoreChange} />
            </div>
          </section>

          {/* Audio Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <span className="status-label">Audio Processor</span>
              <span className="text-[10px] font-mono text-zinc-400">SR: 44.1KHZ</span>
            </div>
            <div className="flex flex-col gap-8">
              <MusicPlayer />
              
              {/* Hardware Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="hardware-card p-6 border-l-4 border-l-neon-green">
                  <div className="status-label mb-2">Buffer Size</div>
                  <div className="text-3xl font-mono font-bold">512ms</div>
                </div>
                <div className="hardware-card p-6 border-l-4 border-l-neon-green">
                  <div className="status-label mb-2">CPU Load</div>
                  <div className="text-3xl font-mono font-bold">14.2%</div>
                </div>
              </div>

              <div className="p-6 border-2 border-black bg-white brutal-border">
                <p className="font-mono text-xs leading-relaxed">
                  <span className="text-neon-green bg-black px-1">WARNING:</span> HIGH ENERGY OUTPUT DETECTED. 
                  NEURAL LINK STABILITY AT 98.4%. PROCEED WITH CAUTION.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
