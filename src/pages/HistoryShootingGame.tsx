import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HistoryShootingGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [finalStats, setFinalStats] = useState('');
  const [gameWon, setGameWon] = useState(false);

  const questions = [
    { q: "When did India get Independence?", options: ["1857", "1947", "1950"], answer: "1947" },
    { q: "When was the First World War started?", options: ["1914", "1939", "1857"], answer: "1914" },
    { q: "When was the French Revolution?", options: ["1789", "1917", "1492"], answer: "1789" },
    { q: "When did the American Revolution start?", options: ["1775", "1800", "1600"], answer: "1775" }
  ];

  useEffect(() => {
    if (!gameStarted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let currentLevel = 0;
    let bullets: any[] = [];
    let targets: any[] = [];
    let player = { x: canvas.width / 2 - 25, y: canvas.height - 40, width: 50, height: 20, speed: 7 };
    let levelTransition = false;
    let paused = false;
    let leftPressed = false;
    let rightPressed = false;

    const playSoundFast = (src: string) => {
      const audio = new Audio(src);
      audio.volume = 0.8;
      audio.play().catch(() => {});
    };

    const initLevel = (level: number) => {
      bullets = [];
      targets = [];
      levelTransition = false;

      const q = questions[level];
      setCurrentQuestion(q.q);

      const gap = canvas.width / (q.options.length + 1);
      const baseSpeed = 1.0 + level * 0.5;

      q.options.forEach((opt, i) => {
        const speed = baseSpeed + Math.random() * 1.5;
        targets.push({
          x: gap * (i + 1),
          y: 100,
          width: 120,
          height: 50,
          text: opt,
          hit: false,
          speedX: (Math.random() < 0.5 ? 1 : -1) * speed
        });
      });
    };

    const drawPlayer = () => {
      const gunX = player.x;
      const gunY = player.y;

      ctx.fillStyle = '#00e5ff';
      ctx.fillRect(gunX, gunY, player.width, player.height);
      ctx.fillRect(gunX + player.width/2 - 5, gunY - 20, 10, 20);
      ctx.fillStyle = '#fff';
      ctx.fillRect(gunX + player.width/2 - 2, gunY - 25, 4, 5);
    };

    const drawTargets = () => {
      ctx.font = "18px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      targets.forEach(t => {
        if (!t.hit) {
          const left = t.x - t.width / 2;
          ctx.fillStyle = '#ffeb3b';
          ctx.fillRect(left, t.y, t.width, t.height);
          ctx.fillStyle = '#000';
          ctx.fillText(t.text, t.x, t.y + t.height / 2);
        }
      });
    };

    const drawBullets = () => {
      ctx.fillStyle = '#ff3d00';
      bullets.forEach(b => {
        ctx.fillRect(b.x, b.y, b.w, b.h);
      });
    };

    const updateBullets = () => {
      bullets.forEach(b => b.y -= b.speed);
      bullets = bullets.filter(b => b.y + b.h > 0);
    };

    const updateTargets = () => {
      targets.forEach(t => {
        if (!t.hit) {
          t.x += t.speedX;
          const left = t.x - t.width / 2;
          const right = left + t.width;

          if (left < 0 || right > canvas.width) {
            t.speedX *= -1;
            if (left < 0) t.x = t.width / 2;
            if (right > canvas.width) t.x = canvas.width - t.width / 2;
          }
        }
      });
    };

    const rectsOverlap = (a: any, b: any) => {
      return a.x < b.x + b.w &&
             a.x + a.w > b.x &&
             a.y < b.y + b.h &&
             a.y + a.h > b.y;
    };

    const checkCollisions = () => {
      if (levelTransition) return;

      bullets.forEach(b => {
        targets.forEach(t => {
          if (t.hit) return;

          const targetRect = { x: t.x - t.width / 2, y: t.y, w: t.width, h: t.height };

          if (rectsOverlap(b, targetRect)) {
            t.hit = true;
            b.y = -100;

            if (t.text === questions[currentLevel].answer) {
              levelTransition = true;
              const newScore = score + 100;
              setScore(newScore);

              currentLevel++;
              if (currentLevel < questions.length) {
                setTimeout(() => initLevel(currentLevel), 600);
              } else {
                setCurrentQuestion("🎉 You completed all levels!");
                setGameWon(true);
                setGameOver(true);
                setFinalStats(`Final Score: ${newScore}`);
              }
            } else {
              levelTransition = true;
              const newLives = lives - 1;
              setLives(newLives);
              setCurrentQuestion("❌ Wrong! Try again!");
              if (newLives <= 0) {
                setGameOver(true);
                setGameWon(false);
                setFinalStats(`Final Score: ${score}`);
              } else {
                setTimeout(() => initLevel(currentLevel), 800);
              }
            }
          }
        });
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPlayer();
      drawTargets();
      drawBullets();
    };

    const stepInput = () => {
      if (leftPressed) player.x -= player.speed;
      if (rightPressed) player.x += player.speed;

      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    };

    const gameLoop = () => {
      if (!gameOver && !paused) {
        stepInput();
        updateBullets();
        updateTargets();
        checkCollisions();
        draw();
      }
      requestAnimationFrame(gameLoop);
    };

    const shoot = () => {
      if (paused || levelTransition) return;
      bullets.push({ x: player.x + player.width / 2 - 2, y: player.y - 10, w: 5, h: 10, speed: 8 });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ([" ", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();

      if (e.key === 'ArrowLeft') leftPressed = true;
      if (e.key === 'ArrowRight') rightPressed = true;
      if (e.key === ' ') shoot();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') leftPressed = false;
      if (e.key === 'ArrowRight') rightPressed = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Initialize game
    initLevel(currentLevel);
    gameLoop();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver, score, lives]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setGameWon(false);
    setCurrentQuestion(questions[0].q);
  };

  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setGameWon(false);
    setCurrentQuestion('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-shadow">
          🎯 Historical Dates Gun Shooting Game 🔫
        </h1>
        
        {currentQuestion && (
          <p className="text-2xl text-center mb-4 font-bold">{currentQuestion}</p>
        )}

        <div className="relative mx-auto" style={{ maxWidth: '800px' }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="bg-gray-900 block mx-auto border-4 border-white rounded-lg"
            style={{ maxWidth: '100%', height: 'auto' }}
          />

          {/* HUD */}
          {gameStarted && !gameOver && (
            <div className="absolute top-2 left-0 right-0 flex justify-between px-4 text-lg font-bold">
              <div>Score: {score}</div>
              <div>Lives: {lives}</div>
            </div>
          )}

          {/* Start Overlay */}
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center flex-col p-6 gap-4 rounded-lg">
              <Card className="bg-blue-800 border-white">
                <CardHeader>
                  <CardTitle className="text-white text-center">Ready to test your history aim? 📜</CardTitle>
                  <CardDescription className="text-gray-200 text-center">
                    Shoot the correct date to advance. You have 3 lives.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Start Game
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center flex-col p-6 gap-4 rounded-lg">
              <Card className="bg-blue-800 border-white">
                <CardHeader>
                  <CardTitle className="text-white text-center">
                    {gameWon ? "You Win! 🎉" : "Game Over"}
                  </CardTitle>
                  <CardDescription className="text-gray-200 text-center">
                    {finalStats}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button onClick={restartGame} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Restart
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <Card className="bg-blue-800 bg-opacity-50 border-white">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">How to Play:</h3>
              <p className="text-gray-200">
                Use ← → arrow keys to move, SPACE to shoot. Hit the correct historical date!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HistoryShootingGame;
