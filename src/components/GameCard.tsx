import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Clock, 
  Star, 
  Users,
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GameCardProps {
  title: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  players: number;
  rating: number;
  progress?: number;
  achievements?: number;
  completed?: boolean;
  className?: string;
  path?: string;
  onPlay?: () => void;
}

const GameCard = ({
  title,
  subject,
  difficulty,
  duration,
  players,
  rating,
  progress = 0,
  achievements = 0,
  completed = false,
  className,
  path,
  onPlay
}: GameCardProps) => {
  const difficultyColors = {
    Easy: "bg-success/10 text-success border-success/20",
    Medium: "bg-warning/10 text-warning border-warning/20",
    Hard: "bg-destructive/10 text-destructive border-destructive/20"
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-accent/5 before:opacity-0 before:transition-opacity hover:before:opacity-100",
      completed && "ring-2 ring-success/50",
      className
    )}>
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {subject}
              </Badge>
              <Badge 
                variant="outline" 
                className={cn("text-xs border", difficultyColors[difficulty])}
              >
                {difficulty}
              </Badge>
            </div>
          </div>
          
          {completed && (
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-success" />
            </div>
          )}
        </div>

        {progress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>{players}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star className="w-3 h-3 fill-warning text-warning" />
            <span>{rating}</span>
          </div>
        </div>

        {/* Achievements */}
        {achievements > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="w-4 h-4 text-gamification-gold" />
            <span>{achievements} achievement{achievements !== 1 ? 's' : ''} earned</span>
          </div>
        )}

        {/* Play Button */}
        <Button 
          onClick={onPlay}
          className="w-full gradient-primary hover:opacity-90 transition-opacity"
          size="sm"
        >
          <Play className="w-4 h-4 mr-2" />
          {completed ? 'Play Again' : 'Start Game'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameCard;