import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Clock, 
  ShieldAlert,
  Search,
  LayoutGrid,
  Trophy,
  RotateCcw,
  Pause,
  Play,
  Zap,
  Flame,
  Star,
  ChevronRight,
  Monitor,
  Cpu,
  MousePointer2,
  Settings
} from 'lucide-react';

// --- Types ---
type GameType = 'snake' | 'memory' | 'clicker' | 'none';

// --- Snake Game Component ---
const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const GRID_SIZE = 20;

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const newHead = {
        x: (prevSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (prevSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 120);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 0, y: -1 });
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-zinc-950 rounded-3xl text-white w-full max-w-md mx-auto shadow-2xl border border-zinc-800">
      <div className="flex justify-between w-full px-2 items-center mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-lg">
            <Trophy className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="font-mono text-2xl font-bold tracking-tighter">{score}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsPaused(!isPaused)} className="p-2 hover:bg-zinc-800 rounded-xl transition-all">
            {isPaused ? <Play className="w-6 h-6 text-emerald-400" /> : <Pause className="w-6 h-6 text-zinc-400" />}
          </button>
          <button onClick={resetGame} className="p-2 hover:bg-zinc-800 rounded-xl transition-all">
            <RotateCcw className="w-6 h-6 text-zinc-400" />
          </button>
        </div>
      </div>

      <div 
        className="relative bg-zinc-900 rounded-2xl overflow-hidden border-8 border-zinc-800 shadow-inner"
        style={{ width: '300px', height: '300px' }}
      >
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`absolute rounded-sm transition-all duration-100 ${i === 0 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] z-10' : 'bg-emerald-600'}`}
            style={{
              width: '15px',
              height: '15px',
              left: `${segment.x * 15}px`,
              top: `${segment.y * 15}px`,
            }}
          />
        ))}
        <div
          className="absolute bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)]"
          style={{
            width: '15px',
            height: '15px',
            left: `${food.x * 15}px`,
            top: `${food.y * 15}px`,
          }}
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-6 backdrop-blur-md">
            <div className="text-center">
              <h3 className="text-3xl font-black text-red-500 tracking-tighter mb-1">WASTED</h3>
              <p className="text-zinc-500 text-sm font-mono">Final Score: {score}</p>
            </div>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-emerald-500 text-black rounded-xl font-black hover:bg-emerald-400 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              RESPAWN
            </button>
          </div>
        )}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="text-white font-black text-2xl tracking-[0.2em] animate-pulse">PAUSED</span>
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-2">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border border-zinc-700 rounded flex items-center justify-center text-[10px] text-zinc-500 mb-1">↑</div>
          <span className="text-[8px] uppercase text-zinc-600 font-bold">Up</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border border-zinc-700 rounded flex items-center justify-center text-[10px] text-zinc-500 mb-1">↓</div>
          <span className="text-[8px] uppercase text-zinc-600 font-bold">Down</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border border-zinc-700 rounded flex items-center justify-center text-[10px] text-zinc-500 mb-1">←</div>
          <span className="text-[8px] uppercase text-zinc-600 font-bold">Left</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border border-zinc-700 rounded flex items-center justify-center text-[10px] text-zinc-500 mb-1">→</div>
          <span className="text-[8px] uppercase text-zinc-600 font-bold">Right</span>
        </div>
      </div>
    </div>
  );
};

