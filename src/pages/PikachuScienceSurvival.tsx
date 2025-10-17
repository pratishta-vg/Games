import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Question {
  q: string;
  options: string[];
  answer: number;
}

const PikachuScienceSurvival: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'MENU' | 'PLAY' | 'QUESTION' | 'GAMEOVER'>('MENU');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [level, setLevel] = useState(1);
  const [timer, setTimer] = useState(15);
  const [isPaused, setIsPaused] = useState(false);

  const gameStateRef = useRef(gameState);
  const levelRef = useRef(level);
  const timerRef = useRef(timer);
  const animationRef = useRef<number>();
  const timerIntervalRef = useRef<NodeJS.Timeout>();

  const questions: Question[] = [
    {q: "What part of the plant makes food?", options: ["Roots", "Stem", "Leaves", "Flower"], answer: 2},
    {q: "Which gas do we breathe in to survive?", options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Helium"], answer: 1},
    {q: "What is the closest planet to the Sun?", options: ["Mercury", "Venus", "Earth", "Mars"], answer: 0},
    {q: "Which force pulls things towards Earth?", options: ["Friction", "Magnetism", "Gravity", "Electricity"], answer: 2},
    {q: "Water changes to ice at what temperature (°C)?", options: ["0", "50", "100", "25"], answer: 0},
    {q: "Which organ pumps blood throughout our body?", options: ["Lungs", "Heart", "Kidney", "Liver"], answer: 1},
    {q: "Earth completes one rotation in how many hours?", options: ["12", "24", "36", "48"], answer: 1},
    {q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1},
    {q: "Which part of the human body helps us breathe?", options: ["Heart", "Brain", "Lungs", "Kidneys"], answer: 2},
    {q: "The Sun is a type of?", options: ["Planet", "Star", "Comet", "Asteroid"], answer: 1},
    {q: "Which sense organ helps us to smell?", options: ["Eyes", "Nose", "Ears", "Tongue"], answer: 1},
    {q: "What do bees collect from flowers to make honey?", options: ["Pollen", "Nectar", "Seeds", "Leaves"], answer: 1},
    {q: "Which gas is used by plants during photosynthesis?", options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Hydrogen"], answer: 0},
    {q: "Which star is at the center of our solar system?", options: ["Polaris", "Alpha Centauri", "The Sun", "Sirius"], answer: 2},
    {q: "How many legs does an insect usually have?", options: ["4", "6", "8", "10"], answer: 1}
  ];

  // Game variables
  const gameVars = useRef({
    player: { x: 400, y: 300, size: 60, speed: 5 },
    bullets: [] as Array<{ x: number; y: number; dx: number; dy: number }>,
    bulletSpeed: 2,
    currentQuestionIndex: 0,
    keys: {} as Record<string, boolean>,
    pikachuImg: new Image()
  });

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    // Load Pikachu image
    gameVars.current.pikachuImg.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png";

    // Keyboard event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      gameVars.current.keys[e.key] = true;
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

  const spawnBullet = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const side = ["top", "bottom", "left", "right"][Math.floor(Math.random() * 4)];
    let x, y, dx, dy;

    if (side === "top") {
      x = Math.random() * canvas.width;
      y = 0;
      dx = (Math.random() < 0.5 ? -1 : 1);
      dy = 1;
    } else if (side === "bottom") {
      x = Math.random() * canvas.width;
      y = canvas.height;
      dx = (Math.random() < 0.5 ? -1 : 1);
      dy = -1;
    } else if (side === "left") {
      x = 0;
      y = Math.random() * canvas.height;
      dx = 1;
      dy = (Math.random() < 0.5 ? -1 : 1);
    } else {
      x = canvas.width;
      y = Math.random() * canvas.height;
      dx = -1;
      dy = (Math.random() < 0.5 ? -1 : 1);
    }

    gameVars.current.bullets.push({ x, y, dx, dy });
  };

  const startLevel = () => {
    gameVars.current.bullets = [];
    for (let i = 0; i < 5; i++) {
      spawnBullet();
    }
    setTimer(15);
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    timerIntervalRef.current = setInterval(() => {
      setTimer(prev => {
        const newTimer = prev - 1;
        if (newTimer <= 0) {
          clearInterval(timerIntervalRef.current);
          showQuestion();
        }
        return newTimer;
      });
    }, 1000);
  };

  const showQuestion = () => {
    setGameState('QUESTION');
    const questionData = questions[gameVars.current.currentQuestionIndex];
    setCurrentQuestion(questionData);
  };

  const checkAnswer = (selectedIndex: number) => {
    if (!currentQuestion) return;

    if (selectedIndex === currentQuestion.answer) {
      setLevel(prev => prev + 1);
      gameVars.current.bulletSpeed += 1;
      gameVars.current.currentQuestionIndex = (gameVars.current.currentQuestionIndex + 1) % questions.length;
      setCurrentQuestion(null);
      setGameState('PLAY');
      startLevel();
    } else {
      gameOver();
    }
  };

  const gameOver = () => {
    setGameState('GAMEOVER');
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const resetGame = () => {
    setLevel(1);
    gameVars.current.bulletSpeed = 2;
    gameVars.current.currentQuestionIndex = 0;
    gameVars.current.player = { x: 400, y: 300, size: 60, speed: 5 };
    setCurrentQuestion(null);
    setGameState('MENU');
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const startGame = () => {
    setGameState('PLAY');
    startLevel();
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const update = () => {
    if (gameStateRef.current !== 'PLAY' || isPaused) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { player, bullets, keys } = gameVars.current;

    // Player movement
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < canvas.width - player.size) player.x += player.speed;
    if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
    if (keys['ArrowDown'] && player.y < canvas.height - player.size) player.y += player.speed;

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      bullet.x += bullet.dx * gameVars.current.bulletSpeed;
      bullet.y += bullet.dy * gameVars.current.bulletSpeed;

      // Remove bullets that are off-screen and spawn new ones
      if (bullet.x < -10 || bullet.x > canvas.width + 10 || bullet.y < -10 || bullet.y > canvas.height + 10) {
        bullets.splice(i, 1);
        spawnBullet();
      }

      // Collision detection
      if (bullet.x > player.x && bullet.x < player.x + player.size &&
          bullet.y > player.y && bullet.y < player.y + player.size) {
        gameOver();
      }
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameStateRef.current === 'MENU') {
      ctx.fillStyle = 'black';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Pikachu Science Survival', canvas.width / 2, canvas.height / 2 - 50);
      ctx.font = '18px Arial';
      ctx.fillText('Use arrow keys to move Pikachu', canvas.width / 2, canvas.height / 2);
      ctx.fillText('Avoid the colorful bullets and answer science questions!', canvas.width / 2, canvas.height / 2 + 30);
      return;
    }

    if (gameStateRef.current === 'GAMEOVER') {
      ctx.fillStyle = 'red';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 50);
      ctx.font = '18px Arial';
      ctx.fillText(`You reached Level ${levelRef.current}`, canvas.width / 2, canvas.height / 2);
      return;
    }

    // Draw Pikachu
    const { player, bullets } = gameVars.current;
    if (gameVars.current.pikachuImg.complete) {
      ctx.drawImage(gameVars.current.pikachuImg, player.x, player.y, player.size, player.size);
    } else {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(player.x, player.y, player.size, player.size);
    }

    // Draw bullets
    bullets.forEach((bullet, i) => {
      const hue = (levelRef.current * 30 + i * 20) % 360;
      ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, 10, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw UI
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    if (gameStateRef.current === 'PLAY') {
      ctx.fillText(`Time Left: ${timerRef.current}`, 10, 30);
      ctx.fillText(`Level: ${levelRef.current}`, 10, 55);
      ctx.fillText(`Speed: ${gameVars.current.bulletSpeed.toFixed(1)}`, 10, 80);
    }
  };

  const gameLoop = () => {
    if (gameStateRef.current === 'PLAY' && !isPaused) {
      update();
      draw();
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  };

  useEffect(() => {
    const loop = () => {
      if (gameStateRef.current === 'PLAY' && !isPaused) {
        update();
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
  }, [gameState, isPaused]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200 pt-20 pb-8 px-4">
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
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Pikachu's Science Survival
          </h1>
          <div className="flex gap-2">
            {gameState === 'PLAY' && (
              <Button variant="outline" onClick={togglePause}>
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            )}
            <Button variant="outline" onClick={resetGame}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Game Canvas */}
        <Card className="mx-auto w-fit">
          <CardContent className="p-4">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="border-2 border-gray-800 rounded-lg shadow-lg bg-gradient-radial from-white to-blue-100"
              style={{
                background: 'radial-gradient(circle at center, #ffffff 0%, #e0e0ff 100%)'
              }}
            />
          </CardContent>
        </Card>

        {/* Game Controls */}
        {gameState === 'MENU' && (
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Ready to Play?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Help Pikachu survive by dodging bullets and answering science questions correctly!
              </p>
              <Button onClick={startGame} className="w-full gradient-primary">
                <Play className="h-4 w-4 mr-2" />
                Start Game
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Question Modal */}
        {gameState === 'QUESTION' && currentQuestion && (
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle className="text-center">Science Question - Level {level}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium text-center">{currentQuestion.q}</h3>
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => checkAnswer(index)}
                    className="p-4 text-left hover:bg-blue-50 transition-colors"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game Over */}
        {gameState === 'GAMEOVER' && (
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-red-600">Game Over!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center">
                You reached <strong>Level {level}</strong>!
              </p>
              <div className="flex gap-2">
                <Button onClick={startGame} className="flex-1 gradient-primary">
                  <Play className="h-4 w-4 mr-2" />
                  Play Again
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
              <li>• Use <strong>Arrow Keys</strong> to move Pikachu around the screen</li>
              <li>• Avoid the colorful bullets coming from all directions</li>
              <li>• Survive for 15 seconds to get a science question</li>
              <li>• Answer correctly to advance to the next level</li>
              <li>• Each level increases bullet speed and difficulty</li>
              <li>• Wrong answers or getting hit ends the game</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PikachuScienceSurvival;
