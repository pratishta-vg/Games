import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import StatsCard from "@/components/StatsCard";
import AchievementBadge from "@/components/AchievementBadge";
import ProgressRing from "@/components/ProgressRing";
import { 
  User, 
  Edit3, 
  Trophy, 
  Star, 
  Calendar,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Medal,
  Settings,
  Mail,
  MapPin,
  Shield
} from "lucide-react";

const Profile = () => {
  // Mock user data - replace with actual data from your Django API
  const userData = {
    name: "Alex Rivera",
    email: "alex.rivera@email.com",
    location: "San Francisco, CA",
    joinDate: "January 2024",
    avatar: "/api/placeholder/120/120",
    level: 11,
    currentXP: 2450,
    nextLevelXP: 3000,
    totalPoints: 8420,
    gamesPlayed: 118,
    averageScore: 92,
    studyTime: "156h 30m",
    streak: 15,
    rank: 2,
    totalUsers: 50000
  };

  const achievements = [
    { type: "gold" as const, icon: "trophy" as const, title: "Quiz Master", description: "Complete 100 games", earned: true },
    { type: "diamond" as const, icon: "crown" as const, title: "Champion", description: "Reach top 3 ranking", earned: true },
    { type: "silver" as const, icon: "target" as const, title: "Precision", description: "Get 95% average score", earned: true },
    { type: "gold" as const, icon: "flame" as const, title: "Hot Streak", description: "15 day learning streak", earned: true },
    { type: "bronze" as const, icon: "star" as const, title: "Rising Star", description: "Complete first game", earned: true },
    { type: "silver" as const, icon: "medal" as const, title: "Dedicated", description: "Study for 100 hours", earned: true },
    { type: "diamond" as const, icon: "award" as const, title: "Legend", description: "Reach level 15", earned: false },
    { type: "gold" as const, icon: "zap" as const, title: "Speed Demon", description: "Complete game in under 2 min", earned: false }
  ];

  const earnedAchievements = achievements.filter(a => a.earned);
  const lockedAchievements = achievements.filter(a => !a.earned);

  const progressToNextLevel = (userData.currentXP / userData.nextLevelXP) * 100;

  const subjects = [
    { name: "Mathematics", progress: 78, level: 7, color: "bg-blue-500" },
    { name: "Science", progress: 65, level: 5, color: "bg-green-500" },
    { name: "History", progress: 45, level: 3, color: "bg-amber-500" },
    { name: "Language Arts", progress: 82, level: 8, color: "bg-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
          <CardContent className="relative pt-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar & Basic Info */}
              <div className="text-center md:text-left">
                <div className="relative inline-block">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback className="text-2xl">AR</AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 shadow-lg"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-4 space-y-2">
                  <h1 className="text-3xl font-bold">{userData.name}</h1>
                  <div className="space-y-1 text-muted-foreground">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{userData.email}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{userData.location}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {userData.joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Level & Progress */}
              <div className="flex-1 space-y-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Level {userData.level}
                    </Badge>
                    <Badge variant="outline" className="text-primary border-primary">
                      Rank #{userData.rank}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress to Level {userData.level + 1}</span>
                      <span className="font-medium">
                        {userData.currentXP.toLocaleString()} / {userData.nextLevelXP.toLocaleString()} XP
                      </span>
                    </div>
                    <Progress value={progressToNextLevel} className="h-3" />
                    <p className="text-xs text-muted-foreground">
                      {userData.nextLevelXP - userData.currentXP} XP needed to level up
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userData.totalPoints.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{userData.gamesPlayed}</div>
                    <div className="text-xs text-muted-foreground">Games Played</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">{userData.averageScore}%</div>
                    <div className="text-xs text-muted-foreground">Avg Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{userData.streak}</div>
                    <div className="text-xs text-muted-foreground">Day Streak</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detailed Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatsCard
                title="Study Time"
                value={userData.studyTime}
                icon={Clock}
                variant="primary"
                description="Total learning time"
              />
              <StatsCard
                title="Global Ranking"
                value={`#${userData.rank}`}
                icon={Trophy}
                variant="success"
                description={`Top ${Math.round((userData.rank / userData.totalUsers) * 100)}% of learners`}
              />
              <StatsCard
                title="Accuracy Rate"
                value={`${userData.averageScore}%`}
                icon={Target}
                variant="warning"
                trend={{ value: 5, isPositive: true }}
                description="Last 30 days"
              />
              <StatsCard
                title="Learning Streak"
                value={`${userData.streak} days`}
                icon={TrendingUp}
                variant="primary"
                description="Current streak"
              />
            </div>

            {/* Subject Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Subject Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {subjects.map((subject) => (
                    <div key={subject.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${subject.color}`} />
                          <span className="font-medium">{subject.name}</span>
                          <Badge variant="outline" className="text-xs">
                            Level {subject.level}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">{subject.progress}%</span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievement Showcase */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievement Showcase
                </CardTitle>
                <Badge variant="secondary">
                  {earnedAchievements.length}/{achievements.length}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Earned Achievements */}
                  <div>
                    <h3 className="font-medium mb-4">Earned ({earnedAchievements.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {earnedAchievements.map((achievement, index) => (
                        <AchievementBadge
                          key={index}
                          {...achievement}
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Locked Achievements */}
                  <div>
                    <h3 className="font-medium mb-4 text-muted-foreground">
                      Locked ({lockedAchievements.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {lockedAchievements.map((achievement, index) => (
                        <AchievementBadge
                          key={index}
                          {...achievement}
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level Progress Ring */}
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Level Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressRing progress={progressToNextLevel} size="lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{userData.level}</div>
                    <div className="text-sm text-muted-foreground">Level</div>
                  </div>
                </ProgressRing>
                <p className="text-sm text-muted-foreground mt-4">
                  {Math.round(progressToNextLevel)}% to next level
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Notification Preferences
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span>Completed Math Masters</span>
                  <span className="text-muted-foreground ml-auto">2h ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-warning" />
                  <span>Earned "Hot Streak" achievement</span>
                  <span className="text-muted-foreground ml-auto">1d ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Reached Level 11</span>
                  <span className="text-muted-foreground ml-auto">3d ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;