// --- Clicker Game Component ---
const ClickerGame = () => {
  const [clicks, setClicks] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setClicks(c => c + autoClickers);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoClickers]);

  const buyMultiplier = () => {
    const cost = Math.floor(50 * Math.pow(1.5, multiplier - 1));
    if (clicks >= cost) {
      setClicks(c => c - cost);
      setMultiplier(m => m + 1);
    }
  };

  const buyAuto = () => {
    const cost = Math.floor(100 * Math.pow(1.3, autoClickers));
    if (clicks >= cost) {
      setClicks(c => c - cost);
      setAutoClickers(a => a + 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-zinc-950 rounded-[2.5rem] text-white w-full max-w-md mx-auto border border-zinc-800 shadow-2xl">
      <div className="text-center">
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Power Level</p>
        <h3 className="text-5xl font-black text-indigo-500 tracking-tighter">{clicks.toLocaleString()}</h3>
        <p className="text-zinc-600 text-xs mt-1">+{autoClickers}/sec • x{multiplier} mult</p>
      </div>

      <button 
        onClick={() => setClicks(c => c + multiplier)}
        className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] transition-all active:scale-95 flex items-center justify-center group"
      >
        <div className="w-40 h-40 rounded-full bg-zinc-900 flex items-center justify-center border-4 border-indigo-400/20 group-hover:border-indigo-400/40 transition-all">
          <Zap className="w-16 h-16 text-indigo-400 group-hover:scale-110 transition-transform" />
        </div>
      </button>

      <div className="grid grid-cols-2 gap-4 w-full">
        <button 
          onClick={buyMultiplier}
          className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-indigo-500 transition-all text-left"
        >
          <p className="text-[10px] text-zinc-500 font-bold uppercase">Upgrade Mult</p>
          <p className="text-sm font-bold">x{multiplier + 1}</p>
          <p className="text-xs text-indigo-400 mt-1">Cost: {Math.floor(50 * Math.pow(1.5, multiplier - 1))}</p>
        </button>
        <button 
          onClick={buyAuto}
          className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-purple-500 transition-all text-left"
        >
          <p className="text-[10px] text-zinc-500 font-bold uppercase">Add Drone</p>
          <p className="text-sm font-bold">+{autoClickers + 1}/s</p>
          <p className="text-xs text-purple-400 mt-1">Cost: {Math.floor(100 * Math.pow(1.3, autoClickers))}</p>
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [currentGame, setCurrentGame] = useState<GameType>('none');
  const [isPanic, setIsPanic] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Panic Button Handler (Esc key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPanic(true);
        setCurrentGame('none');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isPanic) {
    return (
      <div className="min-h-screen bg-white p-12 font-serif max-w-3xl mx-auto">
        <div className="flex items-center gap-6 border-b-2 border-zinc-100 pb-6 mb-8">
          <div className="w-16 h-16 bg-zinc-50 flex items-center justify-center rounded-xl border border-zinc-200">
            <Monitor className="w-8 h-8 text-zinc-400" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900">Quantum Mechanics</h1>
            <p className="text-zinc-400 italic text-lg">Advanced Theoretical Physics Lecture Notes</p>
          </div>
        </div>
        <div className="space-y-6 text-zinc-700 leading-relaxed text-lg">
          <p className="first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
            Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science.
          </p>
          <p>
            Classical physics, the collection of theories that existed before the advent of quantum mechanics, describes many aspects of nature at an ordinary (macroscopic) scale, but is not sufficient for describing them at very small (atomic and subatomic) scales. Most theories in classical physics can be derived from quantum mechanics as an approximation valid at large (macroscopic) scale.
          </p>
          <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 my-8">
            <h4 className="font-bold text-zinc-900 mb-2 uppercase text-sm tracking-widest">Equation 4.12: Schrödinger Equation</h4>
            <code className="text-indigo-600 font-mono block text-center py-4 text-xl">iħ ∂/∂t Ψ(r,t) = [ -ħ²/2m ∇² + V(r,t) ] Ψ(r,t)</code>
          </div>
          <button 
            onClick={() => setIsPanic(false)}
            className="mt-12 text-zinc-200 hover:text-zinc-300 text-[10px] uppercase tracking-[0.5em] transition-colors"
          >
            Re-establish Connection
          </button>
        </div>
      </div>
    );
  }

  const games = [
    { id: 'snake', title: 'Neon Snake', icon: Flame, color: 'emerald', desc: 'High-speed arcade survival' },
    { id: 'clicker', title: 'Power Clicker', icon: Zap, color: 'indigo', desc: 'Infinite progression engine' },
    { id: 'memory', title: 'Icon Match', icon: LayoutGrid, color: 'purple', desc: 'Brain training challenge' },
  ];

  const filteredGames = games.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-indigo-500/30">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-8 gap-8 z-50">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
          <Gamepad2 className="w-7 h-7" />
        </div>
        
        <nav className="flex flex-col gap-4">
          {[Monitor, Trophy, Star, Settings].map((Icon, i) => (
            <button key={i} className="p-3 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-all group relative">
              <Icon className="w-6 h-6" />
              <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {['Library', 'Ranks', 'Favorites', 'System'][i]}
              </div>
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <button 
            onClick={() => setIsPanic(true)}
            className="p-3 text-zinc-600 hover:text-red-500 transition-colors"
            title="Panic Button (Esc)"
          >
            <ShieldAlert className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-20">
        {/* Header */}
        <header className="h-24 border-b border-zinc-900 flex items-center justify-between px-12 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black tracking-tighter italic">NEXUS<span className="text-indigo-500">ARCADE</span></h1>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search library..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-full pl-12 pr-6 py-2.5 text-sm w-64 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-zinc-900/50 px-4 py-2 rounded-2xl border border-zinc-800">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Server Online</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-bold text-zinc-500 uppercase">Latency</p>
                <p className="text-xs font-mono text-emerald-400">14ms</p>
              </div>
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                <Cpu className="w-5 h-5 text-zinc-400" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {currentGame === 'none' ? (
              <motion.div 
                key="library"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-12"
              >
                {/* Hero Section */}
                <section className="relative h-80 rounded-[3rem] overflow-hidden group">
                  <img 
                    src="https://picsum.photos/seed/gaming/1200/400" 
                    alt="Featured" 
                    className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  <div className="absolute bottom-12 left-12 max-w-xl">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Featured Game</span>
                      <span className="bg-zinc-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">v2.4 Update</span>
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter mb-4 italic">NEON STRIKE</h2>
                    <p className="text-zinc-400 text-lg mb-8">Experience the next generation of unblocked arcade action. Optimized for school networks.</p>
                    <button 
                      onClick={() => setCurrentGame('snake')}
                      className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black hover:bg-indigo-400 transition-all group"
                    >
                      PLAY NOW
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </section>

                {/* Game Grid */}
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black tracking-tighter uppercase italic">Game Library</h3>
                    <div className="flex gap-2">
                      {['All', 'Arcade', 'Puzzle', 'Action'].map(cat => (
                        <button key={cat} className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-500 hover:text-white hover:border-zinc-600 transition-all">
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGames.map((game) => (
                      <motion.button
                        key={game.id}
                        whileHover={{ y: -8 }}
                        onClick={() => setCurrentGame(game.id as GameType)}
                        className="group bg-zinc-900/50 p-6 rounded-[2.5rem] border border-zinc-800 hover:border-indigo-500/50 transition-all text-left relative overflow-hidden"
                      >
                        <div className={`absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-20 transition-all duration-500 group-hover:scale-110 text-${game.color}-500`}>
                          <game.icon className="w-48 h-48" />
                        </div>
                        <div className={`w-14 h-14 bg-${game.color}-500/10 rounded-2xl flex items-center justify-center text-${game.color}-500 mb-6 border border-${game.color}-500/20`}>
                          <game.icon className="w-7 h-7" />
                        </div>
                        <h4 className="text-xl font-black text-white mb-2 tracking-tight uppercase italic">{game.title}</h4>
                        <p className="text-zinc-500 text-sm leading-relaxed">{game.desc}</p>
                        <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                          <MousePointer2 className="w-3 h-3" />
                          Click to Launch
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </section>
              </motion.div>
            ) : (
              <motion.div 
                key="game-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setCurrentGame('none')}
                    className="flex items-center gap-3 text-zinc-500 hover:text-white font-black uppercase tracking-widest text-xs transition-colors group"
                  >
                    <div className="p-2 bg-zinc-900 rounded-xl group-hover:bg-zinc-800 transition-colors">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    Exit Game
                  </button>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Playing:</span>
                    <span className="text-sm font-black text-indigo-500 uppercase italic tracking-tighter">
                      {games.find(g => g.id === currentGame)?.title}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center py-12">
                  {currentGame === 'snake' && <SnakeGame />}
                  {currentGame === 'clicker' && <ClickerGame />}
                  {currentGame === 'memory' && (
                    <div className="text-center p-20 bg-zinc-900 rounded-[3rem] border border-zinc-800">
                      <LayoutGrid className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                      <p className="text-zinc-500 font-bold">Memory Match is being optimized...</p>
                      <button onClick={() => setCurrentGame('none')} className="mt-6 text-indigo-500 hover:underline font-bold">Try another game</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Global Stealth Overlay */}
      <div className="fixed bottom-8 right-8 z-50 pointer-events-none">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Stealth Protocol</span>
            <span className="text-xs font-bold text-white">ESC Key Active</span>
          </div>
          <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-500">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
