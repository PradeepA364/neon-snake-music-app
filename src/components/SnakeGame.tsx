import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';

export const SnakeGame: React.FC<{ onScoreChange: (score: number) => void }> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<string>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(true);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(prev => !prev); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check collisions
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            onScoreChange(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoop);
  }, [direction, food, isGameOver, isPaused, generateFood, onScoreChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00f2ff' : '#00a8b1';
      ctx.shadowBlur = isHead ? 10 : 0;
      ctx.shadowColor = '#00f2ff';
      
      // Rounded segments
      const padding = 2;
      ctx.beginPath();
      ctx.roundRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2,
        4
      );
      ctx.fill();
    });
  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="mb-6 flex justify-between items-end w-full px-2">
        <div className="flex flex-col">
          <span className="status-label mb-1">Data Stream</span>
          <div className="text-neon-green font-mono text-5xl font-black tracking-tighter drop-shadow-[0_0_10px_#00FF00]">
            {score.toString().padStart(4, '0')}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="status-label mb-1">Status</span>
          <div className={`font-mono text-sm uppercase tracking-widest px-2 py-0.5 border border-zinc-700 rounded ${isPaused ? 'text-zinc-500' : 'text-neon-green animate-pulse'}`}>
            {isPaused ? 'Standby' : 'Active'}
          </div>
        </div>
      </div>
      
      <div className="relative p-2 rounded-lg bg-black border-2 border-zinc-800 shadow-inner overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded shadow-2xl opacity-90"
        />
        
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            {isGameOver ? (
              <>
                <h2 className="text-white text-5xl font-black mb-2 tracking-tighter uppercase italic">System Failure</h2>
                <p className="status-label mb-8">Final Score: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-10 py-4 bg-neon-green text-black font-black uppercase tracking-widest hover:scale-105 transition-transform brutal-border"
                >
                  Reboot
                </button>
              </>
            ) : (
              <>
                <h2 className="text-neon-green text-5xl font-black mb-8 tracking-tighter uppercase italic animate-pulse">Standby</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest hover:scale-105 transition-transform brutal-border"
                >
                  Initiate
                </button>
                <p className="mt-6 status-label">Press Space to override</p>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-8 flex gap-6 status-label opacity-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-zinc-600 rounded-full" />
          <span>Input: Arrows</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-zinc-600 rounded-full" />
          <span>Toggle: Space</span>
        </div>
      </div>
    </div>
  );
};
