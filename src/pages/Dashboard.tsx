import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ProgressRing from "@/components/ProgressRing";
import GameCard from "@/components/GameCard";
import AchievementBadge from "@/components/AchievementBadge";
import StatsCard from "@/components/StatsCard";
import { Trophy, Target, Clock, Star, ArrowRight, TrendingUp, BookOpen, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/userService";
import { GameService } from "@/services/gameService";
import { AuthService } from "@/services/auth";

const Dashboard = () => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  const { data: userProgress, isLoading: progressLoading } = useQuery({
    queryKey: ['userProgress'],
    queryFn: UserService.getUserProgress,
    enabled: isAuthenticated,
  });

  const { data: games = [], isLoading: gamesLoading } = useQuery({
    queryKey: ['games'],
    queryFn: () => GameService.getGames(),
    enabled: isAuthenticated,
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => GameService.getSubjects(),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle>Welcome to GameLearn</CardTitle>
            <CardDescription>
              Please sign in to access your dashboard and start learning through games.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Click the login button in the navigation to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (progressLoading || gamesLoading) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const currentUser = AuthService.getCurrentUser();

  return (
    <div className="min-h-screen bg-background pt-20 pb-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome back, {currentUser?.full_name?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to continue your learning adventure? Let's explore new challenges and level up your knowledge!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total XP"
            value={userProgress?.total_xp?.toString() || "0"}
            icon={Star}
          />
          <StatsCard
            title="Level"
            value={userProgress?.level?.toString() || "1"}
            icon={Trophy}
          />
          <StatsCard
            title="Games Played"
            value={userProgress?.games_played?.toString() || "0"}
            icon={Target}
          />
          <StatsCard
            title="Avg Score"
            value={userProgress?.average_score ? `${Math.round(userProgress.average_score)}%` : "0%"}
            icon={TrendingUp}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level Progress */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-subtle opacity-50" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Level Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center space-x-6">
                  <ProgressRing 
                    progress={userProgress ? (userProgress.current_level_xp / userProgress.next_level_xp) * 100 : 0} 
                    size="lg" 
                    strokeWidth={8}
                    className="text-primary"
                  />
                  <div className="text-center">
                    <div className="text-2xl font-bold">Level {userProgress?.level || 1}</div>
                    <div className="text-sm text-muted-foreground">
                      {userProgress?.current_level_xp || 0} / {userProgress?.next_level_xp || 100} XP
                    </div>
                    <Progress 
                      value={userProgress ? (userProgress.current_level_xp / userProgress.next_level_xp) * 100 : 0} 
                      className="mt-2" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Games */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Available Games
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {games.slice(0, 6).map((game) => (
                    <GameCard
                      key={game.id}
                      title={game.title}
                      subject={game.subject.name}
                      difficulty={game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1) as "Easy" | "Medium" | "Hard"}
                      duration={`${game.time_limit} min`}
                      players={0}
                      rating={4.5}
                      progress={0}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {userProgress?.badges?.map((badge) => (
                    <AchievementBadge
                      key={badge.id}
                      type={badge.tier}
                      title={badge.name}
                      description={badge.description}
                      earned={!!badge.earned_at}
                      size="sm"
                    />
                  )) || (
                    <p className="text-muted-foreground">No badges earned yet. Keep playing to unlock achievements!</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Challenge */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
              <CardHeader className="relative">
                <CardTitle className="text-lg">Weekly Challenge</CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">Complete 5 Math Games</p>
                  <p className="text-sm text-muted-foreground">
                    Progress: 3/5 games completed
                  </p>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reward</span>
                  <span className="font-medium text-primary">+500 XP</span>
                </div>
                <Button className="w-full gradient-primary">
                  Continue Challenge
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Subjects
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Trophy className="h-4 w-4 mr-2" />
                  View Leaderboard
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Practice Mode
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;