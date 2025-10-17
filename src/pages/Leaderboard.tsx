import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Medal, 
  Crown,
  TrendingUp,
  Calendar,
  Users,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

const Leaderboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [selectedCategory, setSelectedCategory] = useState("overall");

  const periods = [
    { id: "day", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "all", label: "All Time" }
  ];

  const categories = [
    { id: "overall", label: "Overall", icon: Trophy },
    { id: "mathematics", label: "Mathematics", icon: Medal },
    { id: "science", label: "Science", icon: Star },
    { id: "history", label: "History", icon: Crown }
  ];

  // Mock leaderboard data
  const leaderboardData = [
    {
      rank: 1,
      name: "Sarah Chen",
      avatar: "/api/placeholder/40/40",
      points: 8750,
      gamesPlayed: 124,
      averageScore: 94,
      badges: ["gold", "diamond"],
      level: 12,
      isCurrentUser: false
    },
    {
      rank: 2, 
      name: "Alex Rivera",
      avatar: "/api/placeholder/40/40",
      points: 8420,
      gamesPlayed: 118,
      averageScore: 92,
      badges: ["gold", "silver"],
      level: 11,
      isCurrentUser: true
    },
    {
      rank: 3,
      name: "Marcus Johnson",
      avatar: "/api/placeholder/40/40", 
      points: 7980,
      gamesPlayed: 105,
      averageScore: 89,
      badges: ["silver", "bronze"],
      level: 10,
      isCurrentUser: false
    },
    {
      rank: 4,
      name: "Emma Davis",
      avatar: "/api/placeholder/40/40",
      points: 7654,
      gamesPlayed: 98,
      averageScore: 91,
      badges: ["silver"],
      level: 10,
      isCurrentUser: false
    },
    {
      rank: 5,
      name: "David Kim",
      avatar: "/api/placeholder/40/40",
      points: 7321,
      gamesPlayed: 89,
      averageScore: 87,
      badges: ["bronze"],
      level: 9,
      isCurrentUser: false
    }
  ];

  const topThree = leaderboardData.slice(0, 3);
  const restOfLeaderboard = leaderboardData.slice(3);

  const getBadgeColor = (badge: string) => {
    const colors = {
      diamond: "text-gamification-diamond",
      gold: "text-gamification-gold",
      silver: "text-gamification-silver", 
      bronze: "text-gamification-bronze"
    };
    return colors[badge as keyof typeof colors] || "text-muted-foreground";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-gamification-gold" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gamification-silver" />;
    if (rank === 3) return <Trophy className="h-5 w-5 text-gamification-bronze" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-lg text-muted-foreground">
            See how you rank against other learners
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ranking Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Time Period */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Time Period
              </h3>
              <div className="flex flex-wrap gap-2">
                {periods.map((period) => (
                  <Button
                    key={period.id}
                    variant={selectedPeriod === period.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPeriod(period.id)}
                    className={cn(
                      "transition-all duration-200",
                      selectedPeriod === period.id && "gradient-primary"
                    )}
                  >
                    {period.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Category
              </h3>
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
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top 3 Podium */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          <CardHeader className="relative">
            <CardTitle className="text-center">Top Performers</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topThree.map((user, index) => (
                <div
                  key={user.rank}
                  className={cn(
                    "text-center p-6 rounded-xl transition-all duration-300 hover:scale-105",
                    user.rank === 1 && "order-2 md:order-2 bg-gradient-to-br from-gamification-gold/10 to-gamification-gold/5",
                    user.rank === 2 && "order-1 md:order-1 bg-gradient-to-br from-gamification-silver/10 to-gamification-silver/5", 
                    user.rank === 3 && "order-3 md:order-3 bg-gradient-to-br from-gamification-bronze/10 to-gamification-bronze/5",
                    user.isCurrentUser && "ring-2 ring-primary/50"
                  )}
                >
                  <div className="relative">
                    <Avatar className={cn(
                      "w-20 h-20 mx-auto mb-4 border-4",
                      user.rank === 1 && "border-gamification-gold",
                      user.rank === 2 && "border-gamification-silver",
                      user.rank === 3 && "border-gamification-bronze"
                    )}>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2">
                      {getRankIcon(user.rank)}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">{user.name}</h3>
                  {user.isCurrentUser && (
                    <Badge variant="secondary" className="mb-2">You</Badge>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    <div className="font-bold text-xl text-primary">
                      {user.points.toLocaleString()} pts
                    </div>
                    <div className="text-muted-foreground">
                      Level {user.level} • {user.gamesPlayed} games
                    </div>
                    <div className="text-muted-foreground">
                      {user.averageScore}% avg score
                    </div>
                    
                    {/* Badges */}
                    <div className="flex justify-center gap-1 mt-3">
                      {user.badges.map((badge, badgeIndex) => (
                        <Medal 
                          key={badgeIndex}
                          className={cn("h-4 w-4", getBadgeColor(badge))}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {restOfLeaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg transition-all duration-200 hover:bg-muted/50",
                    user.isCurrentUser && "bg-primary/5 border border-primary/20"
                  )}
                >
                  {/* Rank */}
                  <div className="w-8 flex justify-center">
                    {getRankIcon(user.rank)}
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {user.name}
                        {user.isCurrentUser && (
                          <Badge variant="secondary" className="text-xs">You</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Level {user.level}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="text-center">
                      <div className="font-medium text-foreground">{user.gamesPlayed}</div>
                      <div>Games</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-foreground">{user.averageScore}%</div>
                      <div>Avg Score</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-1">
                    {user.badges.map((badge, badgeIndex) => (
                      <Medal 
                        key={badgeIndex}
                        className={cn("h-4 w-4", getBadgeColor(badge))}
                      />
                    ))}
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <div className="font-bold text-lg text-primary">
                      {user.points.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;