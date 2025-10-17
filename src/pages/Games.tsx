import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import GameCard from "@/components/GameCard";
import { 
  Search, 
  Filter, 
  BookOpen,
  Gamepad2,
  Star,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

const Games = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const categories = [
    { id: "all", name: "All Games", icon: Gamepad2 },
    { id: "mathematics", name: "Mathematics", icon: BookOpen },
    { id: "science", name: "Science", icon: Star },
    { id: "history", name: "History", icon: TrendingUp },
    { id: "language", name: "Language", icon: BookOpen }
  ];

  const games = [
    {
      title: "Math Shooter — Faster Bubbles",
      subject: "Mathematics", 
      difficulty: "Medium" as const,
      duration: "8 min",
      players: 127,
      rating: 4.8,
      progress: 0,
      achievements: 0,
      category: "mathematics",
      path: "/games/math-shooter"
    },
    {
      title: "Pikachu Science Survival",
      subject: "Science", 
      difficulty: "Medium" as const,
      duration: "12 min",
      players: 89,
      rating: 4.7,
      progress: 0,
      achievements: 0,
      category: "science",
      path: "/games/pikachu-science"
    },
    {
      title: "Historical Dates Gun Shooting",
      subject: "History", 
      difficulty: "Medium" as const,
      duration: "10 min",
      players: 45,
      rating: 4.9,
      progress: 0,
      achievements: 0,
      category: "history",
      path: "/games/history-shooting"
    },
    {
      title: "Math Masters",
      subject: "Mathematics", 
      difficulty: "Medium" as const,
      duration: "15 min",
      players: 156,
      rating: 4.8,
      progress: 75,
      achievements: 2,
      category: "mathematics"
    },
    {
      title: "Science Quiz Pro",
      subject: "Science",
      difficulty: "Hard" as const,
      duration: "20 min", 
      players: 89,
      rating: 4.9,
      progress: 30,
      achievements: 1,
      category: "science"
    },
    {
      title: "Quick Math",
      subject: "Mathematics",
      difficulty: "Easy" as const,
      duration: "5 min",
      players: 234,
      rating: 4.5,
      progress: 100,
      achievements: 3,
      completed: true,
      category: "mathematics"
    },
    {
      title: "History Timeline",
      subject: "History",
      difficulty: "Medium" as const,
      duration: "18 min",
      players: 67,
      rating: 4.7,
      progress: 0,
      achievements: 0,
      category: "history"
    },
    {
      title: "Chemistry Lab",
      subject: "Science",
      difficulty: "Hard" as const,
      duration: "25 min",
      players: 123,
      rating: 4.8,
      progress: 45,
      achievements: 2,
      category: "science"
    },
    {
      title: "Word Wizard",
      subject: "Language",
      difficulty: "Easy" as const,
      duration: "12 min",
      players: 189,
      rating: 4.6,
      progress: 60,
      achievements: 1,
      category: "language"
    }
  ];

  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === "all" || game.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || game.difficulty.toLowerCase() === selectedDifficulty;
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pt-20 pb-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Game Center
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose from our collection of educational games
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{games.length}</div>
              <p className="text-sm text-muted-foreground">Total Games</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-success">
                {games.filter(g => g.completed).length}
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-warning">
                {games.filter(g => g.progress > 0 && !g.completed).length}
              </div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-accent">
                {games.reduce((sum, g) => sum + g.achievements, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h3 className="font-medium">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "transition-all duration-200",
                      selectedCategory === category.id && "gradient-primary"
                    )}
                  >
                    <category.icon className="h-4 w-4 mr-2" />
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-3">
              <h3 className="font-medium">Difficulty</h3>
              <div className="flex gap-2">
                {["all", "easy", "medium", "hard"].map((difficulty) => (
                  <Badge
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer capitalize transition-all duration-200 hover:scale-105",
                      selectedDifficulty === difficulty && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => setSelectedDifficulty(difficulty)}
                  >
                    {difficulty}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Games Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {selectedCategory === "all" ? "All Games" : 
                categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-muted-foreground">
              {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map((game, index) => {
                const { category, ...gameProps } = game;
                return (
                  <GameCard
                    key={index}
                    {...gameProps}
                    onPlay={() => {
                      if (game.path) {
                        navigate(game.path);
                      } else {
                        console.log(`Playing ${game.title}`);
                      }
                    }}
                    className="animate-fade-in"
                  />
                );
              })}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No games found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedDifficulty("all");
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Games;