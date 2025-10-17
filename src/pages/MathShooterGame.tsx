import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Question {
  q: string;
  a: string;
}

interface Bubble {
  x: number;
  y: number;
  r: number;
  text: string;
  correct: boolean;
  vx: number;
  vy: number;
}

interface Bullet {
  x: number;
  y: number;
  vy: number;
  r: number;
}

const MathShooterGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'MENU' | 'PLAY' | 'PAUSED' | 'GAMEOVER'>('MENU');
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [message, setMessage] = useState('');

  const gameStateRef = useRef(gameState);
  const levelRef = useRef(level);
  const timeLeftRef = useRef(timeLeft);
  const animationRef = useRef<number>();
  const timerIntervalRef = useRef<NodeJS.Timeout>();
  const isTransitioningRef = useRef(false);

  const questions: Question[] = [
    {q:"12 + 7 = ?", a:"19"},
    {q:"Find 1/3 of 45", a:"15"},
    {q:"Area of rectangle (8 x 6)", a:"48"},
    {q:"Solve x+5=12 (x=?)", a:"7"},
    {q:"Multiply 14 × 6", a:"84"},
    {q:"Divide 144 ÷ 12", a:"12"},
    {q:"Find 25% of 200", a:"50"},
    {q:"Perimeter of square side 9", a:"36"},
    {q:"Simplify: 3/4 of 64", a:"48"},
    {q:"Solve: 5x = 35 (x=?)", a:"7"}
  ];

  // Game variables
  const gameVars = useRef({
    gun: { x: 350, y: 564, width: 36, height: 18, speed: 360 },
    bullets: [] as Bullet[],
    bubbles: [] as Bubble[],
    bulletCooldown: 200,
    lastFireAt: 0,
    keys: {} as Record<string, boolean>,
    timeLimit: 15
  });

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const randRange = (min: number, max: number) => Math.random() * (max - min) + min;
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const showTemporaryMessage = (text: string, ms: number = 900) => {
    setMessage(text);
    setTimeout(() => setMessage(''), ms);
  };

  const genWrongAnswers = (correctStr: string, count: number): string[] => {
    const correctNum = parseInt(correctStr) || 0;
    const set = new Set<string>();
    while (set.size < count) {
      let delta = Math.floor(randRange(-8, 9));
      if (delta === 0) delta = 2;
      const w = (correctNum + delta).toString();
      if (w !== correctStr) set.add(w);
    }
    return Array.from(set);
  };

  const spawnBubblesForLevel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameVars.current.bullets = [];
    gameVars.current.bubbles = [];
    
    const question = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(question);
    setTimeLeft(gameVars.current.timeLimit);

    const total = 3 + Math.floor(Math.random() * 2);
    const correctIndex = Math.floor(Math.random() * total);
    const wrongs = genWrongAnswers(question.a, total - 1);

    const speedMultiplier = 1 + (levelRef.current - 1) * 0.15;

    for (let i = 0; i < total; i++) {
      const text = i === correctIndex ? question.a : wrongs.pop()!;
      gameVars.current.bubbles.push({
        x: randRange(60, canvas.width - 60),
        y: randRange(60, canvas.height * 0.45),
        r: 28,
        text: text,
        correct: (i === correctIndex),
        vx: randRange(-80, 80) * speedMultiplier,
        vy: randRange(-40, 40) * speedMultiplier
      });
    }

    // Start timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timerIntervalRef.current);
          handleTimeout();
        }
        return Math.max(0, newTime);
      });
    }, 1000);
  };

  const handleBubbleHit = (isCorrect: boolean) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    if (isCorrect) {
      showTemporaryMessage('✅ Correct — Next level!', 900);
      setTimeout(() => {
        setLevel(prev => prev + 1);
        spawnBubblesForLevel();
        isTransitioningRef.current = false;
      }, 900);
    } else {
      showTemporaryMessage('❌ Wrong — Restarting level', 900);
      setTimeout(() => {
        spawnBubblesForLevel();
        isTransitioningRef.current = false;
      }, 900);
    }
  };

  const handleTimeout = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    showTemporaryMessage('⏱ Time up — Restarting level', 900);
    setTimeout(() => {
      spawnBubblesForLevel();
      isTransitioningRef.current = false;
    }, 900);
  };

  const checkCollisions = () => {
    const { bullets, bubbles } = gameVars.current;
    
    for (let bi = bullets.length - 1; bi >= 0; bi--) {
      const bullet = bullets[bi];
      for (let ci = bubbles.length - 1; ci >= 0; ci--) {
        const bubble = bubbles[ci];
        const dx = bullet.x - bubble.x;
        const dy = bullet.y - bubble.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist <= bullet.r + bubble.r) {
          bullets.splice(bi, 1);
          handleBubbleHit(bubble.correct);
          return;
        }
      }
    }
  };

  const startGame = () => {
    setGameState('PLAY');
    setLevel(1);
    gameVars.current.gun = { x: 350, y: 564, width: 36, height: 18, speed: 360 };
    spawnBubblesForLevel();
  };

  const togglePause = () => {
    if (gameState === 'PLAY') {
      setGameState('PAUSED');
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    } else if (gameState === 'PAUSED') {
      setGameState('PLAY');
      // Resume timer
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(timerIntervalRef.current);
            handleTimeout();
          }
          return Math.max(0, newTime);
        });
      }, 1000);
    }
  };

  const resetGame = () => {
    setGameState('MENU');
    setLevel(1);
    setTimeLeft(15);
    setCurrentQuestion(null);
    setMessage('');
    isTransitioningRef.current = false;
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioningRef.current || gameStateRef.current !== 'PLAY') return;
      
      gameVars.current.keys[e.key] = true;
      
      if (e.code === 'Space') {
        e.preventDefault();
        const now = performance.now();
        if (now - gameVars.current.lastFireAt > gameVars.current.bulletCooldown) {
          gameVars.current.bullets.push({
            x: gameVars.current.gun.x,
            y: gameVars.current.gun.y - 10,
            vy: -600,
            r: 6
          });
          gameVars.current.lastFireAt = now;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameVars.current.keys[e.key] = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const update = (dt: number) => {
    if (gameStateRef.current !== 'PLAY' || isTransitioningRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { gun, bullets, bubbles, keys } = gameVars.current;

    // Gun movement
    let move = 0;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) move -= 1;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) move += 1;
    gun.x += move * gun.speed * dt;
    gun.x = clamp(gun.x, 24, canvas.width - 24);

    // Update bullets
    bullets.forEach(bullet => {
      bullet.y += bullet.vy * dt;
    });
    gameVars.current.bullets = bullets.filter(bullet => bullet.y + bullet.r > 0);

    // Update bubbles
    bubbles.forEach(bubble => {
      bubble.x += bubble.vx * dt;
      bubble.y += bubble.vy * dt;
      
      // Bounce off walls
      if (bubble.x - bubble.r < 0) {
        bubble.x = bubble.r;
        bubble.vx *= -1;
      }
      if (bubble.x + bubble.r > canvas.width) {
        bubble.x = canvas.width - bubble.r;
        bubble.vx *= -1;
      }
      
      const maxY = canvas.height * 0.55;
      if (bubble.y - bubble.r < 20) {
        bubble.y = 20 + bubble.r;
        bubble.vy *= -1;
      }
      if (bubble.y + bubble.r > maxY) {
        bubble.y = maxY - bubble.r;
        bubble.vy *= -1;
      }
    });

    checkCollisions();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameStateRef.current === 'MENU') {
      ctx.fillStyle = '#fff';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Math Shooter', canvas.width / 2, canvas.height / 2 - 50);
      ctx.font = '18px Arial';
      ctx.fillText('Shoot the correct answer bubbles!', canvas.width / 2, canvas.height / 2);
      ctx.fillText('Use ← → or A D to move, Space to shoot', canvas.width / 2, canvas.height / 2 + 30);
      return;
    }

    const { gun, bullets, bubbles } = gameVars.current;

    // Draw bubbles
    bubbles.forEach(bubble => {
      ctx.beginPath();
      ctx.fillStyle = '#2c7bd9';
      ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(bubble.text, bubble.x, bubble.y + 1);
    });

    // Draw bullets
    ctx.fillStyle = '#ffd';
    bullets.forEach(bullet => {
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw gun
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(gun.x - 18, gun.y, 36, 18);
    ctx.fillStyle = '#222';
    ctx.fillRect(gun.x - 3, gun.y - 8, 6, 10);

    // Draw level indicator
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Level ${levelRef.current}`, 8, canvas.height - 6);
  };

  const lastFrameRef = useRef(performance.now());
  const gameLoop = (now: number) => {
    if (gameStateRef.current !== 'PLAY') return;
    
    const dt = (now - lastFrameRef.current) / 1000;
    lastFrameRef.current = now;

    update(dt);
    draw();
    
    animationRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    lastFrameRef.current = performance.now();
    const loop = (now: number) => {
      const dt = (now - lastFrameRef.current) / 1000;
      lastFrameRef.current = now;
      
      if (gameStateRef.current === 'PLAY') {
        update(dt);
      }
      draw(); // Always draw regardless of game state
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/games')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Games
          </Button>
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Math Shooter — Faster Bubbles
          </h1>
          <div className="flex gap-2">
            {gameState === 'PLAY' && (
              <Button variant="outline" onClick={togglePause}>
                <Pause className="h-4 w-4" />
              </Button>
            )}
            {gameState === 'PAUSED' && (
              <Button variant="outline" onClick={togglePause}>
                <Play className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" onClick={resetGame}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Game Info Bar */}
        {gameState === 'PLAY' && currentQuestion && (
          <div className="flex items-center justify-between gap-4">
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="font-bold text-lg">Level {level}: {currentQuestion.q}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Use ← / → or A / D to move. Press <strong>Space</strong> to shoot.
                </div>
              </CardContent>
            </Card>
            <Card className="min-w-[140px]">
              <CardContent className="p-4 text-right">
                <div>Level: {level}</div>
                <div>Time left: {timeLeft}s</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Canvas */}
        <Card className="mx-auto w-fit relative">
          <CardContent className="p-4">
            <canvas
              ref={canvasRef}
              width={700}
              height={600}
              className="border-2 border-gray-800 rounded-lg shadow-lg"
              style={{ background: '#1f2330' }}
            />
            {message && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/75 text-white px-6 py-4 rounded-lg text-xl font-bold">
                  {message}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Game Controls */}
        {gameState === 'MENU' && (
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Ready to Shoot Some Math?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Shoot the bubbles with the correct answers to math problems!
              </p>
              <Button onClick={startGame} className="w-full gradient-primary">
                <Play className="h-4 w-4 mr-2" />
                Start Game
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Paused State */}
        {gameState === 'PAUSED' && (
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Game Paused</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={togglePause} className="flex-1 gradient-primary">
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
                <Button onClick={resetGame} variant="outline" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Main Menu
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>How to Play</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Use <strong>Arrow Keys</strong> or <strong>A/D</strong> to move your shooter left and right</li>
              <li>• Press <strong>Spacebar</strong> to shoot bullets at the bubbles</li>
              <li>• Shoot the bubble with the correct answer to the math question</li>
              <li>• You have 15 seconds per level to find and shoot the correct answer</li>
              <li>• Each level increases bubble speed and difficulty</li>
              <li>• Wrong answers or time running out restarts the current level</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MathShooterGame;
