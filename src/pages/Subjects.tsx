import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import ProgressRing from "@/components/ProgressRing";
import { 
  BookOpen, 
  Play, 
  Trophy, 
  Clock,
  Users,
  Star,
  Calculator,
  Atom,
  Globe,
  MessageSquare,
  Palette,
  Music
} from "lucide-react";
import { cn } from "@/lib/utils";

const Subjects = () => {
  const subjects = [
    {
      id: "mathematics",
      name: "Mathematics",
      icon: Calculator,
      description: "Numbers, equations, and problem solving",
      progress: 78,
      level: 7,
      totalGames: 45,
      completedGames: 35,
      points: 2450,
      achievements: 12,
      difficulty: "Intermediate",
      estimatedTime: "2h 30m",
      color: "bg-blue-500"
    },
    {
      id: "science",
      name: "Science", 
      icon: Atom,
      description: "Chemistry, Physics, and Biology",
      progress: 65,
      level: 5,
      totalGames: 38,
      completedGames: 25,
      points: 1890,
      achievements: 8,
      difficulty: "Intermediate",
      estimatedTime: "3h 15m",
      color: "bg-green-500"
    },
    {
      id: "history",
      name: "History",
      icon: Globe,
      description: "World events and civilizations",
      progress: 45,
      level: 3,
      totalGames: 32,
      completedGames: 14,
      points: 1200,
      achievements: 5,
      difficulty: "Beginner",
      estimatedTime: "4h 45m",
      color: "bg-amber-500"
    },
    {
      id: "language",
      name: "Language Arts",
      icon: MessageSquare,
      description: "Reading, writing, and communication",
      progress: 82,
      level: 8,
      totalGames: 40,
      completedGames: 33,
      points: 2680,
      achievements: 15,
      difficulty: "Advanced",
      estimatedTime: "1h 45m",
      color: "bg-purple-500"
    },
    {
      id: "art",
      name: "Art & Design",
      icon: Palette,
      description: "Creativity and visual arts",
      progress: 30,
      level: 2,
      totalGames: 25,
      completedGames: 8,
      points: 780,
      achievements: 3,
      difficulty: "Beginner",
      estimatedTime: "5h 30m",
      color: "bg-pink-500"
    },
    {
      id: "music",
      name: "Music Theory",
      icon: Music,
      description: "Notes, rhythm, and composition",
      progress: 55,
      level: 4,
      totalGames: 28,
      completedGames: 15,
      points: 1450,
      achievements: 7,
      difficulty: "Intermediate",
      estimatedTime: "3h 45m",
      color: "bg-indigo-500"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner": return "bg-success/10 text-success border-success/20";
      case "intermediate": return "bg-warning/10 text-warning border-warning/20";
      case "advanced": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const totalPoints = subjects.reduce((sum, subject) => sum + subject.points, 0);
  const totalAchievements = subjects.reduce((sum, subject) => sum + subject.achievements, 0);
  const averageProgress = Math.round(subjects.reduce((sum, subject) => sum + subject.progress, 0) / subjects.length);

  return (
    <div className="min-h-screen bg-background pt-20 pb-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Subject Library
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your progress across all learning areas
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{subjects.length}</div>
              <p className="text-sm text-muted-foreground">Subjects Available</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Star className="h-8 w-8 mx-auto mb-2 text-warning" />
              <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-success" />
              <div className="text-2xl font-bold">{totalAchievements}</div>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <ProgressRing progress={averageProgress} size="sm">
                <div className="text-center">
                  <div className="text-sm font-bold text-primary">{averageProgress}%</div>
                </div>
              </ProgressRing>
              <p className="text-sm text-muted-foreground mt-2">Average Progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <Card 
              key={subject.id}
              className={cn(
                "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-accent/5 before:opacity-0 before:transition-opacity hover:before:opacity-100"
              )}
            >
              {/* Header */}
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center text-white",
                      subject.color
                    )}>
                      <subject.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {subject.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Level {subject.level}
                      </p>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline"
                    className={cn("text-xs border", getDifficultyColor(subject.difficulty))}
                  >
                    {subject.difficulty}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  {subject.description}
                </p>
              </CardHeader>

              {/* Progress Section */}
              <CardContent className="relative space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-3" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Play className="w-3 h-3" />
                      <span>Games</span>
                    </div>
                    <div className="font-medium">
                      {subject.completedGames}/{subject.totalGames}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Time Left</span>
                    </div>
                    <div className="font-medium">{subject.estimatedTime}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star className="w-3 h-3" />
                      <span>Points</span>
                    </div>
                    <div className="font-medium">{subject.points.toLocaleString()}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Trophy className="w-3 h-3" />
                      <span>Achievements</span>
                    </div>
                    <div className="font-medium">{subject.achievements}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 gradient-primary hover:opacity-90 transition-opacity"
                    onClick={() => console.log(`Continue ${subject.name}`)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Continue
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => console.log(`View ${subject.name} details`)}
                  >
                    <Users className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Study Recommendations */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Recommended Study Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                  <BookOpen className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-medium">Focus on History</h3>
                <p className="text-sm text-muted-foreground">
                  Your lowest progress area. Spend 30 mins daily to catch up.
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto">
                  <Trophy className="h-8 w-8 text-warning" />
                </div>
                <h3 className="font-medium">Strengthen Mathematics</h3>
                <p className="text-sm text-muted-foreground">
                  You're doing great! Complete 3 more games to reach Level 8.
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium">Explore New Areas</h3>
                <p className="text-sm text-muted-foreground">
                  Try Art & Design or Music Theory to broaden your knowledge.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subjects